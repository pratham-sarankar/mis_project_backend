import crypto from "crypto";

export default class CipherService {
  static encryptMap(map) {
    const mapStr = JSON.stringify(map);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      "aes-256-cbc",
      Buffer.from(process.env.ENCRYPTION_KEY),
      iv,
    );
    let encrypted = cipher.update(mapStr);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    const token = iv.toString("hex") + ":" + encrypted.toString("hex");
    return token;
  }

  static decryptMap(token) {
    const tokenParts = token.split(":");
    const iv = Buffer.from(tokenParts.shift(), "hex");
    const encryptedText = Buffer.from(tokenParts.join(":"), "hex");
    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      Buffer.from(process.env.ENCRYPTION_KEY),
      iv,
    );
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return JSON.parse(decrypted.toString());
  }
}
