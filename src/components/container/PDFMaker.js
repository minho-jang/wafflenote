import React, { useEffect } from 'react';
import pdf from 'pdfjs';
import { getImageBlob } from '../../apis/utils';

var oReq = new XMLHttpRequest();
let font;
oReq.open('GET', '/noto.otf', true);
oReq.responseType = 'arraybuffer';
oReq.onload = function (oEvent) {
  var arrayBuffer = oReq.response;
  if (arrayBuffer) {
    font = new pdf.Font(arrayBuffer);
  }
};

oReq.send(null);

const PDFMaker = async (slides, summary, title) => {
  try {
    
  const doc = new pdf.Document({
    font: font,
    padding: 10,
    paddingBottom: 0.5 * pdf.cm,
    fontSize: 16,
  });

  const graph = await new Response(dataURItoBlob(document.getElementById('graph').toDataURL('image/jpeg'))).arrayBuffer();
  doc.text(title, {fontSize: 20, paddingBottom: 30})
  
  doc.text("요약노트")
  doc.text(summary, {fontSize: 11})
  doc.text("분석")
  doc.image(new pdf.Image(graph));

  const imageArr = slides.map((item) => getImageBlob(item._id));
  const images = await Promise.all(imageArr);

  const arrayBuffers = images.map((item) => new Response(item).arrayBuffer());
  const result = await Promise.all(arrayBuffers);
  slides.forEach(async (item, index) => {
    doc.pageBreak();

    const cell = doc.cell({ paddingBottom: 0.5 * pdf.cm, fontSize: 16 });
    cell.text(item.title);
    cell.image(new pdf.Image(result[index]));
    cell.text('스크립트');
    cell.text(item.script, { fontSize: 11 })
    if (item.memo) {
      cell.text('노트');
      cell.text(item.memo, { fontSize: 11 })
    }
    // cell.text('Tag');
    // cell.text(item.tags)
  });

  const data = await doc.asBuffer();
  const PDF = new Blob([data], { type: 'application/pdf' });
  const a = window.URL.createObjectURL(PDF);
  window.open(a);

  await doc.end();
  } catch (error) {
    return error
  }
  return true;
};

function dataURItoBlob(dataURI) {
  if (!dataURI) return null;
  // convert base64/URLEncoded data component to raw binary data held in a string
  var byteString;
  if (dataURI.split(',')[0].indexOf('base64') >= 0) byteString = atob(dataURI.split(',')[1]);
  else byteString = unescape(dataURI.split(',')[1]);

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  // write the bytes of the string to a typed array
  var ia = new Uint8Array(byteString.length);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ia], { type: 'jpeg' });
}


export default PDFMaker;
