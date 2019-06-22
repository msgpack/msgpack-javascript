/* eslint-disable no-console */
"use strict";

try {
  const object = {
    nil: null,
    integer: 1,
    float: Math.PI,
    string: "Hello, world!",
    binary: Uint8Array.from([1, 2, 3]),
    array: [10, 20, 30],
    map: { foo: "bar" },
    timestampExt: new Date(),
  };

  document.writeln("<p>input:</p>");
  document.writeln(`<pre><code>${JSON.stringify(object, undefined, 2)}</code></pre>`);

  const encoded = MessagePack.encode(object);

  document.writeln("<p>output:</p>");
  document.writeln(`<pre><code>${JSON.stringify(MessagePack.decode(encoded), undefined, 2)}</code></pre>`);
} catch (e) {
  console.error(e);
  document.write(`<p style="color: red">${e.constructor.name}: ${e.message}</p>`);
}
