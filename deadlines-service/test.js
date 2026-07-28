const ta_admin_digest = await (
  await fetch("http://localhost:3002/ta_admin_digest", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  })
).json();

console.log(`recieved : ${JSON.stringify(ta_admin_digest)}`);
console.assert(ta_admin_digest.success === true);
console.assert(ta_admin_digest.messageId);
console.assert(ta_admin_digest.type === "ta_admin_digest_notification");

console.log("done testing");
