@echo off
chcp 65001 >nul
title Gemini Live Voice Chat - Conversa ao Vivo
cd /d "%~dp0"
echo ========================================================
echo   Iniciando Conversa de Voz com o Gemini...
echo ========================================================
"C:\Users\hagge\AppData\Local\Programs\Python\Python312\python.exe" live_voice.py
pause
