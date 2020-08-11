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

export const getSlideFromStorage = (key, index) => {
  return new Promise((resolve, reject) => {
    if (key != null) {
      chrome.storage.local.get(key, (obj) => {
        if (index >= obj[key].length ) reject("NullPointException");
        else resolve(obj[key][index]);
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
      });
    }
  });
};

export const getLastCapturedImage = (key) => {
  return new Promise((resolve, reject) => {
    if (key != null) {
      chrome.storage.local.get(key, (obj) => {
        if (obj[key].length == 0) resolve({});
        else resolve(obj[key][obj[key].length-1]);
      });
    } else {
      reject(null);
    }
  });
};
