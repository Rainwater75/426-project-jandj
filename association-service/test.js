// test association-service endpoints

console.log("testing start...");

console.log("---get_user---");
const user_id = 1;
const user = await (
  await fetch(`http://localhost:4000/get_user?user_id=${user_id}`, {
    method: "GET",
  })
).json();

console.assert(user.success === true);

console.log("---get_TA---");
const ta_id = 4;
const ta = await (
  await fetch(`http://localhost:4000/get_TA?ta_id=${ta_id}`, { method: "GET" })
).json();
// console.log(`received: ${JSON.stringify(ta)}`);
console.assert(ta.success === true);

console.log("---get_TA---malformed");
let bad_request = await fetch(`http://localhost:4000/get_TA`, {
  method: "GET",
});
console.assert(
  bad_request.status === 400,
  "bad request isn't given a 400 code response",
);
let bad_payload = await bad_request.json();
console.assert(
  bad_payload.success === false,
  "bad request success state is not false",
);

console.log("---get_user---malformed");
bad_request = await fetch(`http://localhost:4000/get_user`, {
  method: "GET",
});
console.assert(
  bad_request.status === 400,
  "bad request isn't given a 400 code response",
);
bad_payload = await bad_request.json();
console.assert(
  bad_payload.success === false,
  "bad request success state is not false",
);

console.log("---via caddy---");

const user_id_next = 1;
const user_next = await (
  await fetch(`http://localhost:3999/get_user?user_id=${user_id_next}`, {
    method: "GET",
  })
).json();

console.assert(user_next.success === true);

for (let i = 0; i < 5; i++) {
  console.log(
    `received: ${JSON.stringify(
      await (
        await fetch(`http://localhost:3999/get_user?user_id=${user_id_next}`, {
          method: "GET",
        })
      ).json(),
    )}`,
  );
}

console.log("...done testing");
