import React, { useEffect } from 'react';
import pdf from 'pdfjs';

const PDFMaker = async (slides) => {
  const doc = new pdf.Document({
    font: require('pdfjs/font/Times-Roman'),
    padding: 10
  })

  const imageArr = slides.map((item) => new Response(dataURItoBlob(item.slide)).arrayBuffer());
  const result = await Promise.all(imageArr);
  
  slides.forEach(async (item, index) => {
    const cell = doc.cell({ paddingBottom: 0.5 * pdf.cm, fontSize: 16, font: require('pdfjs/font/Helvetica') })
    cell.text(item.title, {  })
    cell.image(new pdf.Image(result[index]));
    cell.text("Script")
    // cell.text(item.script)
    cell.text("Note")
    // cell.text(item.note)
    cell.text("Tag")
    // cell.text(item.tag)
    
  })

  const data = await doc.asBuffer()
  const PDF = new Blob([data], { type:'application/pdf' })
  const a = window.URL.createObjectURL(PDF)
  window.open(a)
  

  await doc.end()
}

function dataURItoBlob(dataURI) {
  if (!dataURI) return null;
  // convert base64/URLEncoded data component to raw binary data held in a string
  var byteString;
  if (dataURI.split(",")[0].indexOf("base64") >= 0)
    byteString = atob(dataURI.split(",")[1]);
  else byteString = unescape(dataURI.split(",")[1]);

  // separate out the mime component
  var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

  // write the bytes of the string to a typed array
  var ia = new Uint8Array(byteString.length);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ia], { type: "jpeg" });
}

export default PDFMaker;