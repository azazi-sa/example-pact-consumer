const path = require("path");
const { Pact } = require("@pact-foundation/pact");
const axios = require("axios");

const MOCK_SERVER_PORT = 2202;

describe("Pact", () => {
  const provider = new Pact({
    consumer: "Web",
    provider: "EmployeeService",
    port: 9000,
    log: path.resolve(process.cwd(), "logs", "pact.log"),
    dir: path.resolve(process.cwd(), "pacts"),
    logLevel: "INFO",
    spec: 2
  });

  describe("and there is a valid user session", () => {
    it("lists all the employees", done => {
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
        .then(() => axios.get("http://localhost:2202/employees"))
        .then(employees => {
          expect(employees).to.be.a("array");
          expect(employees).to.have.deep.property("employees[0].id", 1);
          expect(employees).to.have.deep.property(
            "employees[0].name",
            "Bhagwan Ram: The God"
          );
          expect(provider.verify()).to.not.throw();
        })
        .then(() => provider.finalize())
        .then(() => done())
        .catch(done);
    });
  });
});
