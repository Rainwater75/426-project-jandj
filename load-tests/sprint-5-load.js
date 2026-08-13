import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  scenarios: {
    getUser: {
      executor: "constant-vus",
      vus: 10,
      duration: "30s",
      exec: "getUser",
    },
    getAssociation: {
      executor: "constant-vus",
      vus: 10,
      duration: "30s",
      exec: "getAssociation",
    },
    // liason: {
    //   executor: "constant-vus",
    //   vus: 20,
    //   duration: "30s",
    //   exec: "liasion",
    // },
  },
  thresholds: {
    "http_req_duration{scenario:getUser}": ["p(95)<10000"],
    "http_req_duration{scenario:getAssociation}": ["p(95)<10000"],
    // "http_req_duration{scenario:liason}": ["p(95)<2000"],

    "http_req_failed{scenario:getUser}": ["rate<0.01"],
    "http_req_failed{scenario:getAssociation}": ["rate<0.01"],
    // "http_req_failed{scenario:liason}": ["rate<0.01"],
  },
};

export function getUser() {
  http.get("http://localhost:3999/get_user?user_id=2");
  sleep(0.05);
}

export function getAssociation() {
  http.get("http://localhost:3999/get_TA?ta_id=4");
  sleep(0.05);
}

const MOCK_PROFILES = [
  { zip: "02108", neighborhood: "Boston" },
  { zip: "02138", neighborhood: "Cambridge" },
  { zip: "01002", neighborhood: "Amherst" },
  { zip: "99999", neighborhood: "test" },
];

// export function liasion() {
//   const randomProfile =
//     MOCK_PROFILES[Math.floor(Math.random() * MOCK_PROFILES.length)];
//   // const url = 'http://localhost:8080/liaison/match?zipCode=02108&neighborhood=Boston';
//   const url = `http://localhost:8080/liaison/match?zipCode=${randomProfile.zip}&neighborhood=${randomProfile.neighborhood}`;

//   const res = http.get(url, {
//     headers: { "Content-Type": "application/json" },
//   });

//   check(res, { "status is 2xx": (r) => r.status >= 200 && r.status < 300 });
//   sleep(0.1);
// }
