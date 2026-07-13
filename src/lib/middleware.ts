import { queryOptions } from "@tanstack/react-query";
import { createServerFn, createServerOnlyFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "./auth";

export const getSessionFn = createServerFn({ method: "GET" }).handler(
	async () => {
		return await auth.api.getSession({ headers: getRequestHeaders() });
	},
);

export const requireAuth = createServerOnlyFn(async () => {
	const session = await auth.api.getSession({ headers: getRequestHeaders() });

	if (!session) {
		throw new Error("Unauthorized");
	}

	return session;
});

export const requireAdmin = createServerOnlyFn(async () => {
	const session = await requireAuth();

	if (session.user.role !== "admin") {
		throw new Error("Unauthorized");
	}

	return session;
});

export const sessionQueryOptions = () =>
	queryOptions({
		queryKey: ["session"],
		queryFn: () => getSessionFn(),
		staleTime: 5 * 60 * 1000,
	});
