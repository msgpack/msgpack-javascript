// utility for whatwg streams

// The living standard of whatwg streams says
// ReadableStream is also AsyncIterable, but
// as of June 2019, no browser implements it.
// See https://streams.spec.whatwg.org/ for details
export type ReadableStreamLike<T> = AsyncIterable<T> | ReadableStream<T>;

export function isAsyncIterable<T>(object: ReadableStreamLike<T>): object is AsyncIterable<T> {
  return (object as any)[Symbol.asyncIterator] != null;
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

export function ensureAsyncIterable<T>(streamLike: ReadableStreamLike<T>): AsyncIterable<T> {
  if (isAsyncIterable(streamLike)) {
    return streamLike;
  } else {
    return asyncIterableFromStream(streamLike);
  }
}
