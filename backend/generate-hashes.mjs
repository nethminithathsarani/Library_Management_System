import bcrypt from 'bcryptjs';

async function generateHashes() {
  const adminPassword = 'admin123';
  const userPassword = 'user123';

  const adminHash = await bcrypt.hash(adminPassword, 10);
  const userHash = await bcrypt.hash(userPassword, 10);

  console.log('\n=== Generated Password Hashes ===\n');
  console.log(`Admin (password: "${adminPassword}"):`);
  console.log(`  Hash: ${adminHash}\n`);
  console.log(`User (password: "${userPassword}"):`);
  console.log(`  Hash: ${userHash}\n`);
  console.log('=== Copy these into your SQL schema 01_schema_v2.sql ===\n');
}

generateHashes().catch(console.error);
