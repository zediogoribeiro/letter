import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

const url = process.env.BETTER_AUTH_URL;

export const authClient = createAuthClient({
	baseURL: url,
	plugins: [adminClient()],
});
