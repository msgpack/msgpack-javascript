# msgpack-javascript

## Introduction
> MessagePack is a library that provides efficient object serialization. It is like JSON but offers higher efficiency and smaller data size.
> Currently, MessagePack 3.0 can be used to implement complex int64 encoding.

## How to Install
```shell
ohpm install @ohos/msgpack
```
For details, see [Installing an OpenHarmony HAR](https://gitcode.com/openharmony-tpc/docs/blob/master/OpenHarmony_har_usage.en.md).

## How to Use

### Encoding and Decoding
```javascript
import { encode,decode } from "@ohos/msgpack";

// Encode.
let encoded:Uint8Array = encode({ foo: "bar" });
// Decode.
let decodedObject = decode(encoded);
```

### Using Encoder and Decoder
```javascript
import { Encoder,Decoder } from "@ohos/msgpack";
// Reuse the encoder instance.
let encoder = new Encoder()
// Reuse the decoder instance.
let decoder = new Decoder()
// Encode.
let encoded:Uint8Array = encoder.encode({ foo: "bar" });
// Decode.
let decodedObject = decoder.decode(encoded);
// Decode a complex int64 object.
let data: ESObject =
   {
     ints: [0, Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER],
     nums: [Number.NaN, Math.PI, Math.E, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY],
     bigints: [BigInt(0), BigInt(Number.MAX_SAFE_INTEGER) + BigInt(1), BigInt(Number.MIN_SAFE_INTEGER) - BigInt(1)],
   };
// Encode the minimum int64 value.
return BigInt(Number.MIN_SAFE_INTEGER) - BigInt(1);
// Encode and decode a common int64 value.
return BigInt(0);
// Encode the maximum int64 value.
return BigInt(Number.MAX_SAFE_INTEGER) + BigInt(1);
```

### Encoding and Decoding an Array Object

```javascript
import { encode,decodeMulti } from "@ohos/msgpack";

let items = [
  "foo",
  10,
  {
    name: "bar",
  },
  [1, 2, 3],
];
// Encode the item array.
let encodedItems = items.map((item) => encode(item));
// Create a blank buffer for storing streams.
let encoded = new Uint8Array(encodedItems.reduce((p, c) => p + c.byteLength, 0));
let offset = 0;
// Store the encoded items in the buffer.
for (let encodedItem of encodedItems) {
  encoded.set(encodedItem, offset);
  offset += encodedItem.byteLength;
}
let result: Array<unknown> = [];
// Store the decoded items in the result array.
for (let item of decodeMulti(encoded)) {
  result.push(item);
}
// The value of result is the same as that of items.
expect(result).assertDeepEquals(items);
```

## Directory Structure
````
|---- msgpackJavaScript  
|     |---- entry  # Sample code
|           |---- Index.ets  # External APIs
			|---- EncodeDecodePage.ets  # Common encoding and decoding
      |---- Encoding64DemoFour.ets # Decoding complex int64 objects
      |---- Encoding64DemoOne.ets # Encoding the minimum int64 value
      |---- Encoding64DemoThree.ets # Encoding and decoding the common int64 value
      |---- Encoding64DemoTwo.ets # Encoding the maximum int64 value
			|---- EncodeDecodeConstructorPage.ets # Using encoder and decoder
			|---- MultiDecodePage.ets # Decoding complex objects
|     |---- library # Library code
|     |---- README_EN.MD  # Brief introduction of the MessagePack library                   
````

## About obfuscation
- Code obfuscation, please see[Code Obfuscation](https://docs.openharmony.cn/pages/v5.0/zh-cn/application-dev/arkts-utils/source-obfuscation.md)
- If you want the msgpack-javascript library not to be obfuscated during code obfuscation, you need to add corresponding exclusion rules in the obfuscation rule configuration file obfuscation-rules.txt：
```
-keep
./oh_modules/@ohos/msgpack
```

## Constraints

MessagePack has been verified only in the following version:

- DevEco Studio: 5.0.3.132, SDK: API12 (5.0.0.19)

## How to Contribute

If you find any problem during the use, submit an [Issue](https://gitcode.com/openharmony-tpc/openharmony_tpc_samples/issues) or a [PR](https://gitcode.com/openharmony-tpc/openharmony_tpc_samples) to us.

## License
This project is licensed under [ISC License](https://gitcode.com/openharmony-tpc/openharmony_tpc_samples/blob/master/ohos_msgpack/LICENSE).
