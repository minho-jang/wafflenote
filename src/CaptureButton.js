import React from 'react';

const port = chrome.runtime.connect({
  name: 'WaffleNote',
});

const CaptureButton = () => {
  const startCapture = () => {
    port.postMessage({ type: 'waffleNoteStart', text: 'start' }, '*');
  };

  return (
    <div onClick={startCapture} className="item">
      Button
    </div>
  );
};

export default CaptureButton;
