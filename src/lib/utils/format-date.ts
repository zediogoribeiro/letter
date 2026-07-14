export const formatDate = (date: string | Date) =>
	new Date(date).toLocaleDateString(undefined, {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
