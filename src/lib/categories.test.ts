import { describe, expect, it } from "vitest";
import { isCategory } from "@/lib/categories";

describe("isCategory", () => {
	it("accepts known categories", () => {
		expect(isCategory("Design")).toBe(true);
	});

	it("rejects unknown values", () => {
		expect(isCategory("Sales")).toBe(false);
	});

	it("is case-sensitive", () => {
		expect(isCategory("design")).toBe(false);
	});
});
