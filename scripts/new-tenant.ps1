Param(
  [Parameter(Mandatory = $true)][string]$Tenant,
  [string]$DbPrefix = "shop_"
)

$ErrorActionPreference = 'Stop'

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Resolve-Path (Join-Path $ScriptDir '..')

# Load environment variables from .env file FIRST
$EnvFile = Join-Path $ProjectRoot '.env'
if (Test-Path $EnvFile) {
    Get-Content $EnvFile | ForEach-Object {
        if ($_ -match '^([^#][^=]+)=(.*)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            Set-Variable -Name "env:$name" -Value $value -Scope Global
        }
    }
}

$SitesDir = Join-Path $ProjectRoot 'wordpress/sites'
$TemplateDir = Join-Path $ProjectRoot 'wordpress/site-template'

if (-not (Test-Path $SitesDir)) { New-Item -ItemType Directory -Path $SitesDir | Out-Null }

$TenantDir = Join-Path $SitesDir $Tenant
if (Test-Path $TenantDir) {
  Write-Host "Tenant '$Tenant' already exists at $TenantDir" -ForegroundColor Yellow
  exit 1
}

Write-Host "Creating tenant directory: $TenantDir" -ForegroundColor Cyan
New-Item -ItemType Directory -Path $TenantDir | Out-Null
New-Item -ItemType Directory -Path (Join-Path $TenantDir 'wp-content') | Out-Null
New-Item -ItemType Directory -Path (Join-Path $TenantDir 'wp-content/plugins') | Out-Null
New-Item -ItemType Directory -Path (Join-Path $TenantDir 'wp-content/themes') | Out-Null
New-Item -ItemType Directory -Path (Join-Path $TenantDir 'wp-content/uploads') | Out-Null

Copy-Item (Join-Path $TemplateDir 'index.php') -Destination (Join-Path $TenantDir 'index.php')
Copy-Item (Join-Path $TemplateDir 'wp-config.php') -Destination (Join-Path $TenantDir 'wp-config.php')

$DbName = "$DbPrefix$Tenant"

# Inject DB name and salts into wp-config.php
$ConfigPath = Join-Path $TenantDir 'wp-config.php'
Write-Host "Configuring $ConfigPath" -ForegroundColor Cyan
((Get-Content $ConfigPath -Raw).Replace('shop___TENANT__', $DbName)) | Set-Content $ConfigPath -NoNewline

try {
  $Salts = (Invoke-WebRequest -Uri 'https://api.wordpress.org/secret-key/1.1/salt/').Content
} catch {
  Write-Host "Warning: Could not fetch salts from WordPress API. Using placeholders." -ForegroundColor Yellow
  $Salts = "define('AUTH_KEY',         'changeme');`n" +
           "define('SECURE_AUTH_KEY',  'changeme');`n" +
           "define('LOGGED_IN_KEY',    'changeme');`n" +
           "define('NONCE_KEY',        'changeme');`n" +
           "define('AUTH_SALT',        'changeme');`n" +
           "define('SECURE_AUTH_SALT', 'changeme');`n" +
           "define('LOGGED_IN_SALT',   'changeme');`n" +
           "define('NONCE_SALT',       'changeme');`n"
}

$Config = Get-Content $ConfigPath -Raw
$Config = $Config.Replace('/*AUTH_SALTS*/', $Salts)
Set-Content $ConfigPath $Config

# Create database and grant
if (-not $env:DB_ROOT_PASSWORD) { Write-Host "Environment variable DB_ROOT_PASSWORD is not set." -ForegroundColor Red; exit 1 }
if (-not $env:DB_USER) { $env:DB_USER = 'wp' }
if (-not $env:DB_PASSWORD) { $env:DB_PASSWORD = 'wp_password' }

$CreateDb = "CREATE DATABASE IF NOT EXISTS `$DbName` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
$Grant = "GRANT ALL PRIVILEGES ON `$DbName`.* TO '$($env:DB_USER)'@'%' IDENTIFIED BY '$($env:DB_PASSWORD)'; FLUSH PRIVILEGES;"
$Sql = "$CreateDb $Grant"

Write-Host "Creating database '$DbName' and granting privileges..." -ForegroundColor Cyan
& docker compose exec -T db sh -lc "mysql -uroot -p$($env:DB_ROOT_PASSWORD) -e \"$Sql\"" | Out-Null

Write-Host "Tenant '$Tenant' created." -ForegroundColor Green
Write-Host "Next: Point DNS shop.$Tenant.your-domain to this server or edit hosts, then open http://$Tenant.your-domain (WP installer will run)." -ForegroundColor Green


