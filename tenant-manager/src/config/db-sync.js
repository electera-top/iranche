const fs = require('fs');
const path = require('path');
const { executeQuery } = require('./database');

async function runSqlFileOnce() {
  try {
    const initDir = path.resolve(__dirname, '../..', 'shared-database', 'init');
    if (!fs.existsSync(initDir)) {
      console.warn('DB sync skipped: init dir not found at', initDir);
      return;
    }

      const files = fs.readdirSync(initDir).filter(f => f.endsWith('.sql')).sort();
    for (const file of files) {
      const full = path.join(initDir, file);
      let sql = fs.readFileSync(full, 'utf8');
      
      // Remove comments (single line comments starting with --)
      sql = sql.replace(/--.*$/gm, '');
      
      // Split into statements, but preserve SET/PREPARE/EXECUTE/DEALLOCATE blocks
      const statements = [];
      let currentBlock = '';
      let inBlock = false;
      
      // First, identify and extract SET/PREPARE/EXECUTE/DEALLOCATE blocks
      const blockPattern = /(SET\s+@[^;]+;[\s\S]*?DEALLOCATE\s+PREPARE[^;]+;)/gi;
      const blocks = [];
      let blockMatch;
      
      while ((blockMatch = blockPattern.exec(sql)) !== null) {
        blocks.push({
          full: blockMatch[1],
          start: blockMatch.index,
          end: blockMatch.index + blockMatch[1].length
        });
      }
      
      // Remove blocks from SQL temporarily and replace with placeholders
      const placeholders = [];
      let modifiedSql = sql;
      blocks.reverse().forEach((block, index) => {
        const placeholder = `__BLOCK_${index}__`;
        placeholders.push(block.full);
        modifiedSql = modifiedSql.substring(0, block.start) + placeholder + modifiedSql.substring(block.end);
      });
      
      // Split remaining SQL by semicolon
      const simpleStatements = modifiedSql
        .split(';')
        .map(s => s.trim())
        .filter(s => s && !s.startsWith('--'));
      
      // Reconstruct statements, replacing placeholders with actual blocks
      for (const stmt of simpleStatements) {
        if (stmt.includes('__BLOCK_')) {
          // Replace placeholder with actual block
          const blockIndex = parseInt(stmt.match(/__BLOCK_(\d+)__/)[1]);
          statements.push(placeholders[blockIndex]);
        } else {
          statements.push(stmt);
        }
      }
      
      // Execute each statement
      for (const stmt of statements) {
        try {
          // Skip empty statements
          if (!stmt || stmt.trim() === '') {
            continue;
          }
          
          await executeQuery(stmt + (stmt.trim().endsWith(';') ? '' : ';'));
        } catch (e) {
          // Some errors are expected (like column already exists, duplicate key)
          // Log warning but continue
          const errorCode = e.code || e.errno;
          const isExpectedError = 
            errorCode === 'ER_DUP_FIELDNAME' || // Duplicate column
            errorCode === 'ER_DUP_KEYNAME' || // Duplicate key/index
            e.message?.includes('Duplicate') ||
            e.message?.includes('already exists');
          
          if (isExpectedError) {
            // Silent skip for expected errors
            continue;
          }
          
          console.warn(`DB sync (${file}) statement failed (continuing):`, e.message);
        }
      }
    }
    console.log('Database schema sync completed');
  } catch (err) {
    console.error('Database schema sync failed:', err);
  }
}

module.exports = { runSqlFileOnce };


