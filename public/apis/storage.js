export const getSlidesFromStorage = (key) => {
  return new Promise((resolve, reject) => {
    if (key != null) {
      chrome.storage.local.get(key, (obj) => {
        resolve(obj[key]);
      });
    } else {
      reject(null);
    }
  });
};

export const setSlideToStorage = (key, obj) => {
  const data = {};
  data[key] = obj;
  return new Promise((resolve, reject) => {
    if (key != null) {
      chrome.storage.local.set(data, () => {
        console.log('save');
      });
    }
  });
};

export const getLastCapturedImage = (key) => {
  return new Promise((resolve, reject) => {
    if (key != null) {
      chrome.storage.local.get(key, (obj) => {
        resolve(obj);
      });
    } else {
      reject(null);
    }
  });
};
