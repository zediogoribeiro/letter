import { GoogleLogoIcon } from "@phosphor-icons/react";
import { authClient } from "#/lib/auth-client";
import { Button } from "./ui/button";
import { Divider } from "./ui/divider";

export const ContinueWithGoogle = () => {
	const signIn = async () => {
		await authClient.signIn.social({
			provider: "google",
			callbackURL: "/dashboard",
		});
	};

	return (
		<>
			<div className="relative">
				<div className="absolute inset-0 flex items-center">
					<Divider />
				</div>
				<div className="relative flex justify-center text-xs uppercase">
					<span className="bg-background px-2 text-muted-foreground">
						Or continue with
					</span>
				</div>
			</div>
			<Button onClick={signIn} variant="outline" className="mt-6 w-full gap-2">
				<GoogleLogoIcon size={18} />
				Continue with Google
			</Button>
		</>
	);
};
