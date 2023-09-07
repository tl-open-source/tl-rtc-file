export const isProd = () => {
  return import.meta.env.PROD;
};

export const isDev = () => {
  return import.meta.env.DEV;
};
