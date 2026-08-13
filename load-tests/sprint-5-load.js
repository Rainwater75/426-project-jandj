import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  scenarios: {
    getUser: {
      //simulate 40 users simultaneously querying the database for their user data at once for 90 seconds
      executor: "constant-vus",
      vus: 40,
      duration: "90s",
      exec: "getUser",
    },
    getAssociation: {
      //simulate 15 TA admins simultaneously querying the database for their TA at once for 90 seconds
      executor: "constant-vus",
      vus: 15,
      duration: "90s",
      exec: "getAssociation",
    },
    liaison_match: {
      //simulates 15 TA admins simultaneous seeking matches for their TA at once for 90 seconds
      executor: "constant-vus",
      vus: 15,
      duration: "90s",
      exec: "liaison_match",
    },
    liaison_contact: {
      //100 contact requests going out, simulating a large batch of contact requests going out at the end of the day
      executor: "per-vu-iterations",
      vus: 5,
      iterations: 20,
      exec: "liaison_contact",
    },
    deadlines: {
      //100 deadline digests going out, simulating a large batch of deadline notifications going out at the end of the day to TA administrators in the database
      executor: "per-vu-iterations",
      vus: 3,
      iterations: 33,
      exec: "deadlines",
    },
  },
  thresholds: {
    "http_req_duration{scenario:getUser}": ["p(95)<3000"],
    "http_req_duration{scenario:getAssociation}": ["p(95)<3000"],
    "http_req_duration{scenario:liaison_match}": ["p(95)<60000"],
    "http_req_duration{scenario:liaison_contact}": ["p(95)<60000"],
    "http_req_duration{scenario:deadlines}": ["p(95)<60000"],

    "http_req_failed{scenario:getUser}": ["rate<0.01"],
    "http_req_failed{scenario:getAssociation}": ["rate<0.01"],
    "http_req_failed{scenario:liaison_match}": ["rate<0.01"],
    "http_req_failed{scenario:liaison_contact}": ["rate<0.01"],
    "http_req_failed{scenario:deadlines}": ["rate<0.0001"],
  },
};

export function getUser() {
  http.get("http://localhost:3999/get_user?user_id=2");
  sleep(0.1);
}

export function getAssociation() {
  http.get("http://localhost:3999/get_TA?ta_id=4");
  sleep(0.1);
}

const MOCK_PROFILES = [
  { zip: "02108", neighborhood: "Boston" },
  { zip: "02138", neighborhood: "Cambridge" },
  { zip: "01002", neighborhood: "Amherst" },
  { zip: "99999", neighborhood: "test" },
];

export function liaison_match() {
  const randomProfile =
    MOCK_PROFILES[Math.floor(Math.random() * MOCK_PROFILES.length)];
  // const url = 'http://localhost:8080/liaison/match?zipCode=02108&neighborhood=Boston';
  const url = `http://localhost:8080/liaison/match?zipCode=${randomProfile.zip}&neighborhood=${randomProfile.neighborhood}`;

  const res = http.get(url, {
    headers: { "Content-Type": "application/json" },
  });

  check(res, { "status is 2xx": (r) => r.status >= 200 && r.status < 300 });
  sleep(0.1);
}

export function liaison_contact() {
  const url = `http://localhost:8080/liaison/contact`;

  const payload = JSON.stringify({
    assigneeId: "assignee-01",
    tenantAssociationId: "ta-123",
    message: "Intent to file TOPA notice.",
  });

  const res = http.post(url, payload, {
    headers: { "Content-Type": "application/json" },
  });

  // Prints the status and error body directly to terminal
  if (res.status !== 202 && res.status !== 200) {
    console.log(
      `[liaison_contact ERROR] Status: ${res.status} | Body: ${res.body}`,
    );
  }

  check(res, { "status is 2xx": (r) => r.status >= 200 && r.status < 300 });
  sleep(0.1);
}

export function deadlines() {
  const url = `http://localhost:3002/ta_admin_digest`;

  const res = http.post(url, {
    headers: { "Content-Type": "application/json" },
  });

  check(res, { "status is 2xx": (r) => r.status >= 200 && r.status < 300 });
  sleep(0.1);
}
