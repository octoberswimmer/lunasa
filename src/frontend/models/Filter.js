/* @flow strict */
/* eslint array-callback-return: 0 */
/* eslint default-case: 0 */

import { getAlphabet, getEquivalentCharacters } from "../locale"
import { excludeNull } from "../util/array"
import { type WhereCondition, conjunction, not } from "./WhereCondition"

const FIRST_LETTER = "firstLetter"
const LATIN_LETTER = "latinLetter"
const OTHER_LETTER = "otherLetter"
const ANY_LETTER = "anyLetter"

export type FirstLetterOption =
	| {| type: typeof LATIN_LETTER, letter: string |}
	| {| type: typeof OTHER_LETTER |}
	| {| type: typeof ANY_LETTER |}

export type Filter = {| type: typeof FIRST_LETTER, option: FirstLetterOption |}

export function firstLetter(letter: string): Filter {
	return { type: FIRST_LETTER, option: { type: LATIN_LETTER, letter } }
}

export function firstLetterOther(): Filter {
	return { type: FIRST_LETTER, option: { type: OTHER_LETTER } }
}

export function firstLetterAny(): Filter {
	return { type: FIRST_LETTER, option: { type: ANY_LETTER } }
}

// Merges a filter with a list of existing filters such that there is at most
// one filter of `type` in the result.
export function applyFilter(filters: Filter[], newFilter: Filter): Filter[] {
	return filters.filter(({ type }) => type !== newFilter.type).concat(newFilter)
}

// Extract a first-letter filter configuration from a list of applied filters.
export function getFirstLetterOption(filters: Filter[]): FirstLetterOption {
	const result = filters.find(f => f.type === FIRST_LETTER)
	return result ? result.option : firstLetterAny().option
}

export function filterByLetter(filters: Filter[]): ?string {
	const option = getFirstLetterOption(filters)
	if (option.type === LATIN_LETTER) {
		return option.letter
	}
}

export function filterByLetterOther(filters: Filter[]): boolean {
	const option = getFirstLetterOption(filters)
	return option.type === OTHER_LETTER
}

export function filterByLetterAny(filters: Filter[]): boolean {
	const option = getFirstLetterOption(filters)
	return option.type === ANY_LETTER
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
			}
		})
	)
	return conjunction("and", conditions)
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
		operator: "like",
		values: [`'${letter}%'`]
	}))
	return conjunction("or", conditions)
}
