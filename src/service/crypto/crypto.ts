// src/service/crypto/crypto.ts

// Importing the crypto module from Node.js
import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

// Defining the CryptoService, which is responsible for encryption and decryption
@Injectable()
export class CryptoService {
  // Defining the encryption algorithm and generating a random key and initialization vector
  private readonly algorithm = 'aes-256-cbc';
  private readonly key = crypto.randomBytes(32); // Generate a random key
  private readonly iv = crypto.randomBytes(16); // Generate a random initialization vector

  // Method for encrypting a text string
  encrypt(text: string): string {
    const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  // Method for decrypting an encrypted text string
  decrypt(encryptedText: string): string {
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}
