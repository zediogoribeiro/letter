import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireAuth } from "./middleware";
import { publicUrlForKey, R2_BUCKET, r2 } from "./storage/r2-client";

const ALLOWED_CONTENT_TYPES = [
	"image/jpeg",
	"image/png",
	"image/webp",
	"image/gif",
] as const;

const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024; // 8MB
const PRESIGN_EXPIRY_SECONDS = 300;

const createUploadUrlSchema = z.object({
	filename: z.string().min(1).max(255),
	contentType: z.enum(ALLOWED_CONTENT_TYPES),
	size: z.number().int().positive().max(MAX_FILE_SIZE_BYTES),
});

const sanitizeFilename = (name: string) =>
	name.toLowerCase().replace(/[^a-z0-9.\-_]+/g, "-");

export const createUploadUrlFn = createServerFn({ method: "POST" })
	.validator(createUploadUrlSchema)
	.handler(async ({ data }) => {
		const session = await requireAuth();

		const key = `uploads/${session.user.id}/${crypto.randomUUID()}-${sanitizeFilename(data.filename)}`;

		const command = new PutObjectCommand({
			Bucket: R2_BUCKET,
			Key: key,
			ContentType: data.contentType,
			ContentLength: data.size,
		});

		const uploadUrl = await getSignedUrl(r2, command, {
			expiresIn: PRESIGN_EXPIRY_SECONDS,
		});

		return { uploadUrl, publicUrl: publicUrlForKey(key), key };
	});

export async function uploadFile(
	file: File,
): Promise<{ url: string; key: string }> {
	const { uploadUrl, publicUrl, key } = await createUploadUrlFn({
		data: {
			filename: file.name,
			contentType: file.type as (typeof ALLOWED_CONTENT_TYPES)[number],
			size: file.size,
		},
	});

	const res = await fetch(uploadUrl, {
		method: "PUT",
		headers: { "Content-Type": file.type },
		body: file,
	});

	if (!res.ok) {
		throw new Error(`Upload failed with status ${res.status}`);
	}

	return { url: publicUrl, key };
}
