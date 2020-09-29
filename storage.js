var AWS = require('aws-sdk');
var fs = require('fs');

const authAwsInfo = () => {
  const id = process.env.AWS_AUTH_ID;
  const key = proces.env.AWS_AUTH_KEY;
}

export const getS3 = () => {
  try {
    const auth = authAwsInfo();
    return new AWS.S3({
      accessKeyId: auth[0],
      secretAccessKey: auth[1]
    });
  } catch(err) {
    console.log(err);
    return err.message;
  }
}

export const getBucketList = (s3) => {
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
 * @param {AWS.S3} s3 
 * @param {String} filepath 
 */
export const uploadFile = (s3, filepath) => {
  const getFileName = (path) => {
    var slice = path.split("/");
    return slice[slice.length - 1];
  }

  const BUCKET_NAME = "wafflenote-testbucket";
  
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
        console.log("Error", err);
        reject(err);
      }
      console.log(`File uploaded successfully. ${data.Location}`);
      resolve(data.Location);
    });
  });
}
