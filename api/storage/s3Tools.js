const AWS = require("aws-sdk");
const fs = require("fs");

const awsConfig = require("../../config/aws.json");
const s3Config = require("../../config/s3.json");
const s3 = new AWS.S3({
  accessKeyId: awsConfig.AWS_AUTH_ID,
  secretAccessKey: awsConfig.AWS_AUTH_KEY
});

const BUCKET_NAME = s3Config.BUCKET_NAME;

const getBucketList = () => {
  return new Promise((resolve, reject) => {
    s3.listBuckets(function(err, data) {
      if (err) {
        console.log("Error", err);
        reject(err);
      } else {
        console.log("Bucket list: ", data.Buckets);
        resolve(data.Buckets);
      }
    });
  });  
}

/**
 * 파일 업로드. 
 * 저장되는 이름은 파일 이름 그대로 따라감.
 *  
 * @param filepath 
 */
const uploadFile = (filepath) => {
  const getFileName = (path) => {
    var slice = path.split("/");
    return slice[slice.length - 1];
  }
  
  return new Promise((resolve, reject) => {
    const fileContent = fs.readFileSync(filepath);
    const fileName = getFileName(filepath);
    const params = {
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: fileContent
    };

    s3.upload(params, function(err, data) {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve(data.Key);
    });
  });
}

/**
 * 버퍼 데이터를 업로드
 * 
 * @param buffer 
 * @param filename 
 */
const uploadFileBuffer = (buffer, filename) => {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: BUCKET_NAME,
      Key: filename,
      Body: buffer
    };

    s3.upload(params, function(err, data) {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve(data.Key);
    });
  });
}

/**
 * 파일 다운로드. 
 * 
 * @param  key 
 */
const downloadFile = (key) => {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: BUCKET_NAME,
      Key: key
    };

    s3.getObject(params, function(err, data) {
      if (err) {
        console.log("Error: ", err);
        reject(err);
      }

      const filepath = __dirname + "/../tmp/" + key;
      fs.writeFileSync(filepath, data.Body);
      resolve(filepath);
    });
  })
}

/**
 * 이미지 크기 조절 및 base64 인코딩
 *
 * @param filepath
 */
const imageResizeAndEncodeBase64 = (file) => {
  const sharp = require("sharp");

  const x = 128;
  const y = 128;
  
  return new Promise((resolve, reject) => {
    sharp(file)
      .resize(x, y)
      .toBuffer()
      .then(data => resolve(data.toString('base64')))
      .catch(err => {
        console.log(err);
        reject(err);
      });
  });
}

module.exports = {
  getBucketList: getBucketList,
  uploadFile: uploadFile, 
  uploadFileBuffer: uploadFileBuffer,
  downloadFile: downloadFile,
  imageResizeAndEncodeBase64: imageResizeAndEncodeBase64
}
