/* @flow strict */

import RemoteObject from "./RemoteObject"
import SObjectMock from "./SObject.testFixtures.js"

type TestObject = {
	Id: string,
	Name: string,
	Value: number
}

const objectMock: SObjectMock<TestObject> = new SObjectMock()
objectMock.fixtures = {
	"1": { Id: "1", Name: "test object", Value: 3 }
}

jest.spyOn(objectMock, "retrieve")

it("retrieves records", async () => {
	const remote = new RemoteObject(objectMock)
	const query = { where: { Name: { eq: "test object" } } }
	const record = await remote.retrieve(query)
	expect(objectMock.retrieve).toHaveBeenCalledWith(query, expect.any(Function))
	expect(record).toEqual([objectMock.fixtures["1"]])
})
