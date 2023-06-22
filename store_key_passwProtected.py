import os
import json
import getpass

def storeKey(key, password):
  # Create a file to store the key.
  filename = 'key.json'
  with open(filename, 'w') as f:
    json.dump({'key': key}, f, indent=4)

  # Prompt the user for a password.
  password = getpass.getpass()

  # Encrypt the file with the password.
  os.system('openssl aes-256-cbc -salt -in key.json -out key.encrypted -pass stdin', input=password)

def loadKey(password):
  # Decrypt the file with the password.
  os.system('openssl aes-256-cbc -d -in key.encrypted -out key.json -pass stdin', input=password)

  # Load the key from the file.
  with open('key.json') as f:
    key = json.load(f)['key']

  return key
