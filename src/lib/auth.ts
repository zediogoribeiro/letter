import { admin } from "better-auth/plugins";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../../db/drizzle";
import { schema } from "../../db/schema";

const ADMIN_EMAIL_DOMAIN = process.env.ADMIN_EMAIL_DOMAIN;
const DEVELOPER_EMAIL = process.env.DEVELOPER_EMAIL;

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema,
	}),
	emailAndPassword: {
		enabled: true,
	},
	plugins: [admin()],
	databaseHooks: {
		user: {
			create: {
				before: async (user) => {
					const isAdmin = Boolean(
						(ADMIN_EMAIL_DOMAIN && user.email.endsWith(ADMIN_EMAIL_DOMAIN)) ||
							(DEVELOPER_EMAIL && user.email === DEVELOPER_EMAIL),
					);

					return {
						data: {
							...user,
							role: isAdmin ? "admin" : "user",
						},
					};
				},
			},
		},
	},
});
