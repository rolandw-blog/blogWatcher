const foo = (): string => {
	return "hello roland";
};

const mockedFoo = jest.fn(foo);

describe("simple example", () => {
	test("my mocked function", () => {
		// Run the function!
		const result = mockedFoo();

		// expect that it returned the string
		expect(result).toBe("hello roland");

		// expect that we called the function once
		expect(mockedFoo.mock.calls).toHaveLength(1);

		// This function was instantiated exactly once
		expect(mockedFoo.mock.instances.length).toBe(1);
	});
});
