// Шифрування повідомлення з використанням AES-GCM
export async function encryptMessage(text: string, key: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);

  // Імпорт ключа (з Base64 у формат CryptoKey)
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    Uint8Array.from(atob(key), (c) => c.charCodeAt(0)),
    { name: "AES-GCM" },
    false,
    ["encrypt"]
  );

  // Ініціалізаційний вектор (IV) - випадковий для кожного повідомлення
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encryptedData = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    cryptoKey,
    data
  );

  // Повертаємо зашифроване повідомлення як JSON-рядок
  return JSON.stringify({
    iv: Array.from(iv),
    data: btoa(String.fromCharCode(...new Uint8Array(encryptedData)))
  });
}

// Розшифрування повідомлення з використанням AES-GCM
export async function decryptMessage(encryptedText: string, key: string): Promise<string> {
  const encryptedData: { iv: number[]; data: string } = JSON.parse(encryptedText);

  // Імпорт ключа (з Base64 у формат CryptoKey)
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    Uint8Array.from(atob(key), (c) => c.charCodeAt(0)),
    { name: "AES-GCM" },
    false,
    ["decrypt"]
  );

  // Розшифрування з використанням збереженого IV
  const iv = new Uint8Array(encryptedData.iv);
  const encryptedArray = Uint8Array.from(atob(encryptedData.data), (c) => c.charCodeAt(0));
  const decryptedData = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    cryptoKey,
    encryptedArray
  );

  return new TextDecoder().decode(decryptedData);
}
