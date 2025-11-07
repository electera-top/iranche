# PowerShell script to deploy iranche.com from Windows
# این اسکریپت از ویندوز به سرور متصل شده و دیپلوی را انجام می‌دهد

$SERVER_IP = "178.239.147.72"
$SERVER_PORT = "12111002"
$SERVER_USER = "root"

Write-Host "╔════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   Deploying iranche.com from Windows           ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check if plink is available
if (!(Test-Path "plink.exe")) {
    Write-Host "⚠️  plink.exe not found in current directory" -ForegroundColor Yellow
    Write-Host "   Downloading PuTTY tools..." -ForegroundColor Yellow
    
    $plinkUrl = "https://the.earth.li/~sgtatham/putty/latest/w64/plink.exe"
    Invoke-WebRequest -Uri $plinkUrl -OutFile "plink.exe"
    
    Write-Host "✅ plink.exe downloaded successfully" -ForegroundColor Green
}

Write-Host "🔌 Connecting to server $SERVER_IP..." -ForegroundColor Cyan
Write-Host "   Port: $SERVER_PORT" -ForegroundColor Gray
Write-Host "   User: $SERVER_USER" -ForegroundColor Gray
Write-Host ""

# Create the deployment commands
$commands = @"
echo '======================================'
echo 'Installing Git...'
dnf install -y git

echo '======================================'
echo 'Cloning repository...'
cd /root
if [ -d 'iranche' ]; then
    cd iranche
    git pull
else
    git clone https://github.com/electera-top/iranche.git
    cd iranche
fi

echo '======================================'
echo 'Making scripts executable...'
cd deploy
chmod +x *.sh

echo '======================================'
echo 'Starting server setup...'
./server-setup.sh

echo '======================================'
echo 'Deploying application...'
./deploy-app.sh

echo '======================================'
echo 'Configuring Nginx...'
./setup-nginx.sh

echo '======================================'
echo 'Deployment completed!'
echo ''
echo 'Application status:'
pm2 status
echo ''
echo 'Your site should be available at: http://iranche.com'
echo ''
echo 'To setup SSL (HTTPS), run the following command on the server:'
echo '  cd /root/iranche/deploy && ./setup-ssl.sh'
echo ''
"@

# Save commands to a temporary file
$tempFile = [System.IO.Path]::GetTempFileName()
$commands | Out-File -FilePath $tempFile -Encoding ASCII

Write-Host "📝 Deployment commands prepared" -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  You will be prompted for the server password" -ForegroundColor Yellow
Write-Host "   (Password may not be visible while typing)" -ForegroundColor Gray
Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Execute commands on server
$plinkArgs = @(
    "-ssh",
    "-P", $SERVER_PORT,
    "$SERVER_USER@$SERVER_IP",
    "-batch",
    "-m", $tempFile
)

Write-Host ""
Write-Host "🚀 Starting deployment..." -ForegroundColor Green
Write-Host ""

& .\plink.exe $plinkArgs

# Clean up
Remove-Item $tempFile -Force

Write-Host ""
Write-Host "╔════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║   Deployment process completed!                ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Check your site at: http://iranche.com" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Yellow
Write-Host "   1. Verify the site is working: http://iranche.com" -ForegroundColor Gray
Write-Host "   2. Setup SSL for HTTPS (run on server):" -ForegroundColor Gray
Write-Host "      cd /root/iranche/deploy && ./setup-ssl.sh" -ForegroundColor Gray
Write-Host ""

