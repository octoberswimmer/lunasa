/* @flow strict */

import { serializeObject } from "./serialization"

it("converts date values to strings", () => {
	const input = {
		date: new Date("2018-06-29T00:00-07:00"),
		bounds: {
			start: new Date("2018-06-29T10:00-07:00"),
			end: new Date("2018-06-29T11:00-07:00"),
			breaks: [
				new Date("2018-06-29T10:20-07:00"),
				new Date("2018-06-29T10:40-07:00")
			]
		}
	}
	expect(serializeObject(input)).toEqual({
		date: "2018-06-29T07:00:00",
		bounds: {
			start: "2018-06-29T17:00:00",
			end: "2018-06-29T18:00:00",
			breaks: ["2018-06-29T17:20:00", "2018-06-29T17:40:00"]
		}
	})
})

it("leaves native JSON values unchanged", () => {
	const input = {
		values: [1, "two", true, null]
	}
	expect(serializeObject(input)).toEqual(input)
})
