import { S3Client } from '@aws-sdk/client-s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';

// 配置 R2 客户端
export const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
});

// R2 存储桶名称
const BUCKET_NAME = process.env.R2_BUCKET_NAME;

// 上传图片到 R2
export async function uploadImageToR2(file: Buffer, key: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: contentType,
  });

  await r2Client.send(command);

  // 生成签名 URL
  return getImageUrl(key);
}

// 获取图片的签名 URL
export async function getImageUrl(key: string) {
  return process.env.R2_OBJ_HOST + key;
}