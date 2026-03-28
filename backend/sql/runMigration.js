import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'nethmini123',
    multipleStatements: true,
  });

  try {
    // Drop existing database if it exists (clean slate)
    console.log('Cleaning up existing database...');
    await connection.query('DROP DATABASE IF EXISTS library_management_system');
    
    const sqlFile = path.join(__dirname, '01_schema_v2.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    console.log('Executing SQL schema migration...');
    await connection.query(sql);
    console.log('✓ Database schema created successfully!');
    console.log('✓ Tables: users, members, books, borrowings created with foreign keys');
    console.log('✓ Sample admin and user data inserted');
  } catch (err) {
    console.error('✗ Migration failed:', err.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

runMigration();
