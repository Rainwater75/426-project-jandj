const MOCK_PROFILES = [
  { zip: "02108", neighborhood: "Boston" },
  { zip: "02138", neighborhood: "Cambridge" },
  { zip: "01002", neighborhood: "Amherst" },
  { zip: "99999", neighborhood: "test" },
];

const randomProfile =
  MOCK_PROFILES[Math.floor(Math.random() * MOCK_PROFILES.length)];

const url_string = `http://localhost:3001/liaison/match?zipCode=${randomProfile.zip}&neighborhood=${randomProfile.neighborhood}`;

console.log(`[LOG] ${url_string}`);

let response = await (
  await fetch(url_string, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
).json();

console.log(`received : ${JSON.stringify(response)}`);

const url_string_2 = `http://localhost:8080/liaison/contact`;

response = await fetch(url_string_2, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    assigneeId: "assignee-01",
    tenantAssociationId: "ta-123",
    message: "Intent to file TOPA notice.",
  }),
});

console.log(`received : ${JSON.stringify(response)}`);

console.log("done testing");
