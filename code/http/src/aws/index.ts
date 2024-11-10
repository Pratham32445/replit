import {
  CopyObjectCommand,
  ListObjectsV2Command,
  S3Client,
} from "@aws-sdk/client-s3";

const client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
});

export const copyRepl = async (baseLanguage: string, replId: string) => {
  try {
    const src_bucket = process.env.SRC_BUCKET;
    const dest_bucket = process.env.DEST_BUCKET;
    const listCommand = new ListObjectsV2Command({
      Bucket: src_bucket,
      Prefix: baseLanguage,
    });
    const listObjects = await client.send(listCommand);
    if (listObjects.Contents) {
      for (const obj of listObjects.Contents) {
        const sourceKey = obj.Key;
        if (!sourceKey) return;
        const targetKey = sourceKey.replace(baseLanguage, replId);
        const copyCommand = new CopyObjectCommand({
          CopySource: `${src_bucket}/${sourceKey}`,
          Bucket: dest_bucket,
          Key: targetKey,
        });
        await client.send(copyCommand);
      }
    }
    return true;
  } catch (error) {
      console.log(error);
      return false;
  }
};
