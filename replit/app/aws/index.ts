import {
  CopyObjectCommand,
  ListObjectsV2Command,
  S3Client,
} from "@aws-sdk/client-s3";

import {
  ECSClient,
  RunTaskCommand,
  DescribeTasksCommand,
} from "@aws-sdk/client-ecs";

import {
  EC2Client,
  DescribeNetworkInterfacesCommand,
} from "@aws-sdk/client-ec2";

const credentials = {
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
};

const client = new S3Client(credentials);

const ecsClient = new ECSClient(credentials);

const ec2Client = new EC2Client(credentials);

const config = {
  cluster: "arn:aws:ecs:ap-south-1:211125556897:cluster/repls",
  task: "arn:aws:ecs:ap-south-1:211125556897:task-definition/replstask:1",
};

export const copyRepl = async (baseLanguage: string, replId: string) => {
  try {
    const src_bucket = process.env.AWS_RAW_BUCKET;
    const dest_bucket = process.env.AWS_REAL_BUCKET;
    const listParams = {
      Bucket: src_bucket,
      Prefix: baseLanguage,
    };
    const listObjects = await client.send(new ListObjectsV2Command(listParams));
    if (
      !listObjects ||
      !listObjects.Contents ||
      listObjects.Contents?.length == 0
    )
      return;
    for (const object of listObjects.Contents) {
      const sourceKey = object.Key;
      const copyParams = {
        CopySource: `${src_bucket}/${sourceKey}`,
        Bucket: dest_bucket,
        Key: `${replId}/${sourceKey?.split("/").slice(1).join("/")}`,
      };
      await client.send(new CopyObjectCommand(copyParams));
    }
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const createRepl = async (replId: string) => {
  try {
    const cmd = new RunTaskCommand({
      cluster: config.cluster,
      taskDefinition: config.task,
      launchType: "FARGATE",
      count: 1,
      networkConfiguration: {
        awsvpcConfiguration: {
          assignPublicIp: "ENABLED",
          subnets: [
            "subnet-0c3c8ac43f6e053db",
            "subnet-0b5afeea9a98155de",
            "subnet-06e2e7eeb5a9c3513",
          ],
          securityGroups: ["sg-054376a96279e2a5d"],
        },
      },
      overrides: {
        containerOverrides: [
          {
            name: "task",
            environment: [{ name: "REPL_ID", value: replId }],
          },
        ],
      },
    });

    const taskResponse = await ecsClient.send(cmd);
    const taskArn = taskResponse.tasks?.[0]?.taskArn;

    await new Promise((resolve) => setTimeout(resolve, 10000));

    if (taskArn) {
      const describeTaskCmd = new DescribeTasksCommand({
        cluster: config.cluster,
        tasks: [taskArn],
      });

      const describeResponse = await ecsClient.send(describeTaskCmd);
      const attachments = describeResponse.tasks?.[0]?.attachments;

      if (attachments && attachments.length > 0) {
        const networkInterfaces = attachments[0].details?.find(
          (detail) => detail.name === "networkInterfaceId"
        );

        const networkInterfaceId = networkInterfaces?.value;

        if (networkInterfaceId) {
          const networkInterfaceData = await ec2Client.send(
            new DescribeNetworkInterfacesCommand({
              NetworkInterfaceIds: [networkInterfaceId],
            })
          );

          const publicIp =
            networkInterfaceData.NetworkInterfaces?.[0]?.Association?.PublicIp;
          return publicIp;
        } else {
          return null;
        }
      }
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

export function updateFiles(func,delay) {
  let timeOutId : any;
  return function(...args) {
    if(timeOutId) {
      clearTimeout(timeOutId);
    }
    timeOutId = setTimeout(() => {
      func.apply(this,args);
    }, delay);
  }
}