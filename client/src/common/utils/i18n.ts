export const useTranslation = () => {
  const _lang = "en";
  return {
    _t: (key: string) => key,
    currentLang: _lang,
  };
};
