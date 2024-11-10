"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyRepl = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const client = new client_s3_1.S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
    },
});
const copyRepl = (baseLanguage, replId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const src_bucket = process.env.SRC_BUCKET;
        const dest_bucket = process.env.DEST_BUCKET;
        const listCommand = new client_s3_1.ListObjectsV2Command({
            Bucket: src_bucket,
            Prefix: baseLanguage,
        });
        const listObjects = yield client.send(listCommand);
        if (listObjects.Contents) {
            for (const obj of listObjects.Contents) {
                const sourceKey = obj.Key;
                if (!sourceKey)
                    return;
                const targetKey = sourceKey.replace(baseLanguage, replId);
                const copyCommand = new client_s3_1.CopyObjectCommand({
                    CopySource: `${src_bucket}/${sourceKey}`,
                    Bucket: dest_bucket,
                    Key: targetKey,
                });
                yield client.send(copyCommand);
            }
        }
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
});
exports.copyRepl = copyRepl;
