@echo off
chcp 65001 >nul
set "DEST=C:\Users\Eros\Desktop\Programmi Pronti\PROGETTI CON CODEX - OPENAI\immobiliare archevision\App Gestione Immobiliare"
set "REPO=https://github.com/ero12300/generale.git"

echo Creazione cartella...
mkdir "%DEST%" 2>nul

if exist "%DEST%\.git" (
    echo Aggiorno progetto esistente...
    cd /d "%DEST%"
    git pull origin main
) else (
    echo Scarico il progetto Deal Desk...
    git clone %REPO% "%DEST%"
    cd /d "%DEST%"
    git checkout main
)

echo.
echo Completato: %DEST%
echo.
echo Prossimi passi:
echo   pnpm install
echo   pip install -r services\analytics\requirements.txt
echo   pnpm dev
echo.
pause
