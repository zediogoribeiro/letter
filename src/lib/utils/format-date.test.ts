import { describe, expect, it } from "vitest";
import { formatDate } from "@/lib/utils/format-date";

describe("formatDate", () => {
	it("formats a Date instance", () => {
		expect(formatDate(new Date("2024-03-05T12:00:00Z"))).toBe("Mar 5, 2024");
	});

	it("formats an ISO date string", () => {
		expect(formatDate("2024-12-31T00:00:00Z")).toBe("Dec 31, 2024");
	});
});
