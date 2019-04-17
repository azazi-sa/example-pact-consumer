const path = require("path");
const {Pact} = require("@pact-foundation/pact");
const fetch = require("node-fetch");

const MOCK_SERVER_PORT = 9009;

const BASE_URL = `http://localhost:${MOCK_SERVER_PORT}`;

describe("Pact Tests for Employee Service", () => {
    const provider = new Pact({
        consumer: "Web",
        provider: "EmployeeService",
        port: MOCK_SERVER_PORT,
        log: path.resolve(process.cwd(), "logs", "pact.log"),
        dir: path.resolve(process.cwd(), "pacts"),
        logLevel: "INFO",
        spec: 2,
        cors: false
    });

    beforeAll(done => {
        provider.setup().then(() => done())
    });

    describe('Fetch all employees', () => {
        beforeEach(() => {
            return provider.addInteraction({
                state: "i have a list of employees",
                uponReceiving: "a request for employees",
                withRequest: {
                    method: "GET",
                    path: "/employees",
                    headers: {Accept: "application/json"}
                },
                willRespondWith: {
                    status: 200,
                    headers: {"Content-Type": "application/json; charset=utf-8"},
                    body: [
                        {
                            Id: "1",
                            Name: "Ram Shinde",
                            EmailId: "ramshinde@gmail.com"
                        }
                    ]
                }
            });
        });

        it("lists all the employees", done => {
            const url = `${BASE_URL}/employees`;
            const method = "GET";
            const headers = {Accept: "application/json"};
            fetch(url, {method, headers})
                .then(response => response.json())
                .then(employees => {
                    expect(Array.isArray(employees)).toEqual(true);
                    expect(employees[0].Id).toEqual("1");
                    expect(employees[0].Name).toEqual('Ram Shinde');
                    expect(employees[0].EmailId).toEqual('ramshinde@gmail.com');
                })
                .then(() => done())
                .catch((err) => done(err));
        });
    });

    describe('Fetch employee', () => {
        beforeEach(() => {
            return provider.addInteraction({
                state: "i have an employee detail",
                uponReceiving: "a request for an employee",
                withRequest: {
                    method: "GET",
                    path: "/employees/1",
                    headers: {Accept: "application/json"}
                },
                willRespondWith: {
                    status: 200,
                    headers: {"Content-Type": "application/json; charset=utf-8"},
                    body: {
                        Id: "1",
                        Name: "Ram Shinde"
                    }
                }
            });
        });

        it("fetch an employee", done => {
            const url = `${BASE_URL}/employees/1`;
            const method = "GET";
            const headers = {Accept: "application/json"};
            fetch(url, {method, headers})
                .then(response => response.json())
                .then(employee => {
                    expect(typeof employee).toEqual('object');
                    expect(employee.Id).toEqual("1");
                    expect(employee.Name).toEqual('Ram Shinde');
                })
                .then(() => done())
                .catch((err) => done(err));
        });
    });

    describe('Create an employee', () => {
        beforeEach(() => {
            return provider.addInteraction({
                state: "creating an employee",
                uponReceiving: "a request for creating an employee",
                withRequest: {
                    method: "PUT",
                    path: "/employees",
                    headers: {Accept: "application/json", "Content-Type": "application/json"},
                    body: { Name: 'Ram Shinde' }
                },
                willRespondWith: {
                    status: 200,
                    headers: {"Content-Type": "application/json; charset=utf-8"},
                    body: { Id: "1" }
                }
            });
        });

        it("create an employee", done => {
            const url = `${BASE_URL}/employees`;
            const method = "PUT";
            const headers = {Accept: "application/json", "Content-Type": "application/json"};
            const body = JSON.stringify({Name: 'Ram Shinde'});
            fetch(url, {method, headers, body})
                .then(response => response.json())
                .then(employee => {
                    expect(typeof employee).toEqual('object');
                    expect(employee.Id).toEqual("1");
                })
                .then(() => done())
                .catch((err) => done(err));
        });
    });

    describe('Update an employee', () => {
        beforeEach(() => {
            return provider.addInteraction({
                state: "updating an employee",
                uponReceiving: "a request for updating an employee",
                withRequest: {
                    method: "POST",
                    path: "/employees/1",
                    headers: {Accept: "application/json", "Content-Type": "application/json"},
                    body: { Id: "1", Name: 'Ram Shinde' }
                },
                willRespondWith: {
                    status: 200,
                    headers: {"Content-Type": "application/json; charset=utf-8"},
                    body: { Id: "1", Name: 'Ram Shinde' }
                }
            });
        });

        it("create an employee", done => {
            const url = `${BASE_URL}/employees/1`;
            const method = "POST";
            const headers = {Accept: "application/json", "Content-Type": "application/json"};
            const body = JSON.stringify({ Id: "1", Name: 'Ram Shinde' });
            fetch(url, {method, headers, body})
                .then(response => response.json())
                .then(employee => {
                    expect(typeof employee).toEqual('object');
                    expect(employee.Id).toEqual("1");
                    expect(employee.Name).toEqual('Ram Shinde');
                })
                .then(() => done())
                .catch((err) => done(err));
        });
    });

    afterAll(() => {
        return provider.finalize();
    });
});
