const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const AdmZip = require('adm-zip');
const FTP = require('ftp');
const { executeQuery } = require('../config/database');

const execAsync = promisify(exec);

// Use a path that exists in both containers via volume mount
const THEMES_DEMO_PATH = process.env.THEMES_DEMO_PATH || '/app/themes-demo';
const UPLOADS_PATH = process.env.UPLOADS_PATH || '/app/uploads';

const FTP_CONFIG = {
  host: '5.9.3.36',
  user: 'iranchec',
  password: '2ZkO7Jd8Z5v',
  port: 21
};

/**
 * Extract theme zip file to demo directory
 * @param {number} zipFileId - File ID of the zip file
 * @param {string} themeSlug - Theme slug (directory name)
 * @returns {Promise<{success: boolean, path: string, error?: string}>}
 */
/**
 * Download file from FTP server
 * @param {string} ftpPath - FTP path
 * @param {string} localPath - Local path to save file
 * @returns {Promise<boolean>}
 */
function downloadFromFTP(ftpPath, localPath) {
  return new Promise((resolve, reject) => {
    const client = new FTP();
    
    client.on('ready', () => {
      // Build FTP path - storage_path can be relative (uploads/shops/file.zip) or absolute (/public_html/uploads/shops/file.zip)
      let remotePath = ftpPath;
      
      // If path doesn't start with /, it's relative - prepend /public_html/
      if (!remotePath.startsWith('/')) {
        remotePath = `/public_html/${remotePath}`;
      }
      // If path doesn't start with /public_html/, prepend it
      else if (!remotePath.startsWith('/public_html/')) {
        remotePath = `/public_html${remotePath}`;
      }

      console.log('Downloading from FTP:', remotePath);

      client.get(remotePath, (err, stream) => {
        if (err) {
          client.end();
          return reject(err);
        }

        const writeStream = require('fs').createWriteStream(localPath);
        stream.pipe(writeStream);

        stream.on('end', () => {
          client.end();
          resolve(true);
        });

        stream.on('error', (streamErr) => {
          client.end();
          reject(streamErr);
        });

        writeStream.on('error', (writeErr) => {
          client.end();
          reject(writeErr);
        });
      });
    });

    client.on('error', (err) => {
      reject(err);
    });

    client.connect(FTP_CONFIG);
  });
}

async function extractThemeZip(zipFileId, themeSlug) {
  try {
    // Get file info from database
    const files = await executeQuery(
      'SELECT storage_path, stored_name, original_name FROM files WHERE id = ?',
      [zipFileId]
    );

    if (!files || files.length === 0) {
      return { success: false, error: 'File not found' };
    }

    const file = files[0];
    let zipPath = file.storage_path;
    let isFTP = false;

    // Check if path is FTP (doesn't start with / or contains public_html or starts with uploads/)
    // Local paths start with /app/uploads or /var/www, FTP paths are relative like uploads/shops/file.zip
    const isLocalPath = zipPath.startsWith('/app/') || zipPath.startsWith('/var/www/') || zipPath.startsWith('/tmp/');
    
    if (!isLocalPath) {
      isFTP = true;
      // Download from FTP to local temp file
      const tempZipPath = path.join(UPLOADS_PATH, `temp-${Date.now()}-${file.stored_name}`);
      try {
        console.log('Downloading zip from FTP:', zipPath);
        await downloadFromFTP(zipPath, tempZipPath);
        zipPath = tempZipPath;
        console.log('Downloaded to:', zipPath);
      } catch (ftpErr) {
        console.error('FTP download error:', ftpErr);
        return { success: false, error: `Failed to download from FTP: ${ftpErr.message}` };
      }
    } else {
      // Local file - check if it exists
      try {
        await fs.access(zipPath);
      } catch {
        // Try with stored_name in uploads
        zipPath = path.join(UPLOADS_PATH, file.stored_name);
        try {
          await fs.access(zipPath);
        } catch {
          // Try with original_name
          zipPath = path.join(UPLOADS_PATH, file.original_name);
          try {
            await fs.access(zipPath);
          } catch {
            return { success: false, error: 'Zip file not found on disk' };
          }
        }
      }
    }

    // Create theme demo directory
    const themeDemoPath = path.join(THEMES_DEMO_PATH, themeSlug);
    try {
      // Ensure parent directory exists and has correct permissions
      await fs.mkdir(THEMES_DEMO_PATH, { recursive: true, mode: 0o755 }).catch(() => {});
      await fs.mkdir(themeDemoPath, { recursive: true, mode: 0o755 });
    } catch (err) {
      console.error('Failed to create theme demo directory:', err);
      console.error('Theme demo path:', themeDemoPath);
      console.error('THEMES_DEMO_PATH:', THEMES_DEMO_PATH);
      return { success: false, error: `Failed to create demo directory: ${err.message}` };
    }

    // Extract zip file
    try {
      const zip = new AdmZip(zipPath);
      // Extract to a temp directory first
      const tempExtractPath = path.join(THEMES_DEMO_PATH, `${themeSlug}-temp`);
      zip.extractAllTo(tempExtractPath, true);
      
      // Check if extracted files are in a subdirectory with the same name
      const extractedFiles = await fs.readdir(tempExtractPath);
      let actualContentPath = tempExtractPath;
      
      // If only one directory exists and has the same name as theme slug, move its contents up
      if (extractedFiles.length === 1) {
        const firstItem = extractedFiles[0];
        const firstItemPath = path.join(tempExtractPath, firstItem);
        const stat = await fs.stat(firstItemPath);
        
        if (stat.isDirectory() && firstItem === themeSlug) {
          // Move contents of subdirectory to theme demo path
          const subDirPath = firstItemPath;
          const subDirContents = await fs.readdir(subDirPath);
          
          for (const item of subDirContents) {
            const src = path.join(subDirPath, item);
            const dest = path.join(themeDemoPath, item);
            // Remove destination if exists
            try {
              await fs.rm(dest, { recursive: true, force: true });
            } catch (e) {
              // Ignore if doesn't exist
            }
            // Use cp -r for directories, cp for files
            const itemStat = await fs.stat(src);
            if (itemStat.isDirectory()) {
              await execAsync(`cp -r "${src}" "${dest}"`);
              await fs.rm(src, { recursive: true, force: true });
            } else {
              await fs.rename(src, dest);
            }
          }
          
          // Remove temp directories
          await fs.rm(subDirPath, { recursive: true, force: true });
          await fs.rm(tempExtractPath, { recursive: true, force: true });
        } else {
          // No nested directory, move all files directly
          for (const item of extractedFiles) {
            const src = path.join(tempExtractPath, item);
            const dest = path.join(themeDemoPath, item);
            // Remove destination if exists
            try {
              await fs.rm(dest, { recursive: true, force: true });
            } catch (e) {
              // Ignore if doesn't exist
            }
            const itemStat = await fs.stat(src);
            if (itemStat.isDirectory()) {
              await execAsync(`cp -r "${src}" "${dest}"`);
              await fs.rm(src, { recursive: true, force: true });
            } else {
              await fs.rename(src, dest);
            }
          }
          await fs.rm(tempExtractPath, { recursive: true, force: true });
        }
      } else {
        // Multiple files/directories, move all directly
        for (const item of extractedFiles) {
          const src = path.join(tempExtractPath, item);
          const dest = path.join(themeDemoPath, item);
          // Remove destination if exists
          try {
            await fs.rm(dest, { recursive: true, force: true });
          } catch (e) {
            // Ignore if doesn't exist
          }
          const itemStat = await fs.stat(src);
          if (itemStat.isDirectory()) {
            await execAsync(`cp -r "${src}" "${dest}"`);
            await fs.rm(src, { recursive: true, force: true });
          } else {
            await fs.rename(src, dest);
          }
        }
        await fs.rm(tempExtractPath, { recursive: true, force: true });
      }

      // Delete temp file if it was downloaded from FTP
      if (isFTP) {
        try {
          await fs.unlink(zipPath);
        } catch (unlinkErr) {
          console.warn('Failed to delete temp zip file:', unlinkErr.message);
        }
      }

      // Install theme in WordPress
      const { installThemeInWordPress } = require('./themeDemoInstaller');
      try {
        const installResult = await installThemeInWordPress(themeSlug, themeDemoPath);
        if (installResult.success) {
          // Activate theme if WordPress is installed
          try {
            await execAsync(`docker exec shop_wordpress_core wp theme activate ${themeSlug} --path=/var/www/themes --allow-root`);
            console.log(`Theme ${themeSlug} activated in WordPress`);
          } catch (activateErr) {
            console.warn('Theme activation failed (non-critical):', activateErr.message);
          }
        } else {
          console.warn('Failed to install theme in WordPress:', installResult.error);
        }
      } catch (installErr) {
        console.warn('Theme WordPress installation failed (non-critical):', installErr.message);
      }

      // Update theme_demos status to 'active'
      await executeQuery(
        `UPDATE theme_demos SET status = 'active', updated_at = CURRENT_TIMESTAMP WHERE theme_slug = ?`,
        [themeSlug]
      );

      return { success: true, path: themeDemoPath };
    } catch (err) {
      console.error('Failed to extract zip:', err);
      // Clean up temp file if exists
      if (isFTP && zipPath) {
        try {
          await fs.unlink(zipPath);
        } catch (unlinkErr) {
          // Ignore cleanup errors
        }
      }
      return { success: false, error: 'Failed to extract zip file: ' + err.message };
    }
  } catch (err) {
    console.error('Theme extraction error:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Remove theme demo directory
 * @param {string} themeSlug - Theme slug
 * @returns {Promise<{success: boolean, error?: string}>}
 */
async function removeThemeDemo(themeSlug) {
  try {
    const themeDemoPath = path.join(THEMES_DEMO_PATH, themeSlug);
    try {
      await fs.rm(themeDemoPath, { recursive: true, force: true });
      return { success: true };
    } catch (err) {
      // Directory might not exist, that's okay
      if (err.code !== 'ENOENT') {
        console.error('Failed to remove theme demo:', err);
        return { success: false, error: err.message };
      }
      return { success: true };
    }
  } catch (err) {
    console.error('Remove theme demo error:', err);
    return { success: false, error: err.message };
  }
}

module.exports = {
  extractThemeZip,
  removeThemeDemo
};

