export async function encryptMessage(text: string, key: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    Uint8Array.from(atob(key), (c) => c.charCodeAt(0)),
    { name: "AES-GCM" },
    false,
    ["encrypt"]
  );

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encryptedData = await crypto.subtle.encrypt(
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

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    Uint8Array.from(atob(key), (c) => c.charCodeAt(0)),
    { name: "AES-GCM" },
    false,
    ["decrypt"]
  );

  const iv = new Uint8Array(encryptedData.iv);
  const encryptedArray = Uint8Array.from(atob(encryptedData.data), (c) => c.charCodeAt(0));
  const decryptedData = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    cryptoKey,
    encryptedArray
  );

  return new TextDecoder().decode(decryptedData);
}
