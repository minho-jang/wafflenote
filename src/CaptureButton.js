import React from 'react';

const port = chrome.runtime.connect({
  name: 'WaffleNote',
});

const CaptureButton = (props) => {
  const startCapture = () => {
    port.postMessage({ type: 'waffleNoteStart', text: 'start' }, '*');
  };

  return (
    <button onClick={startCapture}>
      Start
    </button>
  );
};

export default CaptureButton;
