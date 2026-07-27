const resp = await (await fetch("http://localhost:3002/gather_digests")).json();

console.log(JSON.stringify(resp));
