/**
 * ExtData is used to handle Extension Types that are not registered to ExtensionCodec.
 */
export class ExtData {
  readonly type: number;
  readonly data: Uint8Array | ((pos: number) => Uint8Array);

  constructor(type: number, data: Uint8Array | ((pos: number) => Uint8Array)) {
    this.type = type;
    this.data = data;
  }
}
