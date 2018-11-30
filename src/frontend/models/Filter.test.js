/* @flow strict */

import * as F from "./Filter"
import { stringifyCondition } from "./WhereCondition"

it("creates a filter that filters by first letter", () => {
	const filters = [F.firstLetter("b")]
	expect(F.isFilteredByLetter(filters)).toBe("b")
	expect(F.isFilteredByLetterOther(filters)).toBe(false)
	expect(F.isFilteredByLetterAny(filters)).toBe(false)
})

it("creates a filter that filters by non-Latin initial letter", () => {
	const filters = [F.firstLetterOther()]
	expect(F.isFilteredByLetter(filters)).not.toBeDefined()
	expect(F.isFilteredByLetterOther(filters)).toBe(true)
	expect(F.isFilteredByLetterAny(filters)).toBe(false)
})

it("creates a filter that does not filter by first letter", () => {
	const filters = [F.firstLetterAny()]
	expect(F.isFilteredByLetter(filters)).not.toBeDefined()
	expect(F.isFilteredByLetterOther(filters)).toBe(false)
	expect(F.isFilteredByLetterAny(filters)).toBe(true)
})

it("defaults to filtering by 'any' first letter", () => {
	const filters = []
	expect(F.isFilteredByLetter(filters)).not.toBeDefined()
	expect(F.isFilteredByLetterOther(filters)).toBe(false)
	expect(F.isFilteredByLetterAny(filters)).toBe(true)
})

it("creates a filter that filters by substring", () => {
	const filters = [F.substring("Juicer")]
	expect(F.isFilteredBySubstring(filters)).toBe("Juicer")
})

it("applies one filter of a given type at a time", () => {
	const prevFilters = [F.firstLetterAny()]
	const filters = F.applyFilter(prevFilters, F.firstLetter("b"))
	expect(filters.length).toBe(1)
	expect(F.isFilteredByLetter(filters)).toBe("b")
})

it("produces a SOQL `where` clause when filtering by first letter", () => {
	const filters = [F.firstLetter("b")]
	expect(
		stringifyCondition(F.whereCondition(filters, { locale: "en-US" }))
	).toBe("Name LIKE 'b%'")
})

it("produces a SOQL `where` clause when filtering by 'Other' first letter", () => {
	const filters = [F.firstLetterOther()]
	expect(
		stringifyCondition(F.whereCondition(filters, { locale: "en-US" }))
	).toMatch(/NOT \(\(Name LIKE 'a%'\).*\)/)
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
	).toBe("(Name LIKE 'o%') OR (Name LIKE 'ö%')")
	expect(
		stringifyCondition(F.whereCondition(filters, { locale: "en-US" }))
	).toBe("Name LIKE 'o%'")
})

it("excludes accented latin characters when filtering by 'Other' letter in German", () => {
	const filters = [F.firstLetterOther()]
	expect(
		stringifyCondition(F.whereCondition(filters, { locale: "de-DE" }))
	).toMatch(/NOT \(.*\(Name LIKE 'ö%'\).*\)/)
	expect(
		stringifyCondition(F.whereCondition(filters, { locale: "en-US" }))
	).not.toMatch(/NOT \(.*\(Name LIKE 'ö%'\).*\)/)
})

it("produces a SOQL `where` clause when filtering by substring", () => {
	const filters = [F.substring("Juicer")]
	expect(
		stringifyCondition(F.whereCondition(filters, { locale: "en-US" }))
	).toBe("Name LIKE '%Juicer%'")
})

it("does not apply substring filter if substring value is empty", () => {
	const filters = [F.substring("")]
	expect(
		stringifyCondition(F.whereCondition(filters, { locale: "en-US" }))
	).toBe("")
})

it("produces a SOQL `where` clause when multiple filters are applied", () => {
	const filters = [F.firstLetter("o"), F.substring("Juicer")]
	expect(
		stringifyCondition(F.whereCondition(filters, { locale: "en-US" }))
	).toBe("(Name LIKE 'o%') AND (Name LIKE '%Juicer%')")
})
