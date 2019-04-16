const pact = require("@pact-foundation/pact-node");
const path = require("path");
const opts = {
  pactFilesOrDirs: [
    path.resolve(__dirname, "./pacts/web-employeeservice.json")
  ],
  pactBroker: "https://example-pact-broker.azurewebsites.net/",
  // pactBrokerUsername: "dXfltyFMgNOFZAxr8io9wJ37iUpY42M",
  // pactBrokerPassword: "O5AIZWxelWbLvqMd8PkAVycBJh2Psyg1",
  tags: ["prod", "test"],
  consumerVersion: "1.0." + Math.floor(new Date() / 1000)
};

pact
  .publishPacts(opts)
  .then(() => {
    console.log("Pact contract publishing complete!");
    console.log("");
    console.log(
      "Head over to https://example-pact-broker.azurewebsites.net/ and login with"
    );
    console.log("to see your published contracts.");
  })
  .catch(e => {
    console.log("Pact contract publishing failed: ", e);
  });
