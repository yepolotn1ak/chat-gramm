export async function encryptMessage(text: string, key: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);

  // Використовуємо window.crypto для браузера
  const webCrypto = window.crypto;

  const cryptoKey = await webCrypto.subtle.importKey(
    "raw",
    Uint8Array.from(atob(key), (c) => c.charCodeAt(0)),
    { name: "AES-GCM" },
    false,
    ["encrypt"]
  );

  const iv = webCrypto.getRandomValues(new Uint8Array(12));
  const encryptedData = await webCrypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    cryptoKey,
    data
  );

  return JSON.stringify({
    iv: Array.from(iv),
    data: btoa(String.fromCharCode(...new Uint8Array(encryptedData)))
  });
}

export async function decryptMessage(encryptedText: string, key: string): Promise<string> {
  const encryptedData: { iv: number[]; data: string } = JSON.parse(encryptedText);

  const webCrypto = window.crypto;

  const cryptoKey = await webCrypto.subtle.importKey(
    "raw",
    Uint8Array.from(atob(key), (c) => c.charCodeAt(0)),
    { name: "AES-GCM" },
    false,
    ["decrypt"]
  );

  const iv = new Uint8Array(encryptedData.iv);
  const encryptedArray = Uint8Array.from(atob(encryptedData.data), (c) => c.charCodeAt(0));
  const decryptedData = await webCrypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    cryptoKey,
    encryptedArray
  );

  return new TextDecoder().decode(decryptedData);
}
