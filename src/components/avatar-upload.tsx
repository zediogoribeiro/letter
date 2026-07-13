import { UploadSimpleIcon, XIcon } from "@phosphor-icons/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { uploadFile } from "@/lib/uploads";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024; // 8MB

interface AvatarUploadProps {
	value?: string;
	name: string;
	onChange: (url: string) => void;
	onUploadingChange?: (isUploading: boolean) => void;
}

export const AvatarUpload = ({
	value,
	name,
	onChange,
	onUploadingChange,
}: AvatarUploadProps) => {
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
				description: "Avatars must be under 8MB.",
			});
			return;
		}

		setIsUploading(true);
		onUploadingChange?.(true);
		try {
			const { url } = await uploadFile(file);
			onChange(url);
		} catch {
			toast.error("Upload failed", {
				description: "Something went wrong uploading the image.",
			});
		} finally {
			setIsUploading(false);
			onUploadingChange?.(false);
		}
	};

	return (
		<div className="flex items-center gap-4">
			<div className="relative">
				<Avatar size="xl">
					{value ? (
						<Avatar.Image src={value} />
					) : (
						<Avatar.Fallback>{name}</Avatar.Fallback>
					)}
				</Avatar>
				{value && (
					<button
						type="button"
						aria-label="Remove avatar"
						onClick={() => onChange("")}
						className="absolute -top-1 -right-1 z-10 flex size-5 items-center justify-center rounded-full border border-input bg-background text-foreground shadow-sm transition hover:bg-accent focus-visible:outline-none focus-visible:ring-(length:--ring-width) ring-ring"
					>
						<XIcon size={12} />
					</button>
				)}
			</div>
			<div>
				<input
					ref={inputRef}
					id="avatar"
					type="file"
					accept={ALLOWED_TYPES.join(",")}
					className="hidden"
					onChange={handleFileChange}
				/>
				<Button
					type="button"
					variant="outline"
					size="sm"
					className="gap-2"
					isLoading={isUploading}
					onClick={() => inputRef.current?.click()}
				>
					<UploadSimpleIcon />
					<span>Change avatar</span>
				</Button>
			</div>
		</div>
	);
};
