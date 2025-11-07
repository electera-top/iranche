# Manual deployment script - opens SSH connection for you to run commands
# این اسکریپت ساده‌تر است و فقط به SSH متصل می‌شود

$SERVER_IP = "178.239.147.72"
$SERVER_PORT = "12111002"
$SERVER_USER = "root"

Write-Host "╔════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   SSH Connection to iranche.com Server         ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Server Information:" -ForegroundColor Yellow
Write-Host "   IP:   $SERVER_IP" -ForegroundColor Gray
Write-Host "   Port: $SERVER_PORT" -ForegroundColor Gray
Write-Host "   User: $SERVER_USER" -ForegroundColor Gray
Write-Host ""

# Check if plink is available
if (Test-Path "plink.exe") {
    Write-Host "✅ Using plink.exe for SSH connection" -ForegroundColor Green
    Write-Host ""
    Write-Host "🔌 Connecting to server..." -ForegroundColor Cyan
    Write-Host ""
    
    & .\plink.exe -ssh -P $SERVER_PORT "$SERVER_USER@$SERVER_IP"
}
else {
    Write-Host "⚠️  plink.exe not found" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "📝 Use this SSH command:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "   ssh -p $SERVER_PORT $SERVER_USER@$SERVER_IP" -ForegroundColor White
    Write-Host ""
    Write-Host "After connecting, run these commands:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   dnf install -y git" -ForegroundColor Gray
    Write-Host "   cd /root" -ForegroundColor Gray
    Write-Host "   git clone https://github.com/electera-top/iranche.git" -ForegroundColor Gray
    Write-Host "   cd iranche/deploy" -ForegroundColor Gray
    Write-Host "   chmod +x *.sh" -ForegroundColor Gray
    Write-Host "   ./full-deploy.sh" -ForegroundColor Gray
    Write-Host ""
    
    # Copy command to clipboard if possible
    $sshCommand = "ssh -p $SERVER_PORT $SERVER_USER@$SERVER_IP"
    try {
        Set-Clipboard -Value $sshCommand
        Write-Host "✅ SSH command copied to clipboard!" -ForegroundColor Green
    }
    catch {
        Write-Host "ℹ️  Copy the SSH command above" -ForegroundColor Cyan
    }
}

Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

