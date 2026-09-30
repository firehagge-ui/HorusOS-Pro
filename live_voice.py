import asyncio
import msvcrt
import os
import queue
import sys
import time
import numpy as np
import sounddevice as sd
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

# Configuração de UTF-8 no Windows
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    print("\n❌ ERRO: GEMINI_API_KEY não foi encontrada no arquivo .env.")
    sys.exit(1)

# Configurações de áudio
INPUT_SAMPLE_RATE = 16000    # Gemini espera PCM 16kHz
OUTPUT_SAMPLE_RATE = 24000   # Gemini retorna PCM 24kHz
CHANNELS = 1                 # Mono
BLOCK_SIZE = 1024            # ~64ms por bloco

# Fila thread-safe de saída de áudio
audio_out_queue = queue.Queue()

class VoiceState:
    def __init__(self):
        self.is_gemini_speaking = False
        self.last_gemini_audio_time = 0.0
        self.current_speaker = None
        self.ambient_rms = 40.0
        self.speech_threshold = 80.0
        self.last_meter_update = 0.0

state = VoiceState()

def output_callback(outdata, frames, time_info, status):
    """Callback de reprodução de áudio."""
    bytes_needed = len(outdata)
    chunk = bytearray()

    # Detecta término da fala do Gemini
    if audio_out_queue.empty():
        if state.is_gemini_speaking and (time.time() - state.last_gemini_audio_time > 0.35):
            state.is_gemini_speaking = False

    while len(chunk) < bytes_needed:
        try:
            data = audio_out_queue.get_nowait()
            chunk.extend(data)
            state.is_gemini_speaking = True
            state.last_gemini_audio_time = time.time()
        except queue.Empty:
            break

    if len(chunk) < bytes_needed:
        chunk.extend(b"\x00" * (bytes_needed - len(chunk)))
    elif len(chunk) > bytes_needed:
        excess = bytes(chunk[bytes_needed:])
        audio_out_queue.queue.appendleft(excess)
        chunk = chunk[:bytes_needed]

    outdata[:] = bytes(chunk)

def clear_output_queue():
    """Interrompe a reprodução imediatamente."""
    while not audio_out_queue.empty():
        try:
            audio_out_queue.get_nowait()
        except queue.Empty:
            break
    state.is_gemini_speaking = False

def render_meter(rms, is_speaking):
    """Renderiza uma barra de volume visual no terminal para o usuário saber que o microfone está funcionando."""
    now = time.time()
    if now - state.last_meter_update < 0.1:
        return
    state.last_meter_update = now

    bars = min(12, int(rms / 40.0))
    meter = "▰" * bars + "▱" * (12 - bars)
    
    if is_speaking:
        status = "🎙️ [Detectando sua voz...]"
    else:
        status = "🎙️ [Ouvindo...]"
        
    print(f"\r  Volume Mic: [{meter}] {status} ", end="", flush=True)

async def send_audio_loop(session, audio_in_queue, stop_event):
    """Lê o microfone e envia para a API, com proteção contra auto-interrupção."""
    try:
        user_was_speaking = False
        silence_after_speech_count = 0

        while not stop_event.is_set():
            chunk = await audio_in_queue.get()
            if chunk is None:
                break

            # Se o Gemini está ativamente falando pelas caixas de som,
            # nós enviamos silêncio para que a voz dele não entre pelo microfone
            # e faça ele se interromper sozinho!
            if state.is_gemini_speaking or (time.time() - state.last_gemini_audio_time < 0.3):
                silence = b"\x00" * len(chunk)
                await session.send_realtime_input(
                    audio=types.Blob(data=silence, mime_type=f"audio/pcm;rate={INPUT_SAMPLE_RATE}")
                )
                continue

            # Calcula volume atual da sua fala
            audio_np = np.frombuffer(chunk, dtype=np.int16)
            rms = np.sqrt(np.mean(audio_np.astype(np.float32) ** 2))
            is_voice = (rms > state.speech_threshold)

            # Exibe barra de volume visual
            render_meter(rms, is_voice)

            # Envia áudio real para o Gemini
            await session.send_realtime_input(
                audio=types.Blob(data=chunk, mime_type=f"audio/pcm;rate={INPUT_SAMPLE_RATE}")
            )

            # Detecta término de fala do usuário para sinalizar fim de turno mais rápido
            if is_voice:
                user_was_speaking = True
                silence_after_speech_count = 0
            elif user_was_speaking:
                silence_after_speech_count += 1
                if silence_after_speech_count > 12:  # ~750ms de pausa
                    user_was_speaking = False
                    silence_after_speech_count = 0
                    print(f"\r  Volume Mic: [▱▱▱▱▱▱▱▱▱▱▱▱] ⏳ Pensando resposta...       ", end="", flush=True)

    except asyncio.CancelledError:
        pass
    except Exception as e:
        print(f"\n[Aviso Mic]: {e}")

async def receive_loop(session, stop_event):
    """Recebe e processa áudio e texto da resposta do Gemini."""
    try:
        async for response in session.receive():
            if stop_event.is_set():
                break

            server_content = response.server_content
            if server_content is None:
                continue

            if server_content.interrupted:
                clear_output_queue()
                print("\n⚡ [Interrompido]")
                state.current_speaker = None
                continue

            # Áudio retornado pelo Gemini
            if server_content.model_turn:
                for part in server_content.model_turn.parts:
                    if part.inline_data and part.inline_data.data:
                        state.is_gemini_speaking = True
                        state.last_gemini_audio_time = time.time()
                        audio_out_queue.put(part.inline_data.data)

            # Transcrição do usuário
            if server_content.input_transcription and server_content.input_transcription.text:
                text = server_content.input_transcription.text.strip()
                if text:
                    if state.current_speaker != "user":
                        print(f"\n\n👤 Você: {text}", flush=True)
                        state.current_speaker = "user"
                    else:
                        print(f" {text}", end="", flush=True)

            # Transcrição do Gemini
            if server_content.output_transcription and server_content.output_transcription.text:
                text = server_content.output_transcription.text
                if state.current_speaker != "gemini":
                    print(f"\n\n🤖 Gemini: {text}", end="", flush=True)
                    state.current_speaker = "gemini"
                else:
                    print(text, end="", flush=True)

            if server_content.turn_complete:
                state.current_speaker = None
                print("\n", flush=True)

    except asyncio.CancelledError:
        pass
    except Exception as e:
        print(f"\n[Aviso Conexão]: {e}")

async def keyboard_interrupt_loop(stop_event):
    """Permite pressionar Espaço ou Enter para interromper o Gemini a qualquer momento."""
    try:
        while not stop_event.is_set():
            if msvcrt.kbhit():
                key = msvcrt.getch()
                if key in (b"\r", b"\n", b" "):
                    clear_output_queue()
                    print("\n\n⚡ [Você interrompeu o Gemini! Pode falar agora...]\n", flush=True)
            await asyncio.sleep(0.05)
    except asyncio.CancelledError:
        pass

def calibrate_mic():
    """Mede o ruído do ambiente por 1 segundo para calibrar o microfone automaticamente."""
    print("Aferindo ruído do ambiente (fique em silêncio por 1 segundo)...")
    try:
        rec = sd.rec(int(INPUT_SAMPLE_RATE * 1.0), samplerate=INPUT_SAMPLE_RATE, channels=CHANNELS, dtype="int16")
        sd.wait()
        rms = np.sqrt(np.mean(rec.astype(np.float32) ** 2))
        state.ambient_rms = float(rms)
        state.speech_threshold = max(state.ambient_rms * 1.4, 50.0)
        print(f"✓ Microfone pronto! (Ruído base: {state.ambient_rms:.1f} | Limiar de fala: {state.speech_threshold:.1f})\n")
    except Exception as e:
        print(f"Aviso na calibração: {e}. Usando valores padrão.")
        state.speech_threshold = 70.0

async def main():
    print("=" * 65)
    print(" 🎙️  GEMINI LIVE VOICE CHAT - CONVERSA AO VIVO POR VOZ")
    print("=" * 65)
    print("• Modelo: gemini-3.1-flash-live-preview")
    print("• Voz: Aoede (Natural em Português)")
    print("• Tecla [Espaço] ou [Enter]: Interrompe o Gemini a qualquer momento")
    print("• Pressione Ctrl+C para encerrar.\n")

    # 1. Calibra o microfone do usuário
    calibrate_mic()

    print("Conectando ao Gemini...")
    client = genai.Client(api_key=API_KEY)

    system_prompt = (
        "Você é o Gemini em uma conversa de voz direta com o usuário em português do Brasil. "
        "Fale de forma natural, calorosa, descontraída e concisa (1 a 3 frases por turno na maioria das vezes). "
        "Não faça listas longas nem monólogos. Converse como um amigo ou colega inteligente em uma chamada de voz."
    )

    speech_config = types.SpeechConfig(
        voice_config=types.VoiceConfig(
            prebuilt_voice_config=types.PrebuiltVoiceConfig(voice_name="Aoede")
        )
    )

    config = types.LiveConnectConfig(
        response_modalities=[types.Modality.AUDIO],
        speech_config=speech_config,
        thinking_config=types.ThinkingConfig(thinking_level="minimal"),
        input_audio_transcription=types.AudioTranscriptionConfig(),
        output_audio_transcription=types.AudioTranscriptionConfig(),
        system_instruction=types.Content(
            parts=[types.Part(text=system_prompt)]
        )
    )

    loop = asyncio.get_running_loop()
    audio_in_queue = asyncio.Queue()
    stop_event = asyncio.Event()

    def input_callback(indata, frames, time_info, status):
        loop.call_soon_threadsafe(audio_in_queue.put_nowait, bytes(indata))

    input_stream = sd.RawInputStream(
        samplerate=INPUT_SAMPLE_RATE,
        channels=CHANNELS,
        dtype="int16",
        blocksize=BLOCK_SIZE,
        callback=input_callback
    )

    output_stream = sd.RawOutputStream(
        samplerate=OUTPUT_SAMPLE_RATE,
        channels=CHANNELS,
        dtype="int16",
        callback=output_callback,
        blocksize=512
    )

    try:
        async with client.aio.live.connect(model="gemini-3.1-flash-live-preview", config=config) as session:
            print("🟢 CONECTADO COM SUCESSO!\n")
            print("Pode falar no seu microfone quando a barra abaixo estiver verde/ativa.")
            print("-" * 65)

            with input_stream, output_stream:
                send_task = asyncio.create_task(send_audio_loop(session, audio_in_queue, stop_event))
                recv_task = asyncio.create_task(receive_loop(session, stop_event))
                kb_task = asyncio.create_task(keyboard_interrupt_loop(stop_event))

                # Saudação inicial curta
                await session.send_realtime_input(text="Olá! Cumprimente-me em uma frase curta para começarmos nossa conversa.")

                await asyncio.gather(send_task, recv_task, kb_task)

    except (KeyboardInterrupt, asyncio.CancelledError):
        print("\n\nEncerrando sessão de voz...")
    finally:
        stop_event.set()
        clear_output_queue()
        print("Sessão finalizada. Até logo!")

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nPrograma encerrado.")
