/* @flow strict */

import * as F from "./Filter"
import { stringifyCondition } from "./WhereCondition"

it("creates a filter that filters by first letter", () => {
	const filters = [F.firstLetter("b")]
	expect(F.filterByLetter(filters)).toBe("b")
	expect(F.filterByLetterOther(filters)).toBe(false)
	expect(F.filterByLetterAny(filters)).toBe(false)
})

it("creates a filter that filters by non-Latin initial letter", () => {
	const filters = [F.firstLetterOther()]
	expect(F.filterByLetter(filters)).not.toBeDefined()
	expect(F.filterByLetterOther(filters)).toBe(true)
	expect(F.filterByLetterAny(filters)).toBe(false)
})

it("creates a filter that does not filter by first letter", () => {
	const filters = [F.firstLetterAny()]
	expect(F.filterByLetter(filters)).not.toBeDefined()
	expect(F.filterByLetterOther(filters)).toBe(false)
	expect(F.filterByLetterAny(filters)).toBe(true)
})

it("defaults to filtering by 'any' first letter", () => {
	const filters = []
	expect(F.filterByLetter(filters)).not.toBeDefined()
	expect(F.filterByLetterOther(filters)).toBe(false)
	expect(F.filterByLetterAny(filters)).toBe(true)
})

it("applies one filter of a given type at a time", () => {
	const prevFilters = [F.firstLetterAny()]
	const filters = F.applyFilter(prevFilters, F.firstLetter("b"))
	expect(filters.length).toBe(1)
	expect(F.filterByLetter(filters)).toBe("b")
})

it("produces a SOQL `where` clause when filtering by first letter", () => {
	const filters = [F.firstLetter("b")]
	expect(
		stringifyCondition(F.whereCondition(filters, { locale: "en-US" }))
	).toBe("Name like 'b%'")
})

it("produces a SOQL `where` clause when filtering by 'Other' first letter", () => {
	const filters = [F.firstLetterOther()]
	expect(
		stringifyCondition(F.whereCondition(filters, { locale: "en-US" }))
	).toMatch(/NOT \(\(Name like 'a%'\).*\)/)
})

it("produces a SOQL `where` clause when filtering by 'Any' first letter", () => {
	const filters = [F.firstLetterAny()]
	expect(
		stringifyCondition(F.whereCondition(filters, { locale: "en-US" }))
	).toBe("")
})

it("treats accented letters as equivalent to base Latin letters in German", () => {
	const filters = [F.firstLetter("o")]
	expect(
		stringifyCondition(F.whereCondition(filters, { locale: "de-DE" }))
	).toBe("(Name like 'o%') or (Name like 'ö%')")
	expect(
		stringifyCondition(F.whereCondition(filters, { locale: "en-US" }))
	).toBe("Name like 'o%'")
})

it("excludes accented latin characters when filtering by 'Other' letter in German", () => {
	const filters = [F.firstLetterOther()]
	expect(
		stringifyCondition(F.whereCondition(filters, { locale: "de-DE" }))
	).toMatch(/NOT \(.*\(Name like 'ö%'\).*\)/)
	expect(
		stringifyCondition(F.whereCondition(filters, { locale: "en-US" }))
	).not.toMatch(/NOT \(.*\(Name like 'ö%'\).*\)/)
})
