const AWS = require('aws-sdk');
const aurora = require('./aurora');

class AmazonService {
  constructor () {
    AWS.config.region = process.env.AWS_REGION;
    this.s3 = new AWS.S3();
    this.aurora = aurora;
  }

  getObject ({ Key, Bucket = process.env.S3_BUCKET } = {}) {
    return new Promise((resolve, reject) => {
      return this.s3.getObject({ Key, Bucket }, (err, data) => err ? reject(err) : resolve(data));
    });
  }

  getReadStream ({ Key, Bucket = process.env.S3_BUCKET } = {}) {
    return this.s3.getObject({ Key, Bucket }).createReadStream();
  }

  upload ({ Key, Body, ContentType, Bucket = process.env.S3_BUCKET, ACL = 'public-read' } = {}) {
    return new Promise((resolve, reject) => {
      console.info('UPLOADING file to S3');
      this.s3.upload({ Bucket, Key, Body, ContentType, ACL }, (err, data) => {
        if (err) {
          console.error('Error uploading data: ', err);
          reject(err);
        } else {
          console.info('Successfully uploaded data to ', data.Location);
          resolve(data.Location);
        }
      });
    });
  }

  delete ({Key, Bucket = process.env.S3_BUCKET} = {}) {
    return new Promise((resolve, reject) => {
      console.info('DELETING file from S3');
      this.s3.deleteObject({ Bucket, Key }, function (err, data) {
        if (err) {
          console.error(err.code, '-', err.message);
          return reject(err);
        }
        resolve(data);
      });
    });
  }
}

module.exports = new AmazonService();