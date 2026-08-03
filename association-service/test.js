// test association-service endpoints

console.log("testing association-service endpoints")

const user_id = 1;
const user = await(await fetch(`http://localhost:4000/get_user?user_id=${user_id}`, {method: "GET"})).json();

console.assert(user.success === true);
//console.log(`recieved : ${JSON.stringify(user)}`);


const ta_id = 4;
const ta = await (await fetch(`http://localhost:4000/get_TA?ta_id=${ta_id}`, {method: "GET",})).json();
console.assert(ta.success === true);
//console.log(`recieved : ${JSON.stringify(user)}`);


// const bad_request =await fetch(`http://localhost:4000/get_TA`, {method: "GET"});
// console.assert(bad_request.status === 400, "bad request isn't given a 400 code response");
// const bad_payload = await bad_request.json();
// console.assert(bad_payload.success === false, "bad request success state is not false");
//console.log(`recieved : ${JSON.stringify(bad_payload)}`);


console.log("\ntesting caddy and cache")

const user_id_next = 1;
const user_next = await(await fetch(`http://localhost:3999/get_user?user_id=${user_id_next}`, {method: "GET"})).json();

console.assert(user_next.success === true);
//console.log(`recieved : ${JSON.stringify(user_next)}`);


console.log("done testing");
