
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");
import dotenv from "dotenv";

dotenv.config();

import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

console.log("R2_ACCOUNT_ID =", process.env.R2_ACCOUNT_ID);
console.log("R2_ACCESS_KEY_ID =", process.env.R2_ACCESS_KEY_ID);
console.log(
  "R2_SECRET_ACCESS_KEY exists =",
  !!process.env.R2_SECRET_ACCESS_KEY
);
 
export const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

export const uploadToR2 = async (file, folder) => {
  try {
    const key = `${folder}/${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;
    console.log("Uploading:", {
      bucket: process.env.R2_BUCKET,
      key,
      fileName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      hasBuffer: !!file.buffer,
    });

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return {
      key,
      url: `${process.env.R2_PUBLIC_URL}/${key}`,
    };
  } catch (error) {
    console.error("R2 UPLOAD ERROR:");
    console.error(error);
    throw error;
  }
};

export const deleteFromR2 = async (key) => {
  console.log("Deleting key:", key);

  const decodedKey = decodeURIComponent(key);
  const result = await s3.send(
    new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: decodedKey,
    }),
  );
  console.log("RESULT:", result);
  return true;
};
