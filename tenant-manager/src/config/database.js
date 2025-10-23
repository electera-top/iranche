const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || 'main-db',
  user: process.env.DB_USER || 'shop_user',
  password: process.env.DB_PASSWORD || 'your_secure_password',
  database: process.env.DB_NAME || 'shop_management',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Root database config for creating databases
const rootDbConfig = {
  host: process.env.DB_HOST || 'main-db',
  user: 'root',
  password: process.env.MYSQL_ROOT_PASSWORD || 'root_password_123',
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error.message);
    return false;
  }
};

// Initialize database connection
const initDatabase = async () => {
  let retries = 5;
  while (retries > 0) {
    const connected = await testConnection();
    if (connected) {
      break;
    }
    console.log(`Retrying database connection... (${retries} attempts left)`);
    retries--;
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
  
  if (retries === 0) {
    console.error('Failed to connect to database after multiple attempts');
    process.exit(1);
  }
};

// Execute query with error handling
const executeQuery = async (query, params = []) => {
  try {
    const [rows] = await pool.execute(query, params);
    return rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Execute transaction
const executeTransaction = async (queries) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    const results = [];
    for (const { query, params } of queries) {
      const [rows] = await connection.execute(query, params);
      results.push(rows);
    }
    
    await connection.commit();
    return results;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

// Create tenant database
const createTenantDatabase = async (databaseName, databaseUser, databasePassword) => {
  try {
    // Create root connection pool for database operations
    const rootPool = mysql.createPool(rootDbConfig);
    
    // Create database
    await rootPool.execute(`CREATE DATABASE IF NOT EXISTS ${databaseName}`);
    
    // Create user and grant privileges
    await rootPool.execute(`CREATE USER IF NOT EXISTS '${databaseUser}'@'%' IDENTIFIED BY '${databasePassword}'`);
    await rootPool.execute(`GRANT ALL PRIVILEGES ON ${databaseName}.* TO '${databaseUser}'@'%'`);
    await rootPool.execute('FLUSH PRIVILEGES');
    
    // Close root connection
    await rootPool.end();
    
    console.log(`Tenant database ${databaseName} created successfully`);
    return true;
  } catch (error) {
    console.error('Error creating tenant database:', error);
    throw error;
  }
};

// Drop tenant database
const dropTenantDatabase = async (databaseName, databaseUser) => {
  try {
    // Revoke privileges and drop user
    await executeQuery(`REVOKE ALL PRIVILEGES ON ${databaseName}.* FROM '${databaseUser}'@'%'`);
    await executeQuery(`DROP USER IF EXISTS '${databaseUser}'@'%'`);
    
    // Drop database
    await executeQuery(`DROP DATABASE IF EXISTS ${databaseName}`);
    
    console.log(`Tenant database ${databaseName} dropped successfully`);
    return true;
  } catch (error) {
    console.error('Error dropping tenant database:', error);
    throw error;
  }
};

// Check if database exists
const databaseExists = async (databaseName) => {
  try {
    const [rows] = await pool.execute(
      'SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?',
      [databaseName]
    );
    return rows.length > 0;
  } catch (error) {
    console.error('Error checking database existence:', error);
    return false;
  }
};

module.exports = {
  pool,
  executeQuery,
  executeTransaction,
  createTenantDatabase,
  dropTenantDatabase,
  databaseExists,
  initDatabase,
  testConnection
};
