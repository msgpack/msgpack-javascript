// utility for whatwg streams

export type ReadableStreamLike<T> = AsyncIterable<T> | ReadableStream<T>;

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

export function ensureAsyncIterabe<T>(streamLike: ReadableStreamLike<T>): AsyncIterable<T> {
  if (isReadableStream(streamLike)) {
    return asyncIterableFromStream(streamLike);
  } else {
    return streamLike;
  }
}
