import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 20, 
    duration: '30s',
    thresholds: {
        http_req_failed: ['rate<0.01'], 
        http_req_duration: ['p(95)<2000'], 
    },
};

const MOCK_PROFILES = [
    { zip: '02108', neighborhood: 'Boston' },
    { zip: '02138', neighborhood: 'Cambridge' },
    { zip: '01002', neighborhood: 'Amherst' },
    { zip: '99999', neighborhood: 'test' },
];


export default function () {
    const randomProfile = MOCK_PROFILES[Math.floor(Math.random() * MOCK_PROFILES.length)];
    // const url = 'http://localhost:8080/liaison/match?zipCode=02108&neighborhood=Boston';
    const url = `http://localhost:8080/liaison/match?zipCode=${randomProfile.zip}&neighborhood=${randomProfile.neighborhood}`;

    const res = http.get(url, {headers: { "Content-Type": "application/json" }});

    check(res, { "status is 2xx": (r) => r.status >= 200 && r.status < 300 });
    sleep(0.1);
}