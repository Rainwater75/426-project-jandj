const ta_admin_digest = await (
  await fetch("http://localhost:3002/ta_admin_digest", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  })
).json();

console.log(`received : ${JSON.stringify(ta_admin_digest)}`);
console.log("done testing");
