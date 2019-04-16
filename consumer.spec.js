const path = require("path");
const { Pact } = require("@pact-foundation/pact");
const fetch = require("node-fetch");

const MOCK_SERVER_PORT = 9009;

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

  beforeEach(done => {
    provider
      .setup()
      .then(() => {
        return provider.addInteraction({
          state: "i have a list of employees",
          uponReceiving: "a request for employees",
          withRequest: {
            method: "GET",
            path: "/employees",
            headers: { Accept: "application/json" }
          },
          willRespondWith: {
            status: 200,
            headers: { "Content-Type": "application/json" },
            body: [
              {
                id: "1",
                employee: "Bhagwan Ram: The God"
              }
            ]
          }
        });
      })
      .then(() => {
        done();
      });
  });

  afterEach(() => {
    return provider.finalize();
  });

  it("lists all the employees", done => {
    fetch(`http://localhost:${MOCK_SERVER_PORT}/employees`, {
      method: "GET",
      headers: { Accept: "application/json" }
    })
      .then(employees => {
        expect(employees).toEqual(
          expect.arrayContaining([
            {
              id: "1",
              employee: "Bhagwan Ram: The God"
            }
          ])
        );
        expect(provider.verify()).not.toThrow();
      })
      .catch(() => done());
  });
});
