import { timingSafeEqual, pbkdf2 as pbkdf2Callback } from "node:crypto";
import { promisify } from "node:util";
import { ENV } from "./env";

const pbkdf2 = promisify(pbkdf2Callback);

export async function verifyPassword(password: string, encodedHash: string): Promise<boolean> {
  if (!encodedHash) return false;

  const delimiter = encodedHash.includes("$") ? "$" : ":";
  const parts = encodedHash.split(delimiter);
  if (parts[0] === "pbkdf2" && parts.length === 4) {
    const iterations = Number(parts[1]);
    const salt = parts[2];
    const expected = Buffer.from(parts[3], "hex");

    if (!Number.isInteger(iterations) || iterations <= 0 || !salt || expected.length === 0) {
      return false;
    }

    const actual = await pbkdf2(password, salt, iterations, expected.length, "sha256");
    return expected.length === actual.length && timingSafeEqual(expected, actual);
  }

  if (!ENV.isProduction) {
    const expected = Buffer.from(encodedHash);
    const actual = Buffer.from(password);
    return expected.length === actual.length && timingSafeEqual(expected, actual);
  }

  return false;
}
