/* @flow strict */

export function flatMap<A, B>(xs: A[], f: (a: A) => B[]): B[] {
	return Array.prototype.concat.apply([], xs.map(f))
}
