const express = require('express');
const Joi = require('joi');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const FTP = require('ftp');
const { executeQuery } = require('../config/database');
const { cache } = require('../config/redis');

const router = express.Router();

// FTP Configuration
const FTP_CONFIG = {
  host: '5.9.3.36',
  user: 'iranchec',
  password: '2ZkO7Jd8Z5v',
  port: 21
};

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = '/app/uploads';
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx|mp4|mp3|zip|rar/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Validation schemas
const uploadFileSchema = Joi.object({
  category: Joi.string().valid('shops', 'users', 'core', 'categories', 'brands', 'chats', 'themes', 'plugins', 'services').required(),
  tenant_id: Joi.number().integer().positive().optional(),
  alt_text: Joi.string().max(255).optional()
});

// Get all files with filtering
router.get('/', async (req, res) => {
  try {
    const { category, tenant_id, file_type, page = 1, limit = 20 } = req.query;
    
    let whereClause = '';
    let params = [];
    
    if (category) {
      whereClause += ' WHERE category = ?';
      params.push(category);
    }
    
    if (tenant_id) {
      const clause = whereClause ? ' AND tenant_id = ?' : ' WHERE tenant_id = ?';
      whereClause += clause;
      params.push(tenant_id);
    }
    
    if (file_type) {
      const clause = whereClause ? ' AND file_type = ?' : ' WHERE file_type = ?';
      whereClause += clause;
      params.push(file_type);
    }

    // Get total count
    const countResult = await executeQuery(
      `SELECT COUNT(*) as total FROM files${whereClause}`,
      params
    );
    const total = countResult[0].total;

    // Get files with pagination
    const offset = (page - 1) * limit;
    const files = await executeQuery(`
      SELECT 
        f.id, f.original_name, f.stored_name, f.extension, f.file_type,
        f.uploaded_by, f.created_at, f.file_size, f.storage_path, f.alt_text,
        f.category, f.tenant_id,
        t.shop_name
      FROM files f
      LEFT JOIN tenants t ON f.tenant_id = t.id
      ${whereClause}
      ORDER BY f.created_at DESC
      LIMIT ${Number(limit)} OFFSET ${Number(offset)}
    `, params);

    // Format file sizes
    const formattedFiles = files.map(file => ({
      ...file,
      file_size_formatted: formatFileSize(file.file_size),
      created_at_formatted: new Date(file.created_at).toLocaleDateString('fa-IR')
    }));

    res.json({
      success: true,
      data: {
        files: formattedFiles,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch files'
    });
  }
});

// Upload file
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded',
        message: 'Please select a file to upload'
      });
    }

    const { error, value } = uploadFileSchema.validate(req.body);
    if (error) {
      // Delete uploaded file if validation fails
      await fs.unlink(req.file.path).catch(() => {});
      return res.status(400).json({
        error: 'Validation Error',
        details: error.details[0].message
      });
    }

    const { category, tenant_id, alt_text } = value;
    const file = req.file;

    // Determine file type
    const fileType = getFileType(file.mimetype);

    try {
      // Try to upload to FTP server
      let ftpPath;
      let ftpSuccess = false;
      try {
        ftpPath = await uploadToFTP(file.path, null, category);
        console.log('FTP upload successful:', ftpPath);
        ftpSuccess = true;
      } catch (ftpError) {
        console.error('FTP upload failed, using local storage:', ftpError.message);
        // If FTP fails, use local storage
        ftpPath = file.path;
        ftpSuccess = false;
      }
      
      // Insert file record with path (FTP or local)
      const result = await executeQuery(`
        INSERT INTO files 
        (original_name, stored_name, extension, file_type, uploaded_by, file_size, storage_path, alt_text, category, tenant_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        file.originalname,
        file.filename,
        path.extname(file.originalname).toLowerCase(),
        fileType,
        'admin', // TODO: Get from auth
        file.size,
        ftpPath, // Store path (FTP or local)
        alt_text || null,
        category,
        tenant_id || null
      ]);

      // Delete local file if FTP upload was successful
      if (ftpSuccess) {
        try {
          await fs.unlink(file.path);
          console.log('Local file deleted after successful FTP upload:', file.path);
        } catch (deleteError) {
          console.log('Failed to delete local file (non-critical):', deleteError.message);
        }
      }

      // Clear cache (optional)
      try {
        await cache.del('files:list');
      } catch (cacheError) {
        // Redis error is non-critical, continue
        console.log('Cache clear failed (non-critical):', cacheError.message);
      }

      res.json({
        success: true,
        message: 'File uploaded successfully',
        data: {
          id: result.insertId,
          original_name: file.originalname,
          stored_name: file.filename,
          file_size: file.size,
          file_size_formatted: formatFileSize(file.size),
          ftp_path: ftpPath
        }
      });
    } catch (ftpError) {
      console.error('FTP upload error:', ftpError);
      
      // Delete local file on FTP error
      await fs.unlink(file.path).catch(() => {});
      
      res.status(500).json({
        error: 'FTP Upload Error',
        message: 'Failed to upload file to server'
      });
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    
    // Delete uploaded file on error
    if (req.file) {
      await fs.unlink(req.file.path).catch(() => {});
    }
    
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to upload file'
    });
  }
});

// Delete file
router.delete('/:id', async (req, res) => {
  try {
    const fileId = parseInt(req.params.id);
    
    if (isNaN(fileId)) {
      return res.status(400).json({
        error: 'Invalid file ID',
        message: 'File ID must be a number'
      });
    }

    // Get file info
    const files = await executeQuery('SELECT * FROM files WHERE id = ?', [fileId]);
    if (files.length === 0) {
      return res.status(404).json({
        error: 'File not found',
        message: 'File not found'
      });
    }

    const file = files[0];

    // Delete physical file from FTP server
    try {
      await deleteFromFTP(file.storage_path);
    } catch (ftpError) {
      console.log('FTP delete error (non-critical):', ftpError.message);
    }

    // Delete database record
    await executeQuery('DELETE FROM files WHERE id = ?', [fileId]);

    // Clear cache
    try {
      await cache.del('files:list');
    } catch (cacheError) {
      console.log('Cache clear failed (non-critical):', cacheError.message);
    }

    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete file'
    });
  }
});

// Get file categories
router.get('/categories', async (req, res) => {
  try {
    const categories = [
      { value: 'shops', label: 'فایل های فروشگاه ها', icon: 'fas fa-store' },
      { value: 'users', label: 'کاربران', icon: 'fas fa-users' },
      { value: 'core', label: 'هسته', icon: 'fas fa-cog' },
      { value: 'categories', label: 'دسته بندی ها', icon: 'fas fa-tags' },
      { value: 'brands', label: 'برند ها', icon: 'fas fa-star' },
      { value: 'chats', label: 'چت ها', icon: 'fas fa-comments' },
      { value: 'themes', label: 'قالب ها', icon: 'fas fa-palette' },
      { value: 'plugins', label: 'افزونه ها', icon: 'fas fa-puzzle-piece' },
      { value: 'services', label: 'خدمات', icon: 'fas fa-concierge-bell' }
    ];

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch categories'
    });
  }
});

// Download file from FTP server
router.get('/download/:id', async (req, res) => {
  try {
    const fileId = parseInt(req.params.id);
    
    if (isNaN(fileId)) {
      return res.status(400).json({
        error: 'Invalid file ID',
        message: 'File ID must be a number'
      });
    }

    // Get file info
    const files = await executeQuery('SELECT * FROM files WHERE id = ?', [fileId]);
    if (files.length === 0) {
      return res.status(404).json({
        error: 'File not found',
        message: 'File not found'
      });
    }

    const file = files[0];
    
    // Download file from FTP and stream to client
    const client = new FTP();
    
    client.on('ready', () => {
      // Create full path for public_html
      const fullFilePath = `/public_html/${file.storage_path}`;
      
      client.get(fullFilePath, (err, stream) => {
        if (err) {
          client.end();
          return res.status(500).json({
            error: 'Download Error',
            message: 'Failed to download file from server'
          });
        }
        
        // Set appropriate headers
        res.setHeader('Content-Type', getMimeType(file.extension));
        res.setHeader('Content-Disposition', `attachment; filename="${file.original_name}"`);
        res.setHeader('Content-Length', file.file_size);
        
        // Stream file to client
        stream.pipe(res);
        
        stream.on('end', () => {
          client.end();
        });
        
        stream.on('error', (streamErr) => {
          client.end();
          console.error('Stream error:', streamErr);
          res.status(500).json({
            error: 'Stream Error',
            message: 'Failed to stream file'
          });
        });
      });
    });
    
    client.on('error', (err) => {
      console.error('FTP connection error:', err);
      res.status(500).json({
        error: 'FTP Connection Error',
        message: 'Failed to connect to file server'
      });
    });
    
    client.connect(FTP_CONFIG);
    
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to download file'
    });
  }
});

// Helper functions
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Upload file to FTP server
function uploadToFTP(filePath, remotePath, category) {
  return new Promise((resolve, reject) => {
    const client = new FTP();
    
    client.on('ready', () => {
      // Create full path for public_html
      const fullCategoryDir = `/public_html/uploads/${category}`;
      const fullFilePath = `/public_html/uploads/${category}/${path.basename(filePath)}`;
      
      // Create directory structure
      client.mkdir(fullCategoryDir, true, (err) => {
        if (err && err.code !== 550) { // 550 = directory already exists
          console.log('Directory creation error (non-critical):', err.message);
        }
        
        // Upload file with full path
        client.put(filePath, fullFilePath, (err) => {
          client.end();
          if (err) {
            reject(err);
          } else {
            resolve(`uploads/${category}/${path.basename(filePath)}`);
          }
        });
      });
    });
    
    client.on('error', (err) => {
      reject(err);
    });
    
    client.connect(FTP_CONFIG);
  });
}

// Delete file from FTP server
function deleteFromFTP(ftpPath) {
  return new Promise((resolve, reject) => {
    const client = new FTP();
    
    client.on('ready', () => {
      // Create full path for public_html
      const fullFilePath = `/public_html/${ftpPath}`;
      
      client.delete(fullFilePath, (err) => {
        client.end();
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
    
    client.on('error', (err) => {
      reject(err);
    });
    
    client.connect(FTP_CONFIG);
  });
}

function getFileType(mimetype) {
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype.startsWith('video/')) return 'video';
  if (mimetype.startsWith('audio/')) return 'audio';
  if (mimetype.includes('pdf') || mimetype.includes('document') || mimetype.includes('text')) return 'document';
  if (mimetype.includes('zip') || mimetype.includes('rar') || mimetype.includes('archive')) return 'archive';
  return 'other';
}

function getMimeType(extension) {
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.ppt': 'application/vnd.ms-powerpoint',
    '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    '.txt': 'text/plain',
    '.mp4': 'video/mp4',
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.zip': 'application/zip',
    '.rar': 'application/x-rar-compressed',
    '.7z': 'application/x-7z-compressed'
  };
  
  return mimeTypes[extension.toLowerCase()] || 'application/octet-stream';
}

module.exports = router;
