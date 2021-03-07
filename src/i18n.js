import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { en, it } from "./locales";

i18n.use(initReactI18next).init({
  resources: {
    en,
    it,
  },
  lng: (navigator.language || navigator.userLanguage).slice(0, 2),
  fallbackLng: "en",
  debug: false,
  ns: ["translations"],
  defaultNS: "translations",
  keySeparator: ".",
  interpolation: {
    escapeValue: false,
    formatSeparator: ",",
  },
  react: {
    wait: true,
    bindI18n: "languageChanged loaded",
    bindStore: "added removed",
    nsMode: "default",
  },
});

export default i18n;
