const mysql = require('mysql2/promise');

(async () => {
  try {
    const conn = await mysql.createConnection({
      host: 'main-db',
      user: 'root',
      password: 'root_password_123'
    });
    
    await conn.execute('CREATE DATABASE IF NOT EXISTS themes_demo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
    await conn.query('GRANT ALL PRIVILEGES ON themes_demo.* TO \'shop_user\'@\'%\'');
    await conn.query('FLUSH PRIVILEGES');
    await conn.end();
    
    console.log('Database themes_demo created successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error creating database:', err);
    process.exit(1);
  }
})();

