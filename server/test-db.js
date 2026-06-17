const db = require('./db');

try {
  console.log('--- Testing Database Insert ---');
  const insert = db.prepare(`
    INSERT INTO submissions (full_name, mobile_number, email, city, message)
    VALUES (?, ?, ?, ?, ?)
  `);
  
  const result = insert.run(
    'Test User',
    '+1234567890',
    'test@aetherflow.com',
    'San Francisco',
    'Hello, this is a test message to verify SQLite storage.'
  );
  
  console.log('Insert Result:', result);
  
  console.log('--- Testing Database Read ---');
  const rows = db.prepare('SELECT * FROM submissions').all();
  console.log('All submissions in DB:', rows);
  
  console.log('--- Cleaning Up Test Record ---');
  if (result.lastInsertRowid) {
    db.prepare('DELETE FROM submissions WHERE id = ?').run(result.lastInsertRowid);
    // Reset autoincrement sequence so next insert starts at 1
    db.prepare("DELETE FROM sqlite_sequence WHERE name = 'submissions'").run();
    console.log('Cleaned up test record and reset sequence counter.');
  }
  
  console.log('Database verification check: PASSED');
} catch (error) {
  console.error('Database verification check: FAILED', error);
  process.exit(1);
}
