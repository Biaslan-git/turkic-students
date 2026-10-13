// MyMemory — бесплатный публичный переводчик без регистрации и карты. Лимит 5 000 символов
// в сутки с одного IP, а если передать контактный email (TRANSLATE_CONTACT_EMAIL) — 50 000.
// Один запрос принимает до 500 байт, поэтому длинный текст режем по предложениям.
const ENDPOINT = "https://api.mymemory.translated.net/get";
const MAX_CHUNK_CHARS = 220; // кириллица в UTF-8 — 2 байта на символ, запас под лимит 500 байт

type MyMemoryResponse = {
  responseStatus: number | string;
  quotaFinished?: boolean;
  responseData?: { translatedText?: string };
};

function splitIntoChunks(text: string): string[] {
  const sentences = text.match(/[^.!?…\n]+[.!?…]*\s*/g) ?? [text];
  const chunks: string[] = [];
  let current = "";

  const push = (piece: string) => {
    if (current && (current + piece).length > MAX_CHUNK_CHARS) {
      chunks.push(current.trim());
      current = "";
    }
    current += piece;
  };

  for (const sentence of sentences) {
    if (sentence.length <= MAX_CHUNK_CHARS) {
      push(sentence);
      continue;
    }
    // Одно слишком длинное предложение режем по словам.
    for (const word of sentence.split(/(\s+)/)) push(word);
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

function decodeEntities(value: string): string {
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

// Язык оригинала определяет сам сервис (Autodetect) — человек мог писать не на языке
// интерфейса. null — лимит исчерпан или сервис недоступен: сайт тогда показывает оригинал.
export async function translateText(text: string, targetLocale: string): Promise<string | null> {
  const email = process.env.TRANSLATE_CONTACT_EMAIL;
  const translated: string[] = [];

  try {
    for (const chunk of splitIntoChunks(text)) {
      const params = new URLSearchParams({ q: chunk, langpair: `Autodetect|${targetLocale}` });
      if (email) params.set("de", email);

      const response = await fetch(`${ENDPOINT}?${params}`, { signal: AbortSignal.timeout(15_000) });
      if (!response.ok) return null;

      const data = (await response.json()) as MyMemoryResponse;
      const result = data.responseData?.translatedText;
      // При исчерпанном лимите сервис отвечает 200 с предупреждением вместо перевода.
      if (data.quotaFinished || Number(data.responseStatus) !== 200 || !result || result.includes("MYMEMORY WARNING")) {
        return null;
      }
      translated.push(decodeEntities(result));
    }
  } catch (error) {
    console.error("Translation failed:", error);
    return null;
  }

  return translated.join(" ").trim() || null;
}
