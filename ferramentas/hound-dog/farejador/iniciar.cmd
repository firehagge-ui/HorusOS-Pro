@echo off
title Hound Dog - Farejador
cd /d "%~dp0.."
echo.
echo   HOUND DOG - FAREJADOR
echo   Deixe esta janela aberta. Ela roda o Claude, o WhatsApp e o Instagram do painel.
echo   Painel: https://hound-dog-omega.vercel.app
echo.
node farejador\index.mjs
echo.
echo   O Farejador parou. Pressione qualquer tecla para fechar.
pause > nul
