const STORAGE_PREFIX = "airen_apikey_";
const XOR_KEY = "AiReN_2024_sEcUrE";

function xorCipher(input: string): string {
  let result = "";
  for (let i = 0; i < input.length; i++) {
    result += String.fromCharCode(
      input.charCodeAt(i) ^ XOR_KEY.charCodeAt(i % XOR_KEY.length)
    );
  }
  return result;
}

function encode(value: string): string {
  return btoa(xorCipher(value));
}

function decode(encoded: string): string {
  return xorCipher(atob(encoded));
}

export function saveApiKey(providerId: string, apiKey: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(`${STORAGE_PREFIX}${providerId}`, encode(apiKey));
}

export function getApiKey(providerId: string): string | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(`${STORAGE_PREFIX}${providerId}`);
  if (!stored) return null;
  return decode(stored);
}

export function deleteApiKey(providerId: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(`${STORAGE_PREFIX}${providerId}`);
}

export function hasApiKey(providerId: string): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(`${STORAGE_PREFIX}${providerId}`) !== null;
}
