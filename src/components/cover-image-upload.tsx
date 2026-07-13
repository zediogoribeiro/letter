import { UploadSimpleIcon, XIcon } from "@phosphor-icons/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { uploadFile } from "@/lib/uploads";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024; // 8MB

interface CoverImageUploadProps {
	value?: string;
	onChange: (url: string | undefined) => void;
}

export const CoverImageUpload = ({
	value,
	onChange,
}: CoverImageUploadProps) => {
	const [isUploading, setIsUploading] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		e.target.value = "";
		if (!file) return;

		if (!ALLOWED_TYPES.includes(file.type)) {
			toast.error("Unsupported file type", {
				description: "Use a JPEG, PNG, WebP or GIF image.",
			});
			return;
		}

		if (file.size > MAX_FILE_SIZE_BYTES) {
			toast.error("File too large", {
				description: "Cover images must be under 8MB.",
			});
			return;
		}

		setIsUploading(true);
		try {
			const { url } = await uploadFile(file);
			onChange(url);
		} catch {
			toast.error("Upload failed", {
				description: "Something went wrong uploading the image.",
			});
		} finally {
			setIsUploading(false);
		}
	};

	if (value) {
		return (
			<div className="relative overflow-hidden rounded-md border border-input">
				<img src={value} alt="" className="h-48 w-full object-cover" />
				<Button
					type="button"
					variant="outline"
					size="xs"
					className="absolute top-3 right-3 gap-2"
					onClick={() => onChange("")}
				>
					<XIcon />
					<span>Remove</span>
				</Button>
			</div>
		);
	}

	return (
		<div>
			<input
				ref={inputRef}
				id="cover-image"
				type="file"
				accept={ALLOWED_TYPES.join(",")}
				className="hidden"
				onChange={handleFileChange}
			/>
			<Button
				type="button"
				variant="outline"
				className="gap-2"
				isLoading={isUploading}
				onClick={() => inputRef.current?.click()}
			>
				<UploadSimpleIcon />
				<span>Upload cover image</span>
			</Button>
		</div>
	);
};
