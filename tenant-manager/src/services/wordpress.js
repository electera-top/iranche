const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs').promises;
const execAsync = promisify(exec);

// Install WordPress for a tenant
const installWordPressForTenant = async (tenantConfig) => {
  const {
    subdomain,
    databaseName,
    databaseUser,
    databasePassword,
    adminUsername,
    adminPassword,
    owner_email,
    shop_name,
    plan_type
  } = tenantConfig;

  try {
    console.log(`Starting WordPress installation for tenant: ${subdomain}`);

    // Create tenant directory
    const tenantDir = `/app/tenants/${subdomain}`;
    await execAsync(`mkdir -p ${tenantDir}`);

    // Download WordPress core files
    console.log(`Downloading WordPress core files for tenant: ${subdomain}`);
    await execAsync(`php -d memory_limit=512M /usr/local/bin/wp core download --path=${tenantDir} --allow-root`);

    // Generate wp-config.php
    const wpConfigContent = generateWordPressConfig({
      databaseName,
      databaseUser,
      databasePassword,
      subdomain,
      adminUsername,
      adminPassword
    });

    await fs.writeFile(`${tenantDir}/wp-config.php`, wpConfigContent);

    // Install WordPress using WP-CLI
    const installCommand = `cd ${tenantDir} && wp core install \
      --url="http://${subdomain}.localhost" \
      --title="${shop_name}" \
      --admin_user="${adminUsername}" \
      --admin_password="${adminPassword}" \
      --admin_email="${owner_email}" \
      --skip-email \
      --allow-root`;

    await execAsync(installCommand);

    // Install and activate WooCommerce first
    console.log('Installing WooCommerce plugin...');
    await execAsync(`cd ${tenantDir} && wp --skip-themes plugin install woocommerce --activate --allow-root --force`);
    console.log('WooCommerce installed and activated.');

    // Install additional requested plugins
    console.log('Installing wp-persian plugin...');
    await execAsync(`cd ${tenantDir} && wp --skip-themes plugin install wp-persian --activate --allow-root --force`);
    console.log('wp-persian installed and activated.');

    console.log('Installing ml-slider (MetaSlider) plugin...');
    await execAsync(`cd ${tenantDir} && wp --skip-themes plugin install ml-slider --activate --allow-root --force`);
    console.log('ml-slider installed and activated.');

    // Install bitpayir plugin from local directory
    console.log('Installing bitpayir plugin...');
    await execAsync(`cp -r /app/shared-services/plugins/bitpayir-woocommerce2 ${tenantDir}/wp-content/plugins/`);
    await execAsync(`cd ${tenantDir} && wp --skip-themes plugin activate bitpayir-woocommerce2 --allow-root`);
    console.log('bitpayir plugin installed and activated.');

    // Configure upload quotas via MU-plugin (simplified)
    const muDir = `${tenantDir}/wp-content/mu-plugins`;
    await execAsync(`mkdir -p ${muDir}`);
    const quotaMb = plan_type === 'enterprise' ? 10240 : plan_type === 'premium' ? 2048 : plan_type === 'basic' ? 512 : 256;
    
    // Simple quota plugin
    const muPlugin = `<?php
/*
Plugin Name: Iranche Upload Limits
Description: Enforce per-tenant upload quota
Author: System
Version: 1.0
*/
if (!defined('ABSPATH')) { exit; }

add_filter('upload_size_limit','iranche_limit_upload_size');
function iranche_limit_upload_size($size){ 
    return ${quotaMb} * 1024 * 1024; 
}
`;
    await fs.writeFile(`${muDir}/iranche-upload-limits.php`, muPlugin);

    // Ensure themes directory exists and copy default theme into tenant
    console.log('Ensuring theme directory exists...');
    await execAsync(`mkdir -p ${tenantDir}/wp-content/themes`);
    console.log('Checking if iranche-default theme already exists in tenant...');
    try {
      await execAsync(`test -d ${tenantDir}/wp-content/themes/iranche-default`);
      console.log('Theme already present in tenant.');
    } catch (_) {
      console.log('Copying iranche-default theme into tenant...');
      await execAsync(`cp -r /app/shared-services/themes/iranche-default ${tenantDir}/wp-content/themes/`);
      console.log('Theme copied.');
    }

    // Set proper permissions for theme files
    await execAsync(`chmod -R 755 ${tenantDir}/wp-content/themes/iranche-default || true`);

    // Wait a moment for theme files to be properly copied
    await new Promise(resolve => setTimeout(resolve, 2000));

    // List available themes to debug
    console.log('Listing available themes (pre-activation)...');
    try {
      await execAsync(`cd ${tenantDir} && wp --skip-themes theme list --allow-root`);
    } catch (e) {
      console.log('Listing themes failed (pre-activation), continuing...', e?.stderr || e?.message);
    }

    // Activate the iranche-default theme
    try {
      await execAsync(`cd ${tenantDir} && wp theme activate iranche-default --allow-root`);
      console.log('Theme activated successfully');
    } catch (themeError) {
      console.log('Theme activation failed, trying alternative method...');
      // Fallback: Set theme via options
      await execAsync(`cd ${tenantDir} && wp option update template iranche-default --allow-root --skip-themes --skip-plugins`);
      await execAsync(`cd ${tenantDir} && wp option update stylesheet iranche-default --allow-root --skip-themes --skip-plugins`);
      console.log('Theme set via options fallback');
    }
    
    // Clear any caches that might interfere with theme activation
    await execAsync(`cd ${tenantDir} && wp cache flush --allow-root`);
    
    // Verify theme is properly set
    try {
      await execAsync(`cd ${tenantDir} && wp --skip-themes theme list --allow-root`);
    } catch (e) {
      console.log('Listing themes failed (post-activation), continuing...', e?.stderr || e?.message);
    }
    
    // Final verification - check current active theme
    await execAsync(`cd ${tenantDir} && wp option get template --allow-root`);
    await execAsync(`cd ${tenantDir} && wp option get stylesheet --allow-root`);

    console.log(`WordPress installation completed for tenant: ${subdomain}`);
    return true;

  } catch (error) {
    console.error(`Error installing WordPress for tenant:`, error);
    throw error;
  }
};

// Generate WordPress configuration
const generateWordPressConfig = (config) => {
  const {
    databaseName,
    databaseUser,
    databasePassword,
    subdomain,
    adminUsername,
    adminPassword
  } = config;

  return `<?php
define( 'DB_NAME', '${databaseName}' );
define( 'DB_USER', '${databaseUser}' );
define( 'DB_PASSWORD', '${databasePassword}' );
define( 'DB_HOST', '${process.env.WORDPRESS_DB_HOST || 'main-db'}' );
define( 'DB_CHARSET', 'utf8' );
define( 'DB_COLLATE', '' );

define( 'AUTH_KEY',         '${generateRandomKey()}' );
define( 'SECURE_AUTH_KEY',  '${generateRandomKey()}' );
define( 'LOGGED_IN_KEY',    '${generateRandomKey()}' );
define( 'NONCE_KEY',        '${generateRandomKey()}' );
define( 'AUTH_SALT',        '${generateRandomKey()}' );
define( 'SECURE_AUTH_SALT', '${generateRandomKey()}' );
define( 'LOGGED_IN_SALT',   '${generateRandomKey()}' );
define( 'NONCE_SALT',       '${generateRandomKey()}' );

define( 'WP_DEBUG', false );
define( 'WP_DEBUG_LOG', false );
define( 'WP_DEBUG_DISPLAY', false );

define( 'WP_HOME', 'http://${subdomain}.localhost' );
define( 'WP_SITEURL', 'http://${subdomain}.localhost' );

$table_prefix = 'wp_';

require_once ABSPATH . 'wp-settings.php';`;
};

// Generate random key for WordPress
const generateRandomKey = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

module.exports = {
  installWordPressForTenant,
  generateWordPressConfig
};
