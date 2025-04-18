# msgpack-javascript

## 简介
> MessagePack是一个非常高效的对象序列化库。它像JSON，但速度很快，而且很小。
> 现在MessagePack已经适配了3.0版本，可用于实现int64的复杂性编码。

## 下载安装
```shell
ohpm install @ohos/msgpack
```
OpenHarmony ohpm 环境配置等更多内容，请参考[如何安装 OpenHarmony ohpm 包](https://gitcode.com/openharmony-tpc/docs/blob/master/OpenHarmony_har_usage.md)

## 使用说明

### 编解码
```javascript
import { encode,decode } from "@ohos/msgpack";

// 编码
let encoded:Uint8Array = encode({ foo: "bar" });
// 解码
let decodedObject = decode(encoded);
```

### 构造器编解码
```javascript
import { Encoder,Decoder } from "@ohos/msgpack";
// 编码可复用构造器
let encoder = new Encoder()
// 解码可复用构造器
let decoder = new Decoder()
// 编码
let encoded:Uint8Array = encoder.encode({ foo: "bar" });
// 解码
let decodedObject = decoder.decode(encoded);
// int64复杂对象解码 
let data: ESObject =
   {
     ints: [0, Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER],
     nums: [Number.NaN, Math.PI, Math.E, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY],
     bigints: [BigInt(0), BigInt(Number.MAX_SAFE_INTEGER) + BigInt(1), BigInt(Number.MIN_SAFE_INTEGER) - BigInt(1)],
   };
// int64编码最小值
return BigInt(Number.MIN_SAFE_INTEGER) - BigInt(1);
// int64普通编解码
return BigInt(0);
// int64编码最大值
return BigInt(Number.MAX_SAFE_INTEGER) + BigInt(1);
```

### 数组对象编解码

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
// 将数组编码
let encodedItems = items.map((item) => encode(item));
// 创建空白缓存区用来后续存数据流
let encoded = new Uint8Array(encodedItems.reduce((p, c) => p + c.byteLength, 0));
let offset = 0;
// 空白缓存区存入数据流
for (let encodedItem of encodedItems) {
  encoded.set(encodedItem, offset);
  offset += encodedItem.byteLength;
}
let result: Array<unknown> = [];
// 解码后将数据存入result数组中
for (let item of decodeMulti(encoded)) {
  result.push(item);
}
// result与items一致
expect(result).assertDeepEquals(items);
```

## 目录结构
````
|---- msgpackJavaScript  
|     |---- entry  # 示例代码文件夹
|           |---- Index.ets  # 对外接口介绍
			|---- EncodeDecodePage.ets  # 普通编解码
      |---- Encoding64DemoFour.ets  # int64复杂对象解码
      |---- Encoding64DemoOne.ets  # int64编码最小值
      |---- Encoding64DemoThree.ets  # int64普通编解码
      |---- Encoding64DemoTwo.ets  # int64编码最大值
			|---- EncodeDecodeConstructorPage.ets  # 通过构造器编解码
			|---- MultiDecodePage.ets  # 复杂对象解码
|     |---- library  # 库代码文件夹
|     |---- README.MD  # 安装使用方法                    
````

## 关于混淆
- 代码混淆，请查看[代码混淆简介](https://docs.openharmony.cn/pages/v5.0/zh-cn/application-dev/arkts-utils/source-obfuscation.md)
- 如果希望msgpack-javascript库在代码混淆过程中不会被混淆，需要在混淆规则配置文件obfuscation-rules.txt中添加相应的排除规则：
```
-keep
./oh_modules/@ohos/msgpack
```

## 约束与限制

在下述版本验证通过：

- DevEco Studio: 5.0.3.132, SDK: API12 (5.0.0.19)
- DevEco Studio: NEXT Beta1-5.0.3.806, SDK: API12 Release (5.0.0.66)

## 贡献代码

使用过程中发现任何问题都可以提 [Issue](https://gitcode.com/openharmony-tpc/openharmony_tpc_samples/issues) 给组件，当然，也非常欢迎发 [PR](https://gitcode.com/openharmony-tpc/openharmony_tpc_samples) 共建。

## 开源协议
本项目基于 [ISC License](https://gitcode.com/openharmony-tpc/openharmony_tpc_samples/blob/master/ohos_msgpack/LICENSE) ，请自由地享受和参与开源。