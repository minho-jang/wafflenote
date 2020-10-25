const fs = require("fs");
const path = require("path");

const {Storage} = require("@google-cloud/storage");
const gcsConfig = require("../../config/gcs.json");

// Instantiate a storage client
const storage = new Storage();

// A bucket is a container for objects (files).
const bucketName = gcsConfig.BUCKET_NAME;
const bucket = storage.bucket(bucketName);

// https://github.com/googleapis/nodejs-storage/blob/master/samples/uploadFile.js
const upload = (file) => {
  return new Promise((resolve, reject) => {
    if (!file || !fs.existsSync(file.path)) {
      reject("No such file");
      return;
    }

    async function uploadFile() {
      const options = {
        gzip: true,
        destination: file.filename,
        metadata: {
          cacheControl: 'public, max-age=31536000',
        }
      };
      
      // Uploads a local file to the bucket
      await bucket.upload(file.path, options);
  
      console.log(`${file.path} uploaded to ${bucketName}.`);
      resolve(file.filename);
    }
  
    uploadFile().catch(err => {
      reject(err);
    });
  });
}

// https://cloud.google.com/appengine/docs/standard/nodejs/using-cloud-storage?hl=ko
const uploadBuffer = (buffer, filename) => {
  return new Promise((resolve, reject) => {
    // Create a new blob in the bucket and upload the file data.
    const blob = bucket.file(filename);
    const blobStream = blob.createWriteStream({
      resumable: false,
    });

    blobStream.on('error', (err) => {
      reject(err);
    });

    blobStream.on('finish', () => {
      console.log("blob.name ", blob.name);
      resolve(blob.name);
    });

    blobStream.end(buffer);
  });
}

// https://github.com/googleapis/nodejs-storage/blob/master/samples/downloadFile.js
const download = (key) => {
  return new Promise((resolve, reject) => {
    if (!key || key === "") {
      reject("Key for file to download is empty");
      return;
    }

    const destDir = path.join(__dirname, "..", tmp);
    const filename = `${Date.now()}_${key}`;
    const destFilename = path.join(destDir, filename);
    const srcFilename = key;

    async function downloadFile() {
      const options = {
        // The path to which the file should be downloaded, e.g. "./file.txt"
        destination: destFilename,
      };
  
      // Downloads the file
      await bucket.file(srcFilename).download(options);
  
      console.log(
        `gs://${bucketName}/${srcFilename} downloaded to ${destFilename}.`
      );

      resolve(destFilename);
    }
  
    downloadFile().catch(err => {
      reject(err);
    });
  });
}

module.exports = {
  upload,
  uploadBuffer,
  download
};