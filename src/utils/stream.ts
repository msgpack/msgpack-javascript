// utility for whatwg streams

export function isReadableStream<T>(object: unknown): object is ReadableStream<T> {
  return typeof ReadableStream !== "undefined" && object instanceof ReadableStream;
}

export async function* asyncIterableFromStream<T>(stream: ReadableStream<T>): AsyncIterable<T> {
  const reader = stream.getReader();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        return;
      }
      yield value;
    }
  } finally {
    reader.releaseLock();
  }
}
