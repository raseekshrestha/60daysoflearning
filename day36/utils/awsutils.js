
import {
    S3Client,
    GetObjectCommand,
    PutObjectCommand,
    ListObjectsV2Command,
    DeleteObjectCommand
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';


const getS3Client = () => {

    const s3client = new S3Client({
        region: 'ap-south-1',
        credentials: {
            accessKeyId: process.env.accessKeyId,
            "secretAccessKey": process.env.secretAccessKey
        }
    });
    return s3client
}

const putObject = async (filename, contentType) => {
    const s3client = getS3Client()
    const command = new PutObjectCommand({
        Bucket: process.env.BucketName,
        Key: filename,
        ContentType: contentType
    })
    const url = await getSignedUrl(s3client, command, { expiresIn: 15 })
    return url
}

const getObjectUrl = async (key) => {
    const s3client = getS3Client()

    const command = new GetObjectCommand({
        Bucket: process.env.BucketName,
        Key: key,
    });


    const url = await getSignedUrl(s3client, command, { expiresIn: 20 }); // expires link in 20 second
    // const url = await getSignedUrl(s3client, command);
    return url;

}

const listObjects = async () => {
    const s3client = getS3Client()
    const command = new ListObjectsV2Command({
        Bucket: process.env.BucketName,
        Key: '/'
    })
    const result = await s3client.send(command)
    return result
}

const deleteObject = async (key) => {
    const s3client = getS3Client()
    const command = new DeleteObjectCommand({
        Key: key,
        Bucket: process.env.BucketName,

    })
    const res = await s3client.send(command)
    return res
}



export { getObjectUrl, putObject, deleteObject, listObjects };