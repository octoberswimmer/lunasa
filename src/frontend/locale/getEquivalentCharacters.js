/* @flow strict */

import { flatMap } from "../util/array"

// Groups of characters by locale that should be considered equivalent for
// purposes of filtering. Only lower-case characters are given. Groups with
// only a single character are omitted. Locales with no multiple-character
// groups are omitted.
const characterGroups = {
	de: [["a", "ä"], ["o", "ö"], ["u", "ü"]]
}

/*
 * List characters that are equivalent to a given input character according to
 * a given locale for purposes of search and filtering. For example:
 *
 *     const chars = getEquivalentCharacters("de", "O")
 *     expect(chars).toContain("O")
 *     expect(chars).toContain("o")
 *     expect(chars).toContain("Ö")
 *     expect(chars).toContain("ö")
 *
 */
export function getEquivalentCharacters(
	locale: string,
	refChar: string
): string[] {
	// TODO: locale matching library?
	const key = Object.keys(characterGroups).find(k => locale.startsWith(k))
	const groups = key && characterGroups[key]
	const lowerRefChar = refChar.toLocaleLowerCase()
	const group = groups && groups.find(g => g.some(c => c === lowerRefChar))
	return group || [lowerRefChar]
}

/*
 * Get list of letters that are not consider to be 'Other' for purposes of
 * filtering, including all variants of each letter that are considered to be
 * equivalent.
 */
export function getAlphabet(locale: string): string[] {
	return flatMap(getAlphabetCollapsed(locale), char =>
		getEquivalentCharacters(locale, char)
	)
}

/*
 * Get list of letters that are not consider to be 'Other' for purposes of
 * filtering, but skip all except the base Latin letter for groups of characters
 * that are considered to be equivalent.
 */
export function getAlphabetCollapsed(locale: string): string[] {
	// This will do for now.
	return getLatinCharacters()
}

function getLatinCharacters(): string[] {
	const result = []
	for (let i = "a".charCodeAt(0); i <= "z".charCodeAt(0); i += 1) {
		result.push(String.fromCharCode(i))
	}
	return result
}
