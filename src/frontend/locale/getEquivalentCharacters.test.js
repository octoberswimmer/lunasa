/* @flow strict */

import {
	getAlphabet,
	getAlphabetCollapsed,
	getEquivalentCharacters
} from "./getEquivalentCharacters"

describe("getEquivalentCharacters", () => {
	it("produces a list of characters that differ only in accent", () => {
		const chars = getEquivalentCharacters("de", "O")
		expect(chars).toContain("o")
		expect(chars).toContain("ö")
	})

	it("includes the reference character in the output list", () => {
		const chars = getEquivalentCharacters("de", "O")
		expect(chars).toContain("o")
	})

	it("excludes characters that are not relevant to the given locale", () => {
		const chars = getEquivalentCharacters("en", "O")
		expect(chars).not.toContain("ö")
	})
})

describe("getAlphabet", () => {
	it("includes accented characters in German", () => {
		const alpha = getAlphabet("de-DE")
		expect(alpha).toContain("ä")
		expect(alpha).toContain("ö")
		expect(alpha).toContain("ü")
	})

	it("excludes accented characters in English", () => {
		const alpha = getAlphabet("en-US")
		expect(alpha).not.toContain("ä")
		expect(alpha).not.toContain("ö")
		expect(alpha).not.toContain("ü")
	})
})

describe("getAlphabetCollapsed", () => {
	it("excludes accented characters", () => {
		const alpha = getAlphabetCollapsed("de-DE")
		expect(alpha).not.toContain("ä")
		expect(alpha).not.toContain("ö")
		expect(alpha).not.toContain("ü")
	})
})
