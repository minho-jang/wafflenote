const AWS = require("aws-sdk");
const fs = require("fs");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_AUTH_ID,
  secretAccessKey: process.env.AWS_AUTH_KEY
});

const BUCKET_NAME = "wafflenote-testbucket";

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
 * Bucket: wafflenote-testbucket
 * 저장되는 이름: 파일 이름 그대로 따라감.
 *  
 * @param {String} filepath 
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
 * 파일 다운로드. 
 * Bucket: wafflenote-testbucket
 * 
 * @param {String} key // test_dir/test.txt
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

module.exports = {
  getBucketList: getBucketList,
  uploadFile: uploadFile, 
  downloadFile: downloadFile
}
