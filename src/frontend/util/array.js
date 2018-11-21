/* @flow strict */

export function flatMap<A, B>(xs: A[], f: (a: A) => B[]): B[] {
	return Array.prototype.concat.apply([], xs.map(f))
}

export function excludeNull<A>(xs: A[]): Array<$NonMaybeType<A>> {
	return xs.filter(x => x != null)
}
