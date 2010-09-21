
// === uu.byteArray ===
//#include uupaa.js

uu.byteArray || (function(uu) {

uu.byteArray = uubyteArray;                        // uu.byteArray(source:HexString):ByteArray
uu.byteArray.toHexString = uubyteArraytoHexString; // uu.byteArray.toHexString(source:ByteArray,
                                                   //                          verbose:Boolean = false):HexString

// uu.byteArray - HexString to ByteArray
function uubyteArray(source) { // @param String: "00010203"
                               // @return ByteArray: [0, 1, 2, 3]
                               // @throws Error("BAD_DATA")
    var rv = [], ri = -1, v, i = 0, iz = source.length,
        hh2num = uu.hash.hh2num;

    if (iz % 2) {
        throw new Error("BAD_DATA");
    }

    v = source.split("");

    for (; i < iz; i += 2) {
        rv[++ri] = hh2num[v[i] + v[i + 1]];
    }
    return rv;
}

// uu.byteArray.toHexString - array to HexString
function uubyteArraytoHexString(source,    // @param ByteArray: [0, 1, 2, 3]
                                verbose) { // @param Boolean(= false):
                                           // @return HexString: verbose = false "00010203"
                                           //                 or verbose = true  "0x00, 0x01, 0x02, 0x03"
    var rv = [], ri = -1, v, i = 0, iz = source.length,
        num2hh = uu.hash.num2hh;

    if (verbose) {
        for (; i < iz; ++i) {
            v = source[i];
            rv[++ri] = "0x" + num2hh[v * (v < 0 ? -1 : 1)];
        }
        return rv.join(", ");
    }
    for (; i < iz; ++i) {
        v = source[i];
        rv[++ri] = num2hh[v * (v < 0 ? -1 : 1)];
    }
    return rv.join("");
}

})(uu);

