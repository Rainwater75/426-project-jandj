import http from "k6/http";
import { sleep } from "k6";

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
  },
  thresholds: {
    'http_req_duration{scenario:getUser}': ['p(95)<10000'],
    'http_req_duration{scenario:getAssociation}': ['p(95)<10000'],

    'http_req_failed{scenario:getUser}': ['rate<0.01'],
    'http_req_failed{scenario:getAssociation}': ['rate<0.01'],
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
