// sprint-3-load.js
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

    getAssociation :{
      executor: "constant-vus",
      vus: 10,
      duration: "30s",
      exec: "getAssociation",
    },

    liason: {
      executor: "constant-vus",
      vus: 10,
      duration: "30s",
      exec: "liason",
    },
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

export function liason() {
  http.get("http://localhost:8080/liaison/match");
  sleep(0.05);
}
