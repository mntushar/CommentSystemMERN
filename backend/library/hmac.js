import crypto from "crypto";

export function createHmacSignature(secret, message) {
  return crypto
    .createHmac("sha256", secret)
    .update(message, "utf8")
    .digest("hex");
}


export function verifyHmacSignature(secret, message, receivedSignatureHex) {
  const expectedSignatureHex = crypto
    .createHmac("sha256", secret)
    .update(message, "utf8")
    .digest("hex");

  const expected = Buffer.from(expectedSignatureHex, "hex");
  const received = Buffer.from(receivedSignatureHex, "hex");

  if (expected.length !== received.length) return false;

  return crypto.timingSafeEqual(expected, received);
}
