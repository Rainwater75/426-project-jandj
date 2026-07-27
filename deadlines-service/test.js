const gather_digests_resp = await (
  await fetch("http://localhost:3002/gather_digests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  })
).json();

console.assert(gather_digests_resp.success === true);
console.assert(gather_digests_resp.messageId);
console.assert(gather_digests_resp.type === "topa_digest_notification");

console.log("done testing");
