import "allocator/tlsf";

export function malloc(size: usize): usize {
  return memory.allocate(size);
}

export function free(ptr: usize): void {
  memory.free(ptr);
}
