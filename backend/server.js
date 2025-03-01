import express from 'express';
import dotenv from 'dotenv';
import mysql from 'mysql';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const port = process.env.PORT || 5000;

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', 
  password: 'nethmini123', 
  database: 'library_management', 
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed: ', err.stack);
  } else {
    console.log('Connected to database');
  }
});

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
