const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);
// Use the mounted themes-demo path which is shared with wordpress-core
const WP_ROOT = '/var/www/themes';  // This is mounted in docker-compose.yml
const WP_CLI = 'wp'; // Will use WP-CLI from wordpress-core container

/**
 * Install WordPress for theme demos if not installed
 */
async function ensureWordPressInstalled() {
  try {
    const wpConfigPath = path.join(WP_ROOT, 'wp-config.php');
    
    // Check if WordPress is already installed
    try {
      await fs.access(wpConfigPath);
      console.log('WordPress already installed for theme demos');
      return true;
    } catch {
      // WordPress not installed, proceed with installation
    }

    console.log('Installing WordPress for theme demos...');
    
    // Check if wp-content exists
    const wpContentPath = path.join(WP_ROOT, 'wp-content');
    let wpContentExists = false;
    try {
      await fs.access(wpContentPath);
      wpContentExists = true;
    } catch {
      // Create wp-content directory
      await fs.mkdir(wpContentPath, { recursive: true });
    }

    // Create themes directory if not exists
    const themesPath = path.join(wpContentPath, 'themes');
    await fs.mkdir(themesPath, { recursive: true });

    // WordPress installation will be handled via WP-CLI through wordpress-core container
    // For now, just ensure directory structure exists
    return true;
  } catch (err) {
    console.error('Failed to ensure WordPress installation:', err);
    return false;
  }
}

/**
 * Install and activate theme in WordPress
 * @param {string} themeSlug - Theme slug
 * @param {string} extractedThemePath - Path to extracted theme files
 */
async function installThemeInWordPress(themeSlug, extractedThemePath) {
  try {
    // Ensure WordPress is installed
    await ensureWordPressInstalled();

    const wpThemesPath = path.join(WP_ROOT, 'wp-content', 'themes');
    const wpThemePath = path.join(wpThemesPath, themeSlug);

    // Ensure wp-content/themes directory exists
    try {
      await fs.mkdir(wpThemesPath, { recursive: true, mode: 0o755 });
    } catch (mkdirErr) {
      // Directory might already exist, that's okay
      console.log('wp-content/themes directory check:', mkdirErr.message);
    }

    // Check if theme directory already exists
    try {
      await fs.access(wpThemePath);
      // Remove existing theme
      console.log(`Removing existing theme at ${wpThemePath}`);
      await fs.rm(wpThemePath, { recursive: true, force: true });
    } catch {
      // Theme doesn't exist, that's okay
    }

    // Copy theme files to WordPress themes directory
    console.log(`Copying theme from ${extractedThemePath} to ${wpThemePath}`);
    await fs.mkdir(wpThemePath, { recursive: true, mode: 0o755 });
    
    const files = await fs.readdir(extractedThemePath);
    console.log(`Found ${files.length} items to copy`);
    
    // Check if there's only one directory with theme name (common WordPress zip structure)
    // If so, copy its contents directly to wpThemePath instead of creating a subdirectory
    let actualSourcePath = extractedThemePath;
    if (files.length === 1) {
      const firstItem = files[0];
      const firstItemPath = path.join(extractedThemePath, firstItem);
      try {
        const stat = await fs.stat(firstItemPath);
        if (stat.isDirectory()) {
          // Check if this directory contains style.css (indicates it's the theme root)
          const styleCssCheck = path.join(firstItemPath, 'style.css');
          try {
            await fs.access(styleCssCheck);
            // This is the theme root directory, use it as source
            actualSourcePath = firstItemPath;
            console.log(`Detected theme root directory: ${firstItem}, copying contents directly`);
          } catch {
            // style.css not found, check if it's a subdirectory we should use
            const subFiles = await fs.readdir(firstItemPath);
            const hasStyleCss = subFiles.includes('style.css');
            if (hasStyleCss || (subFiles.length > 0 && subFiles.some(f => f.endsWith('.php')))) {
              // This looks like a theme directory
              actualSourcePath = firstItemPath;
              console.log(`Detected theme directory: ${firstItem}, copying contents directly`);
            }
          }
        }
      } catch (checkErr) {
        // Ignore errors, use original path
        console.log(`Could not check first item: ${checkErr.message}`);
      }
    }
    
    // Copy from actual source path
    const sourceFiles = await fs.readdir(actualSourcePath);
    console.log(`Copying ${sourceFiles.length} items from ${actualSourcePath}`);
    
    for (const file of sourceFiles) {
      const src = path.join(actualSourcePath, file);
      const dest = path.join(wpThemePath, file);
      const stat = await fs.stat(src);
      
      try {
        if (stat.isDirectory()) {
          // Use cp -r for directories (preserve permissions and structure)
          await execAsync(`cp -r "${src}" "${dest}"`);
          console.log(`Copied directory: ${file}`);
        } else {
          await fs.copyFile(src, dest);
          console.log(`Copied file: ${file}`);
        }
      } catch (copyErr) {
        console.warn(`Failed to copy ${file}:`, copyErr.message);
        // Continue with other files
      }
    }

    // Verify theme files were copied (at least style.css should exist)
    const styleCssPath = path.join(wpThemePath, 'style.css');
    try {
      await fs.access(styleCssPath);
      console.log(`Theme ${themeSlug} successfully installed at: ${wpThemePath}`);
    } catch {
      console.warn(`Warning: style.css not found in ${wpThemePath}. Theme might not be valid.`);
      // List what we actually have
      const copiedFiles = await fs.readdir(wpThemePath);
      console.warn(`Files in theme directory: ${copiedFiles.join(', ')}`);
    }

    return { success: true, path: wpThemePath };
  } catch (err) {
    console.error('Failed to install theme in WordPress:', err);
    return { success: false, error: err.message };
  }
}

module.exports = {
  ensureWordPressInstalled,
  installThemeInWordPress
};

