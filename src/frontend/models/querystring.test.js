/* @flow strict */

import { getAccountIds } from "./querystring"

function makeLocation(props: { search: string }): Location {
	return (props: any)
}

it("parses account IDs from query string", () => {
	const ids = getAccountIds(
		makeLocation({ search: "?accountId=foo&accountId=bar" })
	)
	expect(ids).toEqual(["foo", "bar"])
})

it("produces an array even when a single account ID is present", () => {
	const ids = getAccountIds(makeLocation({ search: "?accountId=foo" }))
	expect(ids).toEqual(["foo"])
})

it("returns `undefined` if no account IDs are given", () => {
	const ids = getAccountIds(makeLocation({ search: "" }))
	expect(ids).toBeUndefined()
})

it("decodes escaped characters", () => {
	const ids = getAccountIds(makeLocation({ search: "?accountId=foo%2Fbar" }))
	expect(ids).toEqual(["foo/bar"])
})
