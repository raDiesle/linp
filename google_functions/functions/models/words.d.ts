export interface Words {
  en: { [id: string]: Word };
  sizes: { [languageKey: string]: number };
}

export interface Word {
  value: string;
}
