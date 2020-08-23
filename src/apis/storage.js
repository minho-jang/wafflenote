export const getSlidesFromStorage = async (noteName) => {
  try {
    const slides = [];
    const lastIndex = await getLastIndex();
    console.log(lastIndex)
    for (let i = 1; i <= lastIndex; i++) {
      const cur = await getOneSlideFromStorage(noteName, i);
      if (cur != null) {
        slides.push(cur);
      }
    }
    return slides;
  } catch (error) {
    throw(error);
  }
};

export const getLastIndex = () => {
  return new Promise((resolve, reject) => {
    const lastIndex = 'lastIndex';
    chrome.storage.local.get([lastIndex], (obj) => {
      if (!obj[lastIndex]) reject(null)
      resolve(obj[lastIndex]);
    })
  })
}

export const setSlideToStorage = (noteName, index, obj) => {
  const data = {};
  const key = noteName + index;
  data[key] = obj;
  return new Promise((resolve, reject) => {
    if (key != null && index != null) {
      chrome.storage.local.set(data, () => {
        console.log('save');
      });
    }
  });
};

export const getOneSlideFromStorage = (noteName, index) => {
  const key = noteName + index;
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

export const getLastCapturedImage = (noteName) => {
  return new Promise(async (resolve, reject) => {
    try {
      const lastIndex = await getLastIndex();
      const key = noteName + lastIndex;
      chrome.storage.local.get(key, (obj) => {
        if (!obj[key]) resolve({});
        else resolve(obj[key]);
      }); 
    } catch (error) {
      reject(error)
    }
  });
};

export const getState = () => {
  return new Promise((resolve, reject) => {
    try {
      const key = "state"
      chrome.storage.local.get(key, (obj) => {
        if (obj[key] === null) resolve(false)
        resolve(obj[key]);
      })
    } catch (error) {
      reject(error)
    }
  })
}

export const setState = (state) => {
  return new Promise((resolve, reject) => {
    try {
      const data = {};
      const key = "state"
      data[key] = state
      chrome.storage.local.set(data, (obj) => {
        console.log("state save", state)
      })
    } catch (error) {
      reject(error)
    }
  })
}