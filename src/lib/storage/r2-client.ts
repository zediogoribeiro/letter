import { S3Client } from "@aws-sdk/client-s3";

const accountId = process.env.R2_ACCOUNT_ID as string;

export const r2 = new S3Client({
	region: "auto",
	endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
		secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
	},
	// R2 rejects presigned PUTs signed with the SDK's default flexible-checksum
	// query params, since there's no body yet at signing time to compute them against.
	requestChecksumCalculation: "WHEN_REQUIRED",
});

export const R2_BUCKET = process.env.R2_BUCKET_NAME as string;
export const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL as string;

export const publicUrlForKey = (key: string) => `${R2_PUBLIC_URL}/${key}`;
