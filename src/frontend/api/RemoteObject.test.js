/* @flow strict */

import * as ef from "../models/Event.testFixtures"
import RemoteObject from "./RemoteObject"
import SObjectMock from "./SObject.testFixtures.js"

type TestObject = {
	Id: string,
	CreatedDate: Date | string,
	Name: string,
	Value: number
}

const objectMock: SObjectMock<TestObject> = new SObjectMock()

const createSpy = jest.spyOn(objectMock, "create")
const retrieveSpy = jest.spyOn(objectMock, "retrieve")

beforeEach(() => {
	objectMock.fixtures = {
		"1": {
			Id: "1",
			CreatedDate: "2018-06-15T21:00:00.000+0000",
			Name: "test object",
			Value: 3
		}
	}
})

afterEach(() => {
	jest.clearAllMocks()
})

it("creates a record", async () => {
	const remote = new RemoteObject(objectMock)
	const values = { Name: "second object", Value: 4 }
	const result = await remote.create(values)
	expect(createSpy).toHaveBeenCalledWith(
		expect.objectContaining(values),
		expect.any(Function)
	)
	expect(result).toMatch(/.+/)
})

it("pre-serializes date values on create", async () => {
	const remote = new RemoteObject(objectMock)
	const CreatedDate = new Date("2018-01-03T22:00:00Z")
	const values = { Name: "second object", CreatedDate }
	const result = await remote.create(values)
	expect(createSpy).toHaveBeenCalledWith(
		expect.objectContaining({
			Name: "second object",
			CreatedDate: "2018-01-03T22:00:00"
		}),
		expect.any(Function)
	)
})

it("deletes records", async () => {
	const remote = new RemoteObject(objectMock)
	const deletedIds = await remote.del(["1"])
	expect(deletedIds).toEqual(["1"])
	expect(objectMock.fixtures["1"]).not.toBeDefined()
})

it("fetches an object description", async () => {
	const remote = new RemoteObject(objectMock)
	const description = await remote.describe()
	expect(description).toEqual(ef.eventDescription)
})

it("retrieves records", async () => {
	const remote = new RemoteObject(objectMock)
	const query = { where: { Name: { eq: "test object" } } }
	const record = await remote.retrieve(query)
	expect(retrieveSpy).toHaveBeenCalledWith(query, expect.any(Function))
	expect(record).toEqual([objectMock.fixtures["1"]])
})

it("pre-serializes date values on retrieve", async () => {
	const remote = new RemoteObject(objectMock)
	const query = {
		where: { CreatedDate: { lt: new Date("2018-01-03T22:00:00Z") } }
	}
	const record = await remote.retrieve(query)
	expect(retrieveSpy).toHaveBeenCalledWith(
		{ where: { CreatedDate: { lt: "2018-01-03T22:00:00" } } },
		expect.any(Function)
	)
})

it("updates records", async () => {
	const remote = new RemoteObject(objectMock)
	const updatedIds = await remote.update(["1"], { Value: 6 })
	expect(updatedIds).toEqual(["1"])
	expect(objectMock.fixtures["1"].Value).toBe(6)
})

it("pre-serializes date values on update", async () => {
	const remote = new RemoteObject(objectMock)
	const changes = { CreatedDate: new Date("2018-01-03T22:00:00Z") }
	await remote.update(["1"], changes)
	expect(objectMock.fixtures["1"].CreatedDate).toBe("2018-01-03T22:00:00")
})
