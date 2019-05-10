import "core-js";

const testsContext = (require as any).context(".", true, /\.test\.ts$/);

testsContext.keys().forEach(testsContext);
