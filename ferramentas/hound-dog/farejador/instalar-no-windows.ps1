# =============================================================================
# Hound Dog — instala os atalhos no Windows:
#  1. "Hound Dog Farejador" na área de trabalho (liga na mão, com janela e log na tela)
#  2. Inicialização automática ao ligar o PC (sem janela)
#  3. "Hound Dog" na área de trabalho (abre o painel no navegador)
# Rodar:  powershell -ExecutionPolicy Bypass -File ferramentas\hound-dog\farejador\instalar-no-windows.ps1
# Para desinstalar:  ... instalar-no-windows.ps1 -Remover
# =============================================================================
param([switch]$Remover)

$ErrorActionPreference = 'Stop'
$pastaFarejador = Split-Path -Parent $MyInvocation.MyCommand.Path
$pastaHD = Split-Path -Parent $pastaFarejador
$areaTrabalho = [Environment]::GetFolderPath('Desktop')
$inicializacao = [Environment]::GetFolderPath('Startup')
$painel = 'https://hound-dog-omega.vercel.app'

$atalhos = @(
  @{ Caminho = Join-Path $areaTrabalho 'Hound Dog Farejador.lnk'; Alvo = (Join-Path $pastaFarejador 'iniciar.cmd'); Desc = 'Liga o Farejador do Hound Dog (Claude, WhatsApp e Instagram)' },
  @{ Caminho = Join-Path $inicializacao 'Hound Dog Farejador.lnk'; Alvo = "$env:WINDIR\System32\wscript.exe"; Args = """$(Join-Path $pastaFarejador 'iniciar-oculto.vbs')"""; Desc = 'Farejador do Hound Dog (inicia com o Windows)' },
  @{ Caminho = Join-Path $areaTrabalho 'Hound Dog.url'; Url = $painel }
)

if ($Remover) {
  foreach ($a in $atalhos) { if (Test-Path $a.Caminho) { Remove-Item $a.Caminho -Force; Write-Host "removido: $($a.Caminho)" } }
  Write-Host "`nPronto. O Farejador não liga mais sozinho (o painel continua no ar)."
  exit 0
}

$sh = New-Object -ComObject WScript.Shell
foreach ($a in $atalhos) {
  if ($a.Url) {
    Set-Content -Path $a.Caminho -Value "[InternetShortcut]`r`nURL=$($a.Url)" -Encoding ASCII
  } else {
    $lnk = $sh.CreateShortcut($a.Caminho)
    $lnk.TargetPath = $a.Alvo
    if ($a.Args) { $lnk.Arguments = $a.Args }
    $lnk.WorkingDirectory = $pastaHD
    $lnk.Description = $a.Desc
    $lnk.Save()
  }
  Write-Host "criado: $($a.Caminho)"
}

Write-Host "`nPronto."
Write-Host "  • Ligar agora, com janela:  o atalho 'Hound Dog Farejador' na área de trabalho"
Write-Host "  • Ele passa a ligar sozinho toda vez que você entrar no Windows"
Write-Host "  • O painel abre em $painel"
Write-Host "  • Registros: $((Join-Path $pastaFarejador 'logs'))"
