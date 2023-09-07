/* eslint-disable indent */
export const useUserAgent = () => {
  const uerAgent = window.navigator.userAgent;

  const isMobile = /Mobi|Android|iPhone/i.test(uerAgent);

  const getNetWorkState = () => {
    let networkStr = uerAgent.match(/NetType\/\w+/)
      ? uerAgent.match(/NetType\/\w+/)?.[0]
      : 'NetType/other';
    networkStr = networkStr?.toLowerCase().replace('nettype/', '');
    if (
      networkStr &&
      !['wifi', '5g', '3g', '4g', '2g', '3gnet', 'slow-2g'].includes(networkStr)
    ) {
      if ((navigator as any).connection) {
        networkStr = (navigator as any).connection.effectiveType;
      }
    }
    switch (networkStr) {
      case 'wifi':
        return 'wifi';
      case '5g':
        return '5g';
      case '4g':
        return '4g';
      case '3g' || '3gnet':
        return '3g';
      case '2g' || 'slow-2g':
        return '2g';
      default:
        return 'unknow';
    }
  };

  return {
    isMobile,
    getNetWorkState,
  };
};
