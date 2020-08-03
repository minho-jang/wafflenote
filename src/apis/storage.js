export const getSlidesFromStorage = (key) => {
  console.log(key);
  return new Promise((resolve, reject) => {
    if (key != null) {
      chrome.storage.local.get(key, (obj) => {
        console.log(obj)
        resolve(obj);
      });
    } else {
      console.log("error")
        
      reject(null);
    }
  });
}

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
}
