@echo off
REM Script para automatizar o deploy no GitHub (Windows)
REM Uso: auto-deploy.bat "mensagem do commit"

setlocal enabledelayedexpansion

REM Verifica se uma mensagem de commit foi fornecida
if "%~1"=="" (
    echo [WARN] Nenhuma mensagem de commit fornecida. Usando mensagem padrao.
    for /f "tokens=*" %%a in ('echo %date% %time%') do set datetime=%%a
    set "COMMIT_MSG=Auto-deploy: !datetime!"
) else (
    set "COMMIT_MSG=%~1"
)

echo [INFO] Iniciando deploy automatico...

REM Verifica se há mudanças para commitar
git diff --quiet >nul 2>&1
if %errorlevel% equ 0 (
    git diff --staged --quiet >nul 2>&1
    if !errorlevel! equ 0 (
        echo [WARN] Nenhuma mudanca detectada. Nada para commitar.
        exit /b 0
    )
)

REM Adiciona todas as mudanças
echo [INFO] Adicionando mudancas ao stage...
git add .

REM Verifica se há algo para commitar após o add
git diff --staged --quiet >nul 2>&1
if %errorlevel% equ 0 (
    echo [WARN] Nenhuma mudanca para commitar apos git add.
    exit /b 0
)

REM Commit das mudanças
echo [INFO] Realizando commit com mensagem: '!COMMIT_MSG!'
git commit -m "!COMMIT_MSG!"

REM Push para o GitHub
echo [INFO] Enviando mudancas para o GitHub...
git push origin main

echo [INFO] Deploy realizado com sucesso! ✅
echo [INFO] As mudancas foram enviadas para: https://github.com/fernandinhomartins40/fuseloja.git

pause 