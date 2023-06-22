const crypto = require('crypto');

function generateKey() {
  // Generate a random 256-bit key using a cryptographically secure pseudorandom number generator.
  const key = crypto.randomBytes(32);

  // Convert the key to a hex string.
  const keyHex = key.toString('hex');

  // Create a salt for key derivation.
  const salt = crypto.randomBytes(16);

  // Derive an encryption key using a key derivation function (e.g., PBKDF2).
  const encryptionKey = crypto.pbkdf2Sync(keyHex, salt, 100000, 32, 'sha256');

  // Encrypt the key using AES-256.
  const encryptedKey = encryptKey(keyHex, encryptionKey);

  // Return the encrypted key and the salt as an object.
  return {
    encryptedKey: encryptedKey,
    salt: salt.toString('hex')
  };
}

function encryptKey(key, encryptionKey) {
  // Generate a random initialization vector (IV).
  const iv = crypto.randomBytes(16);

  // Create a cipher using AES-256 in CBC mode.
  const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, iv);

  // Encrypt the key using the cipher and convert it to a hex string.
  const encryptedKey = Buffer.concat([cipher.update(key, 'utf8'), cipher.final()]).toString('hex');

  // Return the encrypted key and the IV as a combined string.
  return iv.toString('hex') + encryptedKey;
}

function decryptKey(encryptedKey, encryptionKey) {
  // Extract the IV and the encrypted key from the combined string.
  const iv = Buffer.from(encryptedKey.slice(0, 32), 'hex');
  const keyHex = encryptedKey.slice(32);

  // Create a decipher using AES-256 in CBC mode.
  const decipher = crypto.createDecipheriv('aes-256-cbc', encryptionKey, iv);

  // Decrypt the key and convert it to a UTF-8 string.
  const decryptedKey = Buffer.concat([decipher.update(Buffer.from(keyHex, 'hex')), decipher.final()]).toString('utf8');

  // Return the decrypted key.
  return decryptedKey;
}

// Usage:
const generatedKey = generateKey();
console.log('Encrypted Key:', generatedKey.encryptedKey);
console.log('Salt:', generatedKey.salt);
console.log('Decrypted Key:', decryptKey(generatedKey.encryptedKey, crypto.pbkdf2Sync(generatedKey.salt, generatedKey.salt, 100000, 32, 'sha256')));
