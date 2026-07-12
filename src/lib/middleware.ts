import { queryOptions } from "@tanstack/react-query";
import { auth } from "./auth";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";

export const getSessionFn = createServerFn({ method: "GET" }).handler(
	async () => {
		return await auth.api.getSession({ headers: getRequestHeaders() });
	},
);

export const sessionQueryOptions = () =>
	queryOptions({
		queryKey: ["session"],
		queryFn: () => getSessionFn(),
		staleTime: 5 * 60 * 1000,
	});
