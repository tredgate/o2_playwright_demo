import { cs } from "./cs";
import { en } from "./en";

export type i18nStrings = {
  usernamePlaceholder: string;
  passwordPlaceholder: string;
};

export function tegbTexts(): i18nStrings {
  const language = process.env.TEST_LANGUAGE || "en";
  let texts: i18nStrings;

  switch (language) {
    case "cs":
      texts = cs;
      break;
    case "en":
      texts = en;
      break;
    default:
      throw new Error(`Unsupported language: ${language}`);
  }
  return texts;
}

export function getCurrentLanguage(): string {
  return process.env.TEST_LANGUAGE || "en";
}
