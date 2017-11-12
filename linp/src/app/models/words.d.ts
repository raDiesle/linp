export interface Words {
  de: { [id: string]: Word };
  en: { [id: string]: Word };
  sizes: { [languageKey: string]: number };
}

export interface Word {
  value: string;
}
