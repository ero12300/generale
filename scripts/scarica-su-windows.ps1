# Esegui su Windows (PowerShell) per scaricare il progetto nella cartella desiderata
# Tasto destro → "Esegui con PowerShell" oppure incolla in PowerShell

$Dest = "C:\Users\Eros\Desktop\Programmi Pronti\PROGETTI CON CODEX - OPENAI\immobiliare archevision\App Gestione Immobiliare"
$Repo = "https://github.com/ero12300/generale.git"

New-Item -ItemType Directory -Force -Path $Dest | Out-Null

if (Test-Path (Join-Path $Dest ".git")) {
    Write-Host "Aggiorno repository esistente in: $Dest"
    Set-Location $Dest
    git pull origin main
} else {
    if ((Get-ChildItem $Dest -Force | Measure-Object).Count -gt 0) {
        Write-Host "La cartella non e' vuota. Clono in sottocartella deal-desk..."
        $Dest = Join-Path $Dest "deal-desk-immobiliare"
        New-Item -ItemType Directory -Force -Path $Dest | Out-Null
    }
    Write-Host "Clono il progetto in: $Dest"
    git clone $Repo $Dest
    Set-Location $Dest
    git checkout main
}

Write-Host ""
Write-Host "Completato. Cartella progetto:"
Write-Host $Dest
Write-Host ""
Write-Host "Prossimi passi (opzionali):"
Write-Host "  pnpm install"
Write-Host "  pip install -r services/analytics/requirements.txt"
Write-Host "  pnpm dev"
