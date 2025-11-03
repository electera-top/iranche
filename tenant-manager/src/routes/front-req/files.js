const express = require('express');
const { executeQuery } = require('../../config/database');

const router = express.Router();

// Front request: public, unauthenticated minimal file info
router.get('/:id', async (req, res) => {
  try {
    const rows = await executeQuery(
      'SELECT id, storage_path, original_name, file_type, extension, file_size FROM files WHERE id = ?',
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Not Found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('FrontReq file error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;


