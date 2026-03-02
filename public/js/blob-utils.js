let blobUrlMapUtils = {};
/**
 * Tạo blob URL an toàn với auto-tracking
 * @param {Blob|File} blob - Blob hoặc File object
 * @returns {string} Blob URL hoặc null nếu lỗi
 */
function createBlobUrl(blob, label) {

  if(typeof label === 'string' && blobUrlMapUtils[label]) {
    URL.revokeObjectURL(blobUrlMapUtils[label]);
    delete blobUrlMapUtils[label];
  }
  if (!blob) {
    console.warn('createBlobUrl: blob is null or undefined');
    return null;
  }
  
  try {
    const url = URL.createObjectURL(blob);
    if(typeof label === 'string') {
      blobUrlMapUtils[label] = url;
    }
    console.log('blobUrlMapUtils:', blobUrlMapUtils);
    return url;
  } catch (error) {
    console.error('Error creating blob URL:', error);
    return null;
  }
}

function clearAllBlobUrls() {
  if(typeof blobUrlMapUtils === 'object') {
    for(const label in blobUrlMapUtils) {
      try {
        URL.revokeObjectURL(blobUrlMapUtils[label]);
      } catch(e) {
        console.warn('Error revoking blob URL for label:', label, e);
      }
    }
    blobUrlMapUtils = {};
  }
}

function detectPlatform() {
  const userAgent = navigator.userAgent.toLowerCase();
  const isIpad = /ipad/.test(userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  const isTabletUA = /ipad|tablet|android(?!.*mobile)/i.test(navigator.userAgent);
  const isMobileUA = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent);

  const isTablet = isIpad || isTabletUA;
  const isMobile = isMobileUA && !isTablet;
  const isDesktop = !isMobile && !isTablet;
  const isBeeConvertApp = /beeconvertapp/i.test(userAgent);

  return {
    isMobile: isMobile,
    isTablet: isTablet,
    isDesktop: isDesktop,
    isBeeConvertApp: isBeeConvertApp,
    isIOS: /iphone|ipod|ipad/i.test(navigator.userAgent) || isIpad,
    isAndroid: /android/i.test(userAgent),
    isIpad: isIpad,
    isSafari: /safari/i.test(userAgent) && !/chrome|crios|fxios/i.test(userAgent),
    isChrome: /chrome|crios/i.test(userAgent),
    isFirefox: /firefox|fennec|fxios/i.test(userAgent),
  };
}