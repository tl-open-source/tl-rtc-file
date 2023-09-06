export const useUserAgent = () => {
  const uerAgent = window.navigator.userAgent;

  const isMobile = /Mobi|Android|iPhone/i.test(uerAgent);

  return {
    isMobile,
  };
};
