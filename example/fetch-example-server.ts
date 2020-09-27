// ts-node example/fetch-example-server.ts
// open example/fetch-example.html

import http from "http";
import { encode } from "../src";

const hostname = "127.0.0.1";
const port = 8080;

function bufferView(b: Uint8Array) {
  return Buffer.from(b.buffer, b.byteOffset, b.byteLength);
}

const server = http.createServer((req, res) => {
  console.log("accept:", req.method, req.url);

  res.statusCode = 200;
  res.setHeader("content-type", "application/x-msgpack");
  res.setHeader("access-control-allow-origin", "*");
  res.end(
    bufferView(
      encode({
        message: "Hello, world!",
      }),
    ),
  );
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
