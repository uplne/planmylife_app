export const parseUrlParameters = (): Record<string, string> => {
  const query = window.location.search.replace(/\/$/, "");

  if (!query) {
    return {};
  }

  return query
    .substring(1)
    .split("&")
    .map((item) => item.split("="))
    .reduce(
      (obj, [key, value]) => ({
        ...obj,
        [key]: value,
      }),
      {},
    );
};

export const parseUrlPathname = () => window.location.pathname;
