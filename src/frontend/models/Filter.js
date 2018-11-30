/* @flow strict */
/* eslint array-callback-return: 0 */
/* eslint default-case: 0 */

import { getAlphabet, getEquivalentCharacters } from "../locale"
import { excludeNull } from "../util/array"
import { type WhereCondition, conjunction, not } from "./WhereCondition"

// Filter types
const FIRST_LETTER = "firstLetter"
const SUBSTRING = "substring"

// First letter option types
const LATIN_LETTER = "latinLetter"
const OTHER_LETTER = "otherLetter"
const ANY_LETTER = "anyLetter"

export type FirstLetterOption =
	| {| type: typeof LATIN_LETTER, letter: string |}
	| {| type: typeof OTHER_LETTER |}
	| {| type: typeof ANY_LETTER |}

export type Filter =
	| {| type: typeof FIRST_LETTER, option: FirstLetterOption |}
	| {| type: typeof SUBSTRING, substring: ?string |}

export function firstLetter(letter: string): Filter {
	return { type: FIRST_LETTER, option: { type: LATIN_LETTER, letter } }
}

export function firstLetterOther(): Filter {
	return { type: FIRST_LETTER, option: { type: OTHER_LETTER } }
}

export function firstLetterAny(): Filter {
	return { type: FIRST_LETTER, option: { type: ANY_LETTER } }
}

export function substring(s: string): Filter {
	return { type: SUBSTRING, substring: s }
}

// Merges a filter with a list of existing filters such that there is at most
// one filter of `type` in the result.
export function applyFilter(filters: Filter[], newFilter: Filter): Filter[] {
	return filters.filter(({ type }) => type !== newFilter.type).concat(newFilter)
}

// Extract a first-letter filter configuration from a list of applied filters.
export function getFirstLetterOption(filters: Filter[]): FirstLetterOption {
	const result = filters.find(f => f.type === FIRST_LETTER)
	if (result && result.type === FIRST_LETTER) {
		return result.option
	} else {
		return { type: ANY_LETTER }
	}
}

export function isFilteredByLetter(filters: Filter[]): ?string {
	const option = getFirstLetterOption(filters)
	if (option.type === LATIN_LETTER) {
		return option.letter
	}
}

export function isFilteredByLetterOther(filters: Filter[]): boolean {
	const option = getFirstLetterOption(filters)
	return option.type === OTHER_LETTER
}

export function isFilteredByLetterAny(filters: Filter[]): boolean {
	const option = getFirstLetterOption(filters)
	return option.type === ANY_LETTER
}

export function isFilteredBySubstring(filters: Filter[]): ?string {
	for (const filter of filters) {
		if (filter.type === SUBSTRING) {
			return filter.substring
		}
	}
}

export function whereCondition(
	filters: Filter[],
	opts: { locale: string }
): WhereCondition {
	const conditions = excludeNull(
		filters.map(filter => {
			switch (filter.type) {
				case FIRST_LETTER:
					return whereConditionFirstLetter(filter.option, opts)
				case SUBSTRING:
					return whereConditionSubstring(filter.substring)
			}
		})
	)
	return conjunction("AND", conditions)
}

function whereConditionFirstLetter(
	option: FirstLetterOption,
	{ locale }: { locale: string }
): ?WhereCondition {
	switch (option.type) {
		case LATIN_LETTER:
			return startsWithOneOf(
				"Name",
				getEquivalentCharacters(locale, option.letter)
			)
		case OTHER_LETTER:
			return not(startsWithOneOf("Name", getAlphabet(locale)))
		case ANY_LETTER:
			return null
	}
}

function startsWithOneOf(field: string, letters: string[]): WhereCondition {
	const conditions = letters.map(letter => ({
		field,
		operator: "LIKE",
		values: [`'${letter}%'`]
	}))
	return conjunction("OR", conditions)
}

function whereConditionSubstring(substr: ?string): ?WhereCondition {
	if (substr) {
		return { field: "Name", operator: "LIKE", values: [`'%${substr}%'`] }
	}
}
