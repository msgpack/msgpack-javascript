import "core-js";
import { Buffer } from "buffer";

(globalThis as any).Buffer = Buffer;

const testsContext = (require as any).context(".", true, /\.test\.ts$/);

testsContext.keys().forEach(testsContext);
