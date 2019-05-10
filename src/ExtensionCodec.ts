// ExtensionCodec to handle MessagePack extensions

import { ExtData } from "./ExtData";
import { timestampExtension } from "./timestamp";

export type ExtensionDecoderType = (data: Uint8Array, extensionType: number) => unknown;

export type ExtensionEncoderType = (input: unknown) => Uint8Array | null;

// immutable interfce to ExtensionCodec
export type ExtensionCodecType = {
  tryToEncode(object: unknown): ExtData | null;
  decode(data: Uint8Array, extType: number): unknown;
};

export class ExtensionCodec implements ExtensionCodecType {
  public static readonly defaultCodec: ExtensionCodecType = new ExtensionCodec();

  // built-in extensions
  private readonly builtInEncoders: Array<ExtensionEncoderType> = [];
  private readonly builtInDecoders: Array<ExtensionDecoderType> = [];

  // custom extensions
  private readonly encoders: Array<ExtensionEncoderType> = [];
  private readonly decoders: Array<ExtensionDecoderType> = [];

  public constructor() {
    this.register(timestampExtension);
  }

  public register({
    type,
    encode,
    decode,
  }: {
    type: number;
    encode: ExtensionEncoderType;
    decode: ExtensionDecoderType;
  }): void {
    if (type >= 0) {
      // custom extensions
      this.encoders[type] = encode;
      this.decoders[type] = decode;
    } else {
      // built-in extensions
      const index = 1 + type;
      this.builtInEncoders[index] = encode;
      this.builtInDecoders[index] = decode;
    }
  }

  public tryToEncode(object: unknown): ExtData | null {
    // built-in extensions
    for (let i = 0; i < this.builtInEncoders.length; i++) {
      const encoder = this.builtInEncoders[i];
      if (encoder != null) {
        const data = encoder(object);
        if (data != null) {
          const type = -1 - i;
          return new ExtData(type, data);
        }
      }
    }

    // custom extensions
    for (let i = 0; i < this.encoders.length; i++) {
      const encoder = this.encoders[i];
      if (encoder != null) {
        const data = encoder(object);
        if (data != null) {
          const type = i;
          return new ExtData(type, data);
        }
      }
    }

    if (object instanceof ExtData) {
      // to keep ExtData as is
      return object;
    }
    return null;
  }

  public decode(data: Uint8Array, type: number): unknown {
    const decoder = type < 0 ? this.builtInDecoders[-1 - type] : this.decoders[type];
    if (decoder) {
      return decoder(data, type);
    } else {
      // decode() does not fail, returns ExtData instead.
      return new ExtData(type, data);
    }
  }
}
