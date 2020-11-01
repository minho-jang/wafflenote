import React, { useEffect } from 'react';
import pdf from 'pdfjs';
import { getImageBlob } from '../../apis/utils';
import LogoImageSrc from '../../static/logo_bg_1x_1248x224.jpg';

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

  // >> HEADER
  const logo = await imageToPdfImage(LogoImageSrc, 1248, 224);
  const header = doc.header().table({ widths: [null, null], paddingBottom: 1*pdf.cm }).row();
  header.cell().image(logo, { height: 1.8*pdf.cm});
  header.cell().text({ textAlign: 'right' })
    .add("실시간 화상 강의 정리/요약/분석 서비스", { fontSize: 9, lineHeight: 0.8 })
    .br()
    .add("Email: wafflenote2020@gmail.com", { fontSize: 9, lineHeight: 0.8 })
    .br()
    .add("Homepage: ", { fontSize: 9, lineHeight: 0.8 })
    .add("https://wafflenote.com", { fontSize: 9, lineHeight: 0.8, link: "https://wafflenote.com", underline: true, color: 0x569cd6});
  // << HEADER

  // >> FOOTER
  doc.footer()
   .pageNumber(function(curr, total) { return curr + ' / ' + total }, { textAlign: 'center', fontSize: 10 });
  // << FOOTER

  // >> First page. 핵심문장 및 분석
  const graph = await new Response(dataURItoBlob(document.getElementById('graph').toDataURL('image/jpeg'))).arrayBuffer();
  
  const noteTitleCell = doc.cell({ fontSize: 20, paddingBottom: 20});
  noteTitleCell.text(title);
  
  doc.text("요약노트");
  doc.text(summary, {fontSize: 11}).br();

  doc.text("분석");
  doc.image(new pdf.Image(graph));
  // << First page. 핵심문장 및 분석

  // >> Slide list. 대표이미지, 스크립트, 메모
  const imageArr = slides.map((item) => getImageBlob(item._id));
  const images = await Promise.all(imageArr);

  const arrayBuffers = images.map((item) => new Response(item).arrayBuffer());
  const result = await Promise.all(arrayBuffers);
  slides.forEach(async (item, index) => {
    doc.pageBreak();

    const titleCell_1 = doc.cell({ paddingBottom: 0.5*pdf.cm, fontSize: 16});
    titleCell_1.text(item.title);
    const contentCell_1 = doc.cell({ fontSize: 16 });
    contentCell_1.image(new pdf.Image(result[index]));

    const titleCell_2 = doc.cell({ paddingBottom: 0.3*pdf.cm, paddingTop: 0.5*pdf.cm, fontSize: 16});
    titleCell_2.text('스크립트');
    const contentCell_2 = doc.cell({ fontSize: 11 });
    contentCell_2.text(item.script);

    if (item.memo) {
      const titleCell_3 = doc.cell({ paddingBottom: 0.3*pdf.cm, paddingTop: 0.5*pdf.cm, fontSize: 16});
      titleCell_3.text('노트');
      const contentCell_3 = doc.cell({ fontSize: 11 });
      contentCell_3.text(item.memo);
    }

    // cell.text('Tag');
    // cell.text(item.tags)
  });
  // << Slide list. 대표이미지, 스크립트, 메모

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

function htmlImageElementToArrayBuffer(img) {
  return new Promise((resolve, reject) => {
    try {
      // Create canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      // Set width and height
      canvas.width = img.width;
      canvas.height = img.height;
      // Draw the image
      ctx.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        resolve(new Response(blob).arrayBuffer());
      }, 'image/jpeg');
    } catch(err) {
      reject(err);
    }
  });
}

function imageToPdfImage(src, w, h) {
  return new Promise(async (resolve, reject) => {
    const logoImage = new Image(w, h);
    logoImage.src = src;
    logoImage.onload = async function() {
      const logoArrayBuffer = await htmlImageElementToArrayBuffer(logoImage);
      resolve(new pdf.Image(logoArrayBuffer));
    }
    logoImage.onerror = function() {
      reject("Image load failed");
    }
  });
}


export default PDFMaker;
