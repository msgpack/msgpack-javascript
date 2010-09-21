/*!{id:"uupaa.js",ver:0.8,license:"MIT",author:"uupaa.js@gmail.com"}*/

// Firefox 3.5(end of 2010-08)
//      <audio>, <video>, offline, DnD API, @font-face, MediaQuery,
//      text-shadow:, word-wrap: box-shadow:, box-image:,
//      column-rule:, CSS Transforms, localStorage, Web Workers,
//      Geolocation API, Canvas Text API, Canvas Shadow API,
//      Canvas ImageData API, (canvas.moz-opaque)
//      MozAfterPaint Event, window.JSON
// Firefox 3.6(Gecko 1.9.2)
//      Background Gradient(-moz-linear-gradient, -moz-radial-gradient),
//      Multiple background, File API, DnD File API,
//      orientation,
// Firefox 4.0(Gecko 2.0)
//      <article> <section> <nav> <aside> <hgroup> <header> <footer>,
//      WebSockets, D2D, WebM, IndexedDB( window.moz_indexedDB ),
//      FormData, SVG Background, <img src="svg">, CSS transitions,
//      WebGL, :-moz-any(S, ...), CSS calc(),  -moz-image-rect,
//      background: -moz-element(#bg1), document.mozSetImageElement()
//      :-moz-touch, :-moz-focusring
//      :valid and :invalid for <input type="*"> (tel, color, email...)
//      :optional and :required for <input type="*" required>
//      :-moz-placeholder
//      window.mozPaintCount, window.mozRequestAnimationFrame(),
//                            window.mozAnimationStartTime
//      TouchMediaQuery(  @media all and (-moz-touch-enabled) { ... }  )
//      [Gecko]event.streamId <---> [iOS]event.touches[finger].identifier
//             event.clientX  <-!->      event.touches[finger].pageX
// Opera 10.70
//      <g buffered-rendering="static">
// iPhone
//      Portrait - 320 x 356
//      Landscape - 480 x 208
//      /favicon.png -> /apple-touch-icon.png (57x57)
//                      or <link rel="apple-touch-icon" href="{{icon url}}" />
//      FullScreen Mode (from Home Screen)
//          <meta name="apple-mobile-web-app-capable" content="yes" />
//                  content = "yes" / "no"
//          <meta name="apple-mobile-web-app-status-bar-style" content="black" />
//                  content = "default" / "black" / "black-translucent"
//      Viewport
//          <meta name="viewport" content="width=device-width, user-scalable=no, inicial-scale=1, maximum-scale=1" />
//      Format-detection:
//          <meta name="format-detection" content="telephone=no" />
//      Impl.Font:
//          HiraKakuProN-W3, HiraKakuProN-W6
//      Magic:
//          --text-size-adjust:none;
//      autocapitalize, autocorrect
//          <input type="text" autocapitalize="off" autocorrect="off">

// === Core ===

// * Manual http://code.google.com/p/uupaa-js/w/list

var uu; // window.uu - uupaa.js library namespace

uu || (function(win, doc, root,
                toString, isArray, toArray,
                trimSpace, nodeData, nodeSet,
                setTimeout, setInterval, XMLHttpRequest,
                parseInt, parseFloat, getComputedStyle, JSON) { // quick + minify

isArray || (isArray = Array.isArray = fallbackIsArray); // [FALLBACK]

// --- minify (http://d.hatena.ne.jp/uupaa/20100730) ---
var _addEventListener = "addEventListener",
    _hasOwnProperty = "hasOwnProperty",
    _getAttribute = "getAttribute",
    _setAttribute = "setAttribute",
    _toLowerCase = "toLowerCase",
    _appendChild = "appendChild",
    _nextSibling = "nextSibling",
    _removeChild = "removeChild",
    _parentNode = "parentNode",
    _firstChild = "firstChild",
    _visibility = "visibility",
    _lastChild = "lastChild",
    _className = "className",
    _prototype = "prototype",
    _nodeType = "nodeType",
    _display = "display",
    _indexOf = "indexOf",
    _replace = "replace",
    _tagName = "tagName",
    _before = "before",
    _concat = "concat",
    _height = "height",
    _number = "number",
    _string = "string",
    _after = "after",
    _width = "width",
    _false = !1,
    _true = !0,
    _types = { "NaN": 2 },          // type detection
    _dd2num = {},                   // uu.hash.dd2num = {  "00":    0 , ...  "99":   99  }
    _num2dd = {},                   // uu.hash.num2dd = {    0 :  "00", ...   99 :  "99" }
    _bb2num = {},                   // uu.hash.bb2num = { "\00":    0 , ... "\ff":  255  }
    _num2bb = {},                   // uu.hash.num2bb = {    0 : "\00", ...  255 : "\ff" }
    _hh2num = {},                   // uu.hash.hh2num = {  "00":    0 , ...  "ff":  255  }
    _num2hh = { 256: "00" },        // uu.hash.num2hh = {    0 :  "00", ...  255 :  "ff", 256: "00" }
//{@codec
    _num2b64,                       // uu.hash.num2b64 = ["A", "B", ... "/"]
    _b642num,                       // uu.hash.b642num = { "=": 0, "-": 62, "_": 63 }; // URLSafe64 chars("-", "_")
//}@codec
    _nodeiddb = {},                 // { nodeid: node, ... }
    _nodeidnum = 0,                 // nodeid counter
    _tokenCache = {},               // { css-selector-expression: token, ... } for uu.query
    _guidCounter = 0,               // uu.number
//{@storage
    _storage = {
        info: function(used, max, pair, backend) {
            return { used: used, max: max, pair: pair, backend: backend };
        },
/*{@mb*/index: "uuindex", /*}@mb*/  // for IEStorage
        store: "uustore",           // for IEStorage, CookieStorage
        expire: (new Date(2032, 1, 1)).toUTCString() // expire date
    },
//}@storage
    // --- environment ---
    _env = detectEnvironment(0.8),  // as uu.env
    _ie = _env.ie,                  // is IE
    _ie678 = _ie && _env < 9,       // is IE6, IE7, IE8
    _gecko = _env.gecko,            // is Gecko (Firefox, ...)
    _opera = _env.opera,            // is Opera (Opera, Opera Mini)
    _webkit = _env.webkit;          // is WebKit (Safari, iPhone, iPad, Google Chrome)

// --- HTML5 NEXT ---
// http://www.whatwg.org/specs/web-apps/current-work/multipage/dom.html
doc.html || (doc.html = root);                   // document.html = <html>
doc.head || (doc.head = uutag("head", root)[0]); // document.head = <head>

// --- LIBRARY STRUCTURE ---
uu = uumix(uufactory, {             // uu(expr:NodeSet/Node/NodeArray/OOPClassNameString/window,
                                    //    arg1:NodeSet/Node/Expression/Mix = void,
                                    //    arg2:Mix = void,
                                    //    arg3:Mix = void,
                                    //    arg4:Mix = void):Instance/NodeSet
                                    //  [1][Class factory]   uu("MyClass", arg1, arg2) -> new uu.Class.MyClass(arg1, arg2)
                                    //  [2][NodeSet factory] uu("div>ul>li", <body>) -> NodeSet
    config:   uuarg(win.uuconfig, { // uu.config - Hash: user configurations
//{@storage
        storage:    {
            disable:_false,         // uu.config.storage.disable(= false) - Boolean:
            order:  "LFICM",        // uu.config.storage.order(= "LFICM") - String: storage backends and detection order
                                    //  "L" = LocalStorage, "F" = FlashStorage,
                                    //  "I" = IEStorage, "C" = CookieStorage, "M" = MemStorage
            space:  0               // uu.config.storage.space(= 0) - Number: require free space(unit: byte). 0 is no require
        },
//}@storage
//{@audio
        audio:      {
            disable:_false,         // uu.config.audio.disable(= false) - Boolean:
            order:  "ASFN"          // uu.config.audio.order(= "ASFN") - String: audio backends and detection order
                                    //  "A" = <audio>, "S" = SilverlightAudio, "F" = FlashAudio, "N" = NoAudio
        },
//}@audio
        img:        "http://uupaa-js.googlecode.com/svn/trunk/0.8/img/"  // image/css path
    }),
    // --- ENVIRONMENT ---
    env:            _env,           // uu.env - Hash: environment informations
                                    //      { library, ie, ie6, ie7, ie8, ie9,
                                    //        opera, gecko, webkit, chrome, safari,
                                    //        mobile, jit, touch, flash, silverlight }
    ie:             _ie,            // uu.ie - as uu.env.ie
    ie678:          _ie678,         // uu.ie678 - as uu.env.ie678
    gecko:          _gecko,         // uu.gecko - as uu.env.gecko
    opera:          _opera,         // uu.opera - as uu.env.opera
    webkit:         _webkit,        // uu.webkit - as uu.env.webkit
    ver:            _env,           // uu.ver - Hash: as uu.ver [DEPRECATED]
    // --- CODE SNIPPET ---
//{@snippet
    snippet:        uusnippet,      // uu.snippet(id:String, arg:Hash/Array = void):String/Mix
//}@snippet
    // --- AJAX / JSONP ---
//{@ajax
    ajax:     uumix(uuajax, {       // uu.ajax(url:String, option:Hash, callback:Function)
                                    //  [1][async request] uu.ajax("http://...", { method: "POST", data: ... }, callback)
        post:       uuajaxpost,     // uu.ajax.post(url:String, option:Hash, callback:Function)
        clear:      uuajaxclear,    // uu.ajax.clear() - clear "If-Modified-Since" cache
        binary:     uuajaxbinary    // uu.ajax.binary(url:String, option:Hash, callback:Function)
    }),
    jsonp:          uujsonp,        // uu.jsonp(url:String, option:Hash, callback:Function)
                                    //  [1][async request] uu.jsonp("http://...callback=@", { method: "mycallback" }, callback)
//}@ajax
    js:             uujs,           // uu.js(url:String):Node - <script src="url">
    stat:           uustat,         // uu.stat(url:String):Boolean
    require:        uurequire,      // uu.require(url:String, option:Hash = {}):Hash - { data, option, status, ok }
                                    //  [1][sync request] uu.require("http://...") -> { data, option, status, ok }
    // --- TYPE MATCH AND DETECTION ---
    like:           uulike,         // uu.like(lval:Date/Hash/Fake/Array, rval:Date/Hash/Fake/Array):Boolean
    type:           uutype,         // uu.type(mix:Mix):Number
                                    //  uu.type.BOOLEAN      -  1: Boolean
                                    //  uu.type.NUMBER       -  2: Number
                                    //  uu.type.STRING       -  3: String
                                    //  uu.type.FUNCTION     -  4: Function
                                    //  uu.type.ARRAY        -  5: Array
                                    //  uu.type.DATE         -  6: Date
                                    //  uu.type.REGEXP       -  7: RegExp
                                    //  uu.type.UNDEFINED    -  8: undefined
                                    //  uu.type.NULL         -  9: null
                                    //  uu.type.HASH         - 10: Hash (aka Object)
                                    //  uu.type.NODE         - 11: Node (HTMLElement)
                                    //  uu.type.FAKEARRAY    - 12: FakeArray (Arguments, NodeList, ...)
    complex:        uucomplex,      // uu.complex(key:String/Hash = void, value:String/Number = void):Number
                                    //  [1][get items]  uu.complex() -> 1
                                    //  [2][get item]   uu.complex(key) -> 2
                                    //  [3][set item]   uu.complex(key, value) -> 3
                                    //  [4][set items]  uu.complex({ key: value, ... }) -> 4
    isNumber:       isNumber,       // uu.isNumber(search:Mix):Boolean
    isString:       isString,       // uu.isString(search:Mix):Boolean
    isFunction:     isFunction,     // uu.isFunction(search:Mix):Boolean
    ifFunction:     ifFunction,     // uu.ifFunction(value:Mix, var_args:Arguments = void):Mix
    // --- HASH / ARRAY ---
    arg:            uuarg,          // uu.arg(arg1:Hash/Function = {}, arg2:Hash, arg3:Hash = void):Hash/Function
    mix:            uumix,          // uu.mix(base:Hash/Function, flavor:Hash, aroma:Hash = void,
                                    //        override:Boolean = true):Hash/Function
    has:            uuhas,          // uu.has(source:Hash/Array, search:Hash/Array):Boolean
    nth:            uunth,          // uu.nth(source:Hash/Array, index:Number = 0):Array - [key, value]
                                    //  [1][Hash nth ]   uunth({ a: 1, b: 2 }, 1)    -> ["b", 2]
                                    //  [2][Array nth]   uunth(["a", 100, true], 1)  -> [1, 100]
                                    //  [3][Array first] uunth(["a", 100, true])     -> [0, "a"]
                                    //  [4][Array last]  uunth(["a", 100, true], -1) -> [2, true]
    each:           uueach,         // uu.each(source:Hash/Array/Number, evaluator:Function, arg:Mix = void)
    keys:           uukeys,         // uu.keys(source:Hash/Array):Array
    pair:           uupair,         // uu.pair(key:Number/String/Hash, value:Mix):Hash - { key: value }
                                    //  [1][make pair]    uu.pair(1, 2)        -> { 1: 2 }
                                    //  [2][through hash] uu.pair({ 1: 2 }, 3) -> { 1: 2 }
    size:           uusize,         // uu.size(source:Hash/Array):Number
    calls:          uucalls,        // uu.calls(functionArray:FunctionArray, Arguments/MixArray = void, that:this = void):Array
    clone:          uuclone,        // uu.clone(source:Hash/Array):Hash/Array - shallow copy
    values:         uuvalues,       // uu.values(source:Hash/Array):Array
    indexOf:        uuindexof,      // uu.indexOf(source:Hash/Array, searchValue:Mix):Number/String/void
    hash:           uuhash,         // uu.hash(source:JointString, splitter:String/RegExp = /[,;:]/):Hash
                                    //  [1][String to Hash] uu.hash("a,1,b,2") -> { a: "1", b: "2" }
                                    //  [2][String to Hash] uu.hash("a:1,b:2") -> { a: "1", b: "2" }
                                    //  [3][String to Hash] uu.hash("a:1;b:2") -> { a: "1", b: "2" }
    array:    uumix(uuarray, {      // uu.array(source:Array/Mix/NodeList/Arguments,
                                    //          sliceStart:Number = void,
                                    //          sliceEnd:Number = void):Array+Hash - Array + { first, last }
                                    //  [1][through Array]      uu.array([1, 2])    -> [1, 2]
                                    //  [2][mix to Array]       uu.array(mix)       -> [mix]
                                    //  [3][NodeList to Array]  uu.array(NodeList)  -> [node, ...]
                                    //  [4][arguments to Array] uu.array(arguments) -> [arg, ...]
                                    //  [5][to Array + slice]   uu.array(uu.tag("", document), 1, 3) -> [<head>, <meta>]
        dump:       uuarraydump,    // uu.array.dump(source:ByteArray, type:String = "HEX"):String
                                    //  [1][ByteArray dump] uu.array.dump([1, 2, 3]) -> "010203"
                                    //  [2][ByteArray dump] uu.array.dump([1, 2, 3], "0x", ", 0x") -> "0x01, 0x02, 0x03"
        sort:       uuarraysort,    // uu.array.sort(source:Array, method:String/Function = "A-Z"):Array
        clean:      uuarrayclean,   // uu.array.clean(source:Array):Array
        toHash:     uuarraytohash,  // uu.array.toHash(key:Array, value:Array/Mix, toNumber:Boolean = false):Hash
        unique:     uuarrayunique   // uu.array.unique(source:Array, literalOnly:Boolean = false):Array
    }),
    // --- ATTRIBUTE ---
    attr:           uuattr,         // uu.attr(node:Node, key:String/Hash = void,
                                    //                    value:String = void):String/Hash/Node
                                    //  [1][get items] uu.attr(node) -> { key: "value", ... }
                                    //  [2][mix items] uu.attr(node, { key: "value", ... }) -> node
                                    //  [3][get item]  uu.attr(node, key) -> "value"
                                    //  [4][set item]  uu.attr(node, key, "value") -> node
    // --- NODE DATA ---
    data:     uumix(uudata, {       // uu.data(node:Node, key:String/Hash = void,
                                    //                    value:Mix: = void):Hash/Mix/Node/undefined
                                    //  [1][get items] uu.data(node) -> { key: value, ... }
                                    //  [2][mix items] uu.data(node, { key: value, ... }) -> node
                                    //  [3][get item]  uu.data(node, key) -> value
                                    //  [4][set item]  uu.data(node, key, value) -> node
        clear:      uudataclear     // uu.data.clear(node:Node, key:String = void):Node
                                    //  [1][clear items] uu.data.clear(node) -> node
                                    //  [2][clear item]  uu.data.clear(node, key) -> node
//      bind:       uudatabind,     // uu.data.bind(key:String, callback:Function)
//      unbind:     undataunbind    // uu.data.unbind(key:String)
    }),
    // --- CSS / STYLE ---
    css:      uumix(uucss, {        // uu.css(node:Node, key:String/Hash = void,
                                    //                   value:String = void):Hash/String/Node
                                    //  [1][get computed items]              uu.css(node) -> { key: value, ... }
                                    //  [2][mix items]                       uu.css(node, { key: value, ... }) -> node
                                    //  [3][get item]                        uu.css(node, key)  -> value
                                    //  [4][set item]                        uu.css(node, key, value) -> node
                                    //  [5][get computed(px unitized) items] uu.css(node, "px") -> { key: value, ... }
        unit:       uucssunit,      // uu.css.unit(node:Node, value:Number/CSSUnitString,
                                    //             quick:Boolean = false,
                                    //             prop:String = "left"):Number
                                    //  [1][convert pixel]  uu.css.unit(<div>,  123  ) -> 123
                                    //  [2][convert pixel]  uu.css.unit(<div>, "12px") -> 12
                                    //  [3][convert pixel]  uu.css.unit(<div>, "12em") -> 192
                                    //  [4][convert pixel]  uu.css.unit(<div>, "12pt") -> 16
                                    //  [5][convert pixel]  uu.css.unit(<div>, "auto") -> 100
                                    //  [6][convert pixel]  uu.css.unit(<div>, "auto", false, "borderTopWidth") -> 12
        // --- CSS BOX MODEL ---
//{@cssbox
        box:        uucssbox,       // uu.css.box(node:Node, quick:Boolean = false, mbp:Number = 0x7):Hash
        rect:       uucssrect,      // uu.css.rect(node:Node, ancestorNode:Node = null):Hash { x, y, w, h, from }
        position:   uucssposition,  // uu.css.position(node:Node, pos:String = "s"):Node
                                    //  [1][to static]   uu.css.position(<div>, "static")   -> <div style="position: static">
                                    //  [2][to absolute] uu.css.position(<div>, "absolute") -> <div style="position: absolute">
                                    //  [3][to relative] uu.css.position(<div>, "relative") -> <div style="position: relative">
//}@cssbox
        // --- CSS 2 ---
        bgcolor:    uucssbgcolor,   // uu.css.bgcolor(node:Node):Color
        // --- CSS 3 ---
        opacity:    uucssopacity,   // uu.css.opacity(node:Node, value:Number/String):Number/Node
                                    //  [1][get opacity] uu.css.opacity(node) -> 0.5
                                    //  [2][set opacity] uu.css.opacity(node, 0.5) -> node
        transform:  uucsstransform, // uu.css.transform(node:Node):Node/NumberArray
                                    //  [1][get transform] uu.css.transform(node) -> [scaleX, scaleY, rotate, translateX, translateY ]
                                    //  [2][set transform] uu.css.transform(node, 1, 1, 0, 0, 0) -> node
        userSelect: uucssuserSelect // uu.css.userSelect(node:Node, allow:Boolean = false):Node
    }),
    // --- STYLESHEET ---
    ss:             uuss,           // uu.ss(id:StyleSheetIDString = ""):StyleSheetObject
                                    //  [1][get/create StyleSheet object] uu.ss("myStyleSheet") -> StyleSheet
    // --- VIEW PORT ---
    viewport:       uuviewport,     // uu.viewport():Hash - { innerWidth, innerHeight,
                                    //                        pageXOffset, pageYOffset,
                                    //                        orientation, devicePixelRatio }
    // --- TIMER ---
    interval:       uuinterval,     // uu.interval(callback:Function, arg:Mix = void):Number
    // --- EFFECT / ANIMATION ---
//{@fx
    fx:       uumix(uufx, {         // uu.fx(node:Node, duration:Number, param:Hash/Function = void):Node
                                    //  [1][abs]             uu.fx(node, 500, { o: 0.5, x: 200 })
                                    //  [2][rel]             uu.fx(node, 500, { h: "+100", o: "+0.5" })
                                    //  [3][with "px" unit]  uu.fx(node, 500, { h: "-100px" })
                                    //  [4][with easing fn]  uu.fx(node, 500, { h: [200, "InOutQuad"] })
                                    //  [5][standby]         uu.fx(node, 2000)
                                    //  [6][after callback]  uu.fx(node, 500, { o: 1, after: afterCallback })
                                    //  [7][before callback] uu.fx(node, 500, { o: 1, before: beforeCallback })
                                    //  [8][revert]          uu.fx(node, 500, { o: 1, r: 1 })
        easing:     {},             // uu.fx.easing - easing functions
        skip:       uufxskip,       // uu.fx.skip(node:Node = null, skipAll:Boolean = false, invisible:Boolean = false):NodeArray
        stop:       uufxstop,       // uu.fx.stop(node:Node):Node
        isBusy:     uufxisbusy,     // uu.fx.isBusy(node:Node):Boolean
        isHide:     uufxishide,     // uu.fx.isHide(node:Node):Boolean
        hide:       uufxhide,       // uu.fx.hide(node:Node, duration:Number = 0):Node
        show:       uufxshow,       // uu.fx.show(node:Node, duration:Number = 0, displayValue:String= "block"):Node
        fade:       uufxfade,       // uu.fx.fade(node:Node, duration:Number, option:Hash = {}):Node
        puff:       uufxpuff,       // uu.fx.puff(node:Node, duration:Number, option:Hash = {}):Node
        flare:      uufxflare,      // uu.fx.flare(node:Node, duration:Number, option:Hash = { parts: 10, range: 200 }):Node
        slide:      uufxslide,      // uu.fx.slide(node:Node, duration:Number, option:Hash = {}):Node
        shrink:     uufxshrink,     // uu.fx.shrink(node:Node, duration:Number, option:Hash = {}):Node
        movein:     uufxmovein,     // uu.fx.movein(node:Node, duration:Number, option:Hash = { degree: 0, range: 200 }):Node
        moveout:    uufxmoveout,    // uu.fx.moveout(node:Node, duration:Number, option:Hash = { degree: 0, range: 200 }):Node
        highlight:  uufxhighlight   // uu.fx.highlight(node:Node, duration:Number, option:Hash = { bgc: "#ff9", reverse: 1 }):Node
    }),
//}@fx
    // --- QUERY ---
    id:             uuid,           // uu.id(expr:String, context:Node = document):Node/null
    ids:            uuids,          // uu.ids(expr:CommaJointString, context:Node = document):NodeArray
                                    //  [1] uu.ids("A,B,C") -> [<a id="A">, <li id="B">, <div id="C">]
    tag:            uutag,          // uu.tag(expr:String = "", context:Node = <body>):NodeArray
    match:          uumatch,        // uu.match(expr:CSSSelectorExpressionString, context:Node = <body>):Boolean
    query:          uuquery,        // uu.query(expr:CSSSelectorExpressionString, context:NodeArray/Node = <body>):NodeArray
    // --- CLASSNAME ---
    klass:    uumix(uuklass, {      // uu.klass(expr:String/Node, context:String/Node = <body>):NodeArray/Node
                                    //  [1][query  className]  uu.klass("warn", <div>)             -> NodeArray
                                    //  [2][add    className]  uu.klass(<div>,              "A")   -> <div class="A">
                                    //  [3][add    className]  uu.klass(<div>,             "+A B") -> <div class="A B">
                                    //  [4][remove className]  uu.klass(<div class="A B">, "-A B") -> <div>
                                    //  [5][toggle className]  uu.klass(<div class="A">,   "!A B") -> <div>
        has:        uuklasshas      // uu.klass.has(node:Node, classNames:String):Boolean
    }),
    // --- OOP ---
    Class:    uumix(uuclass, {      // uu.Class(className:String, protoMember:Hash/Function = void,
                                    //                            staticMember = void)
                                    //  [1][define tiny class]     uu.Class("Class")
                                    //  [2][define generic class]  uu.Class("Class",            { proto: ... }, { static: func... })
                                    //  [3][inherit]               uu.Class("SuperClass:Class", { proto: ... }, { static: func... })
                                    //  [4][inherit]               uu.Class("SuperClass<Class", { proto: ... }, { static: func... })
        singleton:  uuclasssingleton// uu.Class.singleton(className:String, proto:Hash/Function = void,
                                    //                                      staticMember = void)
    }),
    // --- EVENT ---
    event:    uumix(uuevent, {      // uu.event(node:Node, eventTypeEx:EventTypeExString,
                                    //                     evaluator:Function/Instance):Node
                                    //  [1][bind a event]            uu.event(node, "click", fn)             -> node
                                    //  [2][bind multi events]       uu.event(node, "click,dblclick", fn)    -> node
                                    //  [3][bind a capture event]    uu.event(node, "mousemove+", fn)        -> node
                                    //  [4][bind a namespace.event]  uu.event(node, "MyNameSpace.click", fn) -> node
        has:        uuhas,          // uu.event.has(node:Node, eventTypeEx:EventTypeExString):Boolean
        key:        uueventkey,     // uu.event.key(event:EventObjectEx):Hash - { key, code }
        edge:       uueventedge,    // uu.event.edge(event:EventObjectEx):Hash - { x, y }
        fire:       uueventfire,    // uu.event.fire(node:Node, eventType:String, param:Mix = void):Node
        stop:       uueventstop,    // uu.event.stop(event:EventObjectEx)
//{@mb
        hover:      uueventhover,   // uu.event.hover(node:Node, expr:Function/ClassNameString):Node
                                    //  [1][enter/leave callback] uu.event.hover(node, function(enter){}) -> node
                                    //  [2][toggle className]     uu.event.hover(node, "hoverAction") -> node
        unhover:    uueventunhover, // uu.event.unhover(node:Node):Node
//}@mb
//{@eventresize
        resize:     uueventresize,  // uu.event.resize(evaluator)
        unresize:   uueventunresize,// uu.event.unresize()
//}@eventresize
//{@eventcyclic
        cyclic:     uueventcyclic,  // uu.event.cyclic(node:Node, eventTypeEx:EventTypeExString,
                                    //                 cyclic:Number, callback:Function):Node
        uncyclic:   uueventuncyclic,// uu.event.uncyclic(node:Node, eventTypeEx:EventTypeExString)
//}@eventcyclic
        evaluator:                  // uu.event.evaluator(node:Node, eventTypeEx:EventTypeExString):FunctionArray
                    uueventevaluator,
        unbind:     uueventunbind,  // uu.event.unbind(node:Node, eventTypeEx:EventTypeExString = void):Node
        attach:     uueventattach,  // uu.event.attach(node:Node, eventType:String, evaluator:Function,
                                    //                                              useCapture:Boolean = false)
        detach:     uueventdetach   // uu.event.detach(node:Node, eventType:String, evaluator:Function,
                                    //                                              useCapture:Boolean = false)
    }),
    bind:           uuevent,        // uu.bind() as uu.event()
    unbind:         uueventunbind,  // uu.unbind() as uu.event.unbind()
//{@junction
    junction:       uujunction,     // uu.junction(race:Number, items:Number, callback:Function):Junction
//}@junction
    // --- LIVE EVENT ---
//{@live
    live:     uumix(uulive, {       // uu.live(expr:CSSSelectorExpressionString, eventTypeEx:EventTypeExString,
                                    //         evaluator:Function/Instance)
                                    //  [1][bind] uu.live("css > selector", "namespace.click", callback)
        has:        uulivehas       // uu.live.has(expr:CSSSelectorExpressionString, eventTypeEx:EventTypeExString):Boolean
    }),
    unlive:         uuunlive,       // uu.unlive(expr:CSSSelectorExpressionString = void, eventTypeEx:EventTypeExString = void)
                                    //  [1][unbind all]           uu.unlive()
                                    //  [2][unbind all]           uu.unlive("selector")
                                    //  [3][unbind one]           uu.unlive("selector", "click")
                                    //  [4][unbind namespace all] uu.unlive("selector", "namespace.*")
                                    //  [5][unbind namespace one] uu.unlive("selector", "namespace.click")
//}@live
    // --- NODE / NodeList / NodeID ---
    node:     uumix(uunode, {       // uu.node(node:Node/SVGNode/TagNameString = "div",
                                    //         args:Array/Argeumtns = void,
                                    //         typical:StringArray = void, callback:Function = void):Node
                                    //  [1][add node]            uu.div(uu.div())         -> <div><div></div></div>
                                    //  [2][add text node]       uu.div(uu.text("hello")) -> <div>hello</div>
                                    //  [2][add text by string]  uu.div("hello")          -> <div>hello</div>
                                    //  [4][set attr by string]  uu.div("class,hello")    -> <div class="hello"></div>
                                    //  [5][set attr by hash]    uu.div({ cn: "hello" })  -> <div class="hello"></div>
                                    //  [6][set css by string]   uu.div("", "color,red")  -> <div style="color:red"></div>
                                    //  [7][set css by hash]     uu.div("", { c: "red" }) -> <div style="color:red"></div>
                                    //  [8][callback]            uu.node.builder(callback)
                                    //                           uu.div("@123")           -> callback(<div>, "123")
                                    //  [9][add SVGNode]         uu.svg.svg(uu.svg.g())       -> <svg:svg><svg:g></svg:g></svg:svg>
                                    //  [10][add SVGText node]   uu.svg.svg(uu.svg.text("!")) -> <svg:svg><svg:text>!</svg:text></svg:svg>
                                    //  [11][set attr by string] uu.svg.svg("class,hello")    -> <svg:svg class="hello"></svg:svg>
                                    //  [12][set attr by hash]   uu.svg.svg({ cn: "hello" })  -> <svg:svg class="hello"></svg:svg>
                                    //  [13][set typical attr]   uu.svg.svg(100, 100)         -> <svg:svg x="100" y="100"></svg:svg>
                                    //  [14][set css by string]  uu.svg.svg("", "color,red")  -> <svg:svg style="color:red"></svg:svg>
                                    //  [15][set css by hash]    uu.svg.svg("", { c: "red" }) -> <svg:svg style="color:red"></svg:svg>
                                    //  [16][callback]           uu.node.builder(callback)
                                    //                           uu.svg.svg("@123")           -> callback(<svg:svg>, "123")
        at:         uunodeat,       // uu.node.at(callback:Function)
                                    //  [1][set   callback] uu.node.at(callback(node, idnet))
                                    //  [2][clear callback] uu.node.at(null)
        add:        uunodeadd,      // uu.node.add(source:Node/DocumentFragment/HTMLFragment/TagName = "div",
                                    //             context:Node = <body>, position:String = "./last"):Node
                                    //  [1][add div node]          uu.node.add()         -> <body><div /></body>
                                    //  [2][from tagName]          uu.node.add("p")      -> <body><p /></body>
                                    //  [3][from node]             uu.node.add(uu.div()) -> <body><div /></body>
                                    //  [4][from HTMLFragment]     uu.node.add("<div><p>txt</p></div>") -> <body><div><p>txt</p></div></body>
                                    //  [5][from DocumentFragment] uu.node.add(DocumentFragment)        -> <body>{{fragment}}</body>
                                    //   --- uu.node.add ---
                                    //    <div id="parentNode">
                                    //
                                    //        <div id="firstSibling">    first   </div>
                                    //        <div id="prevSibling">     prev    </div>
                                    //        <div id="contextNode">
                                    //            <div id="firstChild">  ./first </div>
                                    //            <div />
                                    //            <div id="lastChild">   ./last  </div>
                                    //        </div>
                                    //        <div id="nextSibling">     next    </div>
                                    //        <div id="lastSibling">     last    </div>
                                    //
                                    //    </div>
        has:        uuhas,          // uu.node.has(parent:Node, child:Node):Boolean
        bros:       uunodebros,     // uu.node.bros(node:Node):NodeArray+Hash - [node, ...] + { first, prev, next, last, index }
        bulk:       uunodebulk,     // uu.node.bulk(source:Node/HTMLFragment, context:Node = <div>):DocumentFragment
        glue:       uunodeglue,     // uu.node.glue(node:Node, work:Function):Node
        path:       uunodepath,     // uu.node.path(node:Node):CSSQueryString
                                    //  [1][get CSSQueryString] uu.node.path(<div>) -> "body>div"
        sort:       uunodesort,     // uu.node.sort(ary:NodeArray, context:Node = <body>):Array - sort by document order
        swap:       uunodeswap,     // uu.node.swap(swapout:Node, swapin:Node):Node (swapout node)
        wrap:       uunodewrap,     // uu.node.wrap(innerNode:Node, outerNode:Node):Node (innerNode)
        clear:      uunodeclear,    // uu.node.clear(parent:Node):Node
        clone:      uunodeclone,    // uu.node.clone(parent:Node, quick:Boolean = false):Node
        remove:     uunoderemove,   // uu.node.remove(node:Node):Node
        normalize:  uunodenormalize // uu.node.normalize(parent:Node = <body>, depth:Number = 0):Number
    }),
    add:            uunodeadd,      // uu.add as uu.node.add
    swap:           uunodeswap,     // uu.swap as uu.node.swap
    remove:         uunoderemove,   // uu.remove as uu.node.remove
    // --- NODE ID ---
    nodeid:   uumix(uunodeid, {     // uu.nodeid(ident:Node/Number, remove:Boolean = false):Number/Node
                                    //  [1][get NodeID by Node]  uu.nodeid(Node)         -> NodeID
                                    //  [2][get Node by NodeID]  uu.nodeid(NodeID)       -> Node
                                    //  [3][remove NodeID]       uu.nodeid(Node, true)   -> Node
                                    //  [4][remove NodeID]       uu.nodeid(NodeID, true) -> Node
        remove:     uunodeidremove  // uu.nodeid.remove(ident:Node/Number)
    }),
    // --- NODE BUILDER ---
    head:           uuhead,         // uu.head(/* var_args(node,attr,css,buildid) */):<head>
    body:           uubody,         // uu.body(/* var_args(node,attr,css,buildid) */):<body>
    text:           uutext,         // uu.text(data:String/FormatString/Node,
                                    //         text:String/Mix(= void), var_args:Mix, ...):String/Node
                                    //  [1][create text node]          uu.text("text")          -> createTextNode("text")
                                    //  [2][create formated text node] uu.text("@ @", "a", "b") -> createTextNode("a b")
                                    //  [3][get text]                  uu.text(node)            -> "text"
                                    //  [4][set text]                  uu.text(node, "text")    -> node
                                    //  [5][set formated text]         uu.text(node, "@", "a")  -> node
    // --- FORM.VALUE ---
//{@form
    value:          uuvalue,        // uu.value(node:Node, value:String = void):StringArray/Node
                                    //  [1][get value]            uu.value(node) -> value or [value, ...]
                                    //  [2][set value]            uu.value(node, "value") -> node
                                    //  [3][get <textarea>]       uu.value(node) -> "innerText"
                                    //  [4][get <button>]         uu.value(node) -> "<button value>"
                                    //  [5][get <option>]         uu.value(node) -> "<option value>" or
                                    //                                              "<option>value</option>"
                                    //  [6][get <selet>]          uu.value(node) -> selected option value
                                    //  [7][get <selet multiple>] uu.value(node) -> ["value", ...]
                                    //  [8][get <input checkbox>] uu.value(node) -> ["value", ...]
                                    //  [9][get <input radio>]    uu.value(node) -> "value"
//}@form
    // --- JSON ---
    json:     uumix(uujson, {       // uu.json(source:Mix, alt:Boolean = false):JSONString
        decode:     uujsondecode    // uu.json.decode(jsonString:JSONString, alt:Boolean = false):Mix/Boolean
    }),
    // --- STRING ---
    fix:            uufix,          // uu.fix(source:String):String
                                    //  [1][css-prop to js-css-prop] uu.fix("background-color") -> "backgroundColor"
                                    //  [2][std-name to ie-name]     uu.fix("float")            -> "cssFloat" or "styleFloat"(IE)
                                    //  [3][html-attr to js-attr]    uu.fix("for")              -> "htmlFor"
                                    //  [4][through]                 uu.fix("-webkit-shadow")   -> "-webkit-shadow"
    trim:     uumix(uutrim, {       // uu.trim(source:String, replacement:String = " "):String
                                    //  [1][trim and inner space] uu.trim("  has  space  ") -> "has  space"
        tag:        uutrimtag,      // uu.trim.tag("  <h1>A</h1>  B  <p>C</p>  ") -> "A B C"
                                    //  [1][trim tags]            uu.trim.tag("  <h1>A</h1>  B  <p>C</p>  ") -> "A B C"
        func:       uutrimfunc,     // uu.trim.func('  url("http://...")  ') -> "http://..."
                                    //  [1][trim function]        uu.trim.func(' url("http://...") ') -> "http://..."
                                    //  [2][trim function]        uu.trim.func(' rgb(1, 2, 3) ')      -> "1, 2, 3"
        quote:      uutrimquote     // uu.trim.quote(' "quote string" ') -> 'quote string'
                                    //  [1][trim double and single quotes] uu.trim.quote(' "quote string" ') -> 'quote string'
    }),
    f:              uuf,            // uu.f(format:FormatString, var_args, ...):String
                                    //  [1][placeholder] uu.format("@ dogs and @", 101, "cats") -> "101 dogs and cats"
    format:         uuf,            // uu.format(...) as uu.f
//{@sprintf
    sprintf:        uusprintf,      // uu.sprintf(format:FormatString, var_args ...):String
//}@sprintf
    // --- CODEC ---
//{@codec
    entity:   uumix(uuentity, {     // uu.entity(str:String):String
                                    //  [1][to Entity]           uu.entity("<html>") -> "&lt;html&gt;"
        decode:     uuentitydecode  // uu.entity.decode(str:String):String
                                    //  [1][from Entity]         uu.entity.decode("&lt;html&gt;") -> "<html>"
                                    //  [2][from UNICODE Entity] uu.entity.decode("\u0041\u0042") -> "AB"
    }),
    base64:   uumix(uubase64, {     // uu.base64(data:String/ByteArray,
                                    //           toURLSafe64:Boolean = false):Base64String/URLSafe64String
        decode:     uubase64decode  // uu.base64.decode(data:Base64String/URLSafe64String,
                                    //                  toByteArray:Boolean = false):String/ByteArray
    }),
    utf8:     uumix(uuutf8, {       // uu.utf8(str:String):UTF8ByteArray
        decode:     uuutf8decode    // uu.utf8.decode(byteArray:UTF8ByteArray,
                                    //                startIndex:Number = 0,
                                    //                endIndex:Number = void):String
    }),
//{@md5
    md5:            uumd5,          // uu.md5(ASCIIString/ByteArray):HexString
                                    //   uu.md5("")              -> "d41d8cd98f00b204e9800998ecf8427e"
                                    //   uu.md5("hoge")          -> "ea703e7aa1efda0064eaa507d9e8ab7e"
                                    //   uu.md5("ascii")         -> "5b7f33be48f19c25e1af2f96cffc569f"
                                    //   uu.md5("user-password") -> "9a3729201fdd376c76ded01f986481b1"
                                    //   uu.md5(uu.utf8("CJK chars")) -> ...
//}@md5
//{@sha1
    sha1:           uusha1,         // uu.sha1(ASCIIString/ByteArray):HexString
                                    //   uu.sha1("")              -> "da39a3ee5e6b4b0d3255bfef95601890afd80709"
                                    //   uu.sha1("hoge")          -> "31f30ddbcb1bf8446576f0e64aa4c88a9f055e3c"
                                    //   uu.sha1("ascii")         -> "51c066b36ea8b32076964c766f8a0324ca4eb4b9"
                                    //   uu.sha1("user-password") -> "691ca1151748ae7b52b1c82eaaacc60f8d41db82"
                                    //   uu.sha1(uu.utf8("CJK chars")) -> ...
//}@sha1
//}@codec
    // --- DATE ---
    date:           uudate,         // uu.date(source:DateHash/Date/Number/String = void):DateHash
                                    //  [1][get now]                 uu.date() -> DateHash
                                    //  [2][DateHash]                uu.date(DateHash) -> cloned DateHash
                                    //  [2][date to hash]            uu.date(Date) -> DateHash
                                    //  [3][time to hash]            uu.date(milliseconds) -> DateHash
                                    //  [4][DateString to hash]      uu.date("2000-01-01T00:00:00[.000]Z") -> DateHash
                                    //  [5][ISO8601String to hash]   uu.date("2000-01-01T00:00:00[.000]Z") -> DateHash
                                    //  [6][RFC1123String to hash]   uu.date("Wed, 16 Sep 2009 16:18:14 GMT") -> DateHash
                                    //
                                    // DateHash - { Y: 2010, M: 12, D: 31,
                                    //              h: 23, m: 59, s: 59, ms: 999,
                                    //              time: unix_time, ISO(), GMT() }
    // --- NUMBER ---
    number:   uumix(uunumber, {     // uu.number():Number - unique number(guid)
        range:      uunumberrange,  // uu.number.range(min:Number, value:Number, max:Number):Number
        expand:     uunumberexpand  // uu.number.expand(current:Number, value:String/Number, fn:Function = parseFloat):Number
    }),
    // --- EVALUATION ---
    ready:    uumix(uuready, {      // uu.ready(readyEventType:IgnoreCaseString = "dom", callback:Function, ...)
        fire:       uureadyfire,    // uu.ready.fire(readyEventType:CaseInsenseString, param:Mix = document)
        dom:        _false,         // true is DOMContentLoaded event fired
        window:     _false,         // true is window.onload event fired
        audio:      _false,         // true is <audio> ready event fired
        video:      _false,         // true is <video> ready event fired
        canvas:     _false,         // true is <canvas> ready event fired
        storage:    _false,         // true is window.localStorage ready event fired
        reload:     _false          // true is blackout (css3 cache reload)
    }, detectFeatures(_env)),
    // --- COLOR ---
//{@color
    color:    uumix(uucolor, {      // uu.color(expr:Color/RGBAHash/HSLAHash/String):Color
                                    //  [1][Color]                     uu.color(Color)               -> Color
                                    //  [2][RGBAHash/HSLAHash to hash] uu.color({ h:0,s:0,l:0,a:1 }) -> Color
                                    //  [3][W3CNamedColor to hash]     uu.color("black")             -> Color
                                    //  [4]["#000..." to hash]         uu.color("#000")              -> Color
                                    //  [5]["rgba(,,,,)" to hash]      uu.color("rgba(0,0,0,1)")     -> Color
                                    //  [6]["hsla(,,,,) to hash]       uu.color("hsla(360,1%,1%,1)") -> Color
        add:        uucoloradd,     // uu.color.add(source:String)
        random:     uucolorrandom   // uu.color.random():Color
    }),
//}@color
    // --- IMAGE ---
//{@image
    image:    uumix(uuimage, {      // uu.image(url:String, callback:Function)
        size:       uuimagesize     // uu.image.size(node:HTMLImageElement):Hash - { w, h }
    }),
//}@image
    // --- FONT ---
//{@font
    font:     uumix(uufont, {       // uu.font(font, embase) -> Hash
        list:       uufontlist,     // uu.font.list(fonts) -> Array
        detect:     uufontdetect,   // uu.font.detect(node) -> String("Alial")
        metric:     uufontmetric    // uu.font.text(font, text) -> { w, h }
    }),
//}@font
    // --- SVG ---
//{@svg
    svg:            uusvg,          // uu.svg(x:Number, y:Number, width:Number, height:Number,
                                    //        *attr:Hash, *css:Hash):<svg:svg>
//}@svg
    // --- CANVAS ---
//{@canvas
    canvas:         uucanvas,       // uu.canvas(width:Number = 300, height:Number = 150,
                                    //           *attr:Hash, *css:Hash):<canvas>
//}@canvas
    // --- AUDIO ---
//{@audio
    audio:          uuaudio,        // uu.audio(url:String, option:Hash, callback:Function)
//}@audio
    // --- FLASH ---
//{@flash
//{@mb
    flash:          uuflash,        // uu.flash(url:String, id:String,
                                    //          option:Hash = { allowScriptAccess: "always" },
                                    //          callback:Function):Node
//}@mb
//}@flash
    // --- COOKIE ---
//{@cookie
    cookie:   uumix(uucookie, {     // uu.cookie(prefix:String):Hash
        save:       uucookiesave    // uu.cookie.save(prefix:String, data:Hash, date:UTCDateString/Date = void):Number
    }),
//}@cookie
    // --- STORAGE(HTML5 WebStorage) --
//{@storage
    storage:        null,           // uu.storage - uu.Class.Storage instance
//}@storage
    // --- URL ---
//{@url
    url:      uumix(uuurl, {        // uu.url(url:URLHash/URLString = ""):URLString/URLHash/null
                                    //  [1][current abs-dir] uu.url() -> "http://example.com/index.htm"
                                    //  [2][parse url]       uu.url("http://example.com/dir/file.ext") -> { schme: "http", ... }
                                    //  [3][build url]       uu.url({ schme: "http", ... }) -> "http://example.com/..."
        abs:        uuurlabs,       // uu.url.abs(url:URLString = ".", currentDir = ""):URLString
                                    //  [1][get abs-url]   uu.url.abs("./index.htm") -> "http://example.com/index.htm"
        dir:        uuurldir,       // uu.url.dir(url:URLString/PathString):String
                                    //  [1][chop filename] uu.url.dir("http://example.com/dir/file.ext") -> "http://example.com/dir/"
                                    //  [2][chop filename] uu.url.dir("/root/dir/file.ext")              -> "/root/dir/"
                                    //  [3][chop filename] uu.url.dir("/file.ext")                       -> "/"
                                    //  [4][through]       uu.url.dir("/")                               -> "/"
                                    //  [5][supply slash]  uu.url.dir("")                                -> "/"
        split:      uuurlsplit      // uu.url.split(url:URLString/PathString):Array+Hash - { dir, file }
                                    //  [1][split dir | file.ext] uu.url.split("http://example.com/dir/file.ext") -> ["http://example.com/dir/", "file.ext"]
    }),
    qs:             uuqs,           // uu.qs(queryString:QueryString/Hash, add:Hash):QueryString/Hash
                                    //  [1][parse] uu.qs("key=val;key2=val2")              -> { key: "val", key2: "val2" }
                                    //  [2][build] uu.qs({ key: "val",     key2: "val2" }) -> "key=val;key2=val2"
                                    //  [3][add]   uu.qs( "key=val",     { key2: "val2" }) -> "key=val;key2=val2"
                                    //  [4][add]   uu.qs({ key: "val" }, { key2: "val2" }) -> "key=val;key2=val2"
//}@url
    // --- DEBUG ---
//{@canvas
    hatch:          uuhatch,        // uu.hatch(size = 10, unit = 5, color = "skyblue", color2 = "steelblue")
//}@canvas
    glow:           uuglow,         // uu.glow(node:Node/NodeArray/NodeList/NodeSet/CSSSelectorExpressionString)
    puff:           uupuff,         // uu.puff(source:Mix/FormatString, var_args:Mix, ...)
    log:      uumix(uulog, {        // uu.log(log:Mix, var_args:Mix, ...)
        clear:      uulogclear      // uu.log.clear()
    }),
    // --- UNIT TEST ---
//{@test
    ok:             uuok,           // uu.ok(title:String = void,
                                    //       lval:Mix = void, operator:String = void, rval:Mix = void,
                                    //       more:String = void):Hash/void - { ok, ng, ms, total }
                                    //  [1][add separater]  uu.ok("group separater or comment")
                                    //  [2][judge]          uu.ok("test title", 1, "===", 1, "more info")
                                    //  [3][get/show score] uu.ok() -> { ok, ng, ms, total }
    ng:             uung,           // uu.ng(title:String,
                                    //       lval:Mix = void, operator:String = void, rval:Mix = void)
                                    //  [1][assert]         uu.ng("123 == 123", 123, "===", 123)
//}@test
    // --- UI ---
//{@ui
    ui:       uumix(uuui, {         // uu.ui(expr:StringArray/String = "", context:Node = <body>):InstanceArray
                                    //  [1][query all UI]         uu.ui.query() -> [<div>.instance, ...]
                                    //  [2][query Slider]         uu.ui.query("Slider", <body>) -> [<div>.instance, ...]
                                    //  [3][query Slider and Tab] uu.ui.query(["Slider", "Tab"], <body>) -> [<div>.instance, ...]
                                    //  [4][query expression]     uu.ui.query("#ui>div[ui=Slider]", <body>) -> [<div>.instance, ...]
        bind:       uuuibind,       // uu.ui.bind(uiname:String, callback:Hash)
        build:      uuuibuild       // uu.ui.build(uiname:String = "", var_args ...):Node/NodeArray
                                    //  [1][build]      uu.ui("Slider", { step: 2 }) -> [<div ui="Slider" />]
                                    //  [2][transform]  uu.ui() -> [<div ui="Slider"><input type="range"/></div>, ...]
    }),
//}@ui
    // --- OTHER ---
    dmz:            {},             // uu.dmz - DeMilitarized Zone(proxy)
    nop:            uunop,          // uu.nop - none operation
    pao:            uupao           // uu.pao - `function-producing` function
                                    //  [1][pao literal ] uu.pao(false)  -> (function() { return false; })
                                    //  [2][pao function] uu.pao(uu.nop) -> (function() { return uu.nop; })
});

//{@nodeset

// uu.Class.NodeSet - uu.Class.NodeSet.prototype alias
uu.Class.NodeSet = NodeSet[_prototype] = {
    push:           NodeSetPush,    // NodeSet.push():NodeSet
    pop:            NodeSetPop,     // NodeSet.pop():NodeSet
    find:           NodeSetFind,    // NodeSet.find(expr:String):NodeSet
    nth:            NodeSetNth,     // NodeSet.nth(index:Number = 0, evaluator:Function = void):Node/NodeSet
    each:           NodeSetEach,    // NodeSet.each(evaluator:Function, loopout:Boolean = false):NodeSet
    size:           NodeSetSize,    // NodeSet.size():Number
    array:          NodeSetArray,   // NodeSet.array():NodeArray
    indexOf:        NodeSetIndexOf, // NodeSet.indexOf(node):Number(index or -1)
    add:            NodeSetAdd,     // NodeSet.add(source:Node/DocumentFragment/HTMLFragment/TagName = "div",
                                    //             position:String = "./last"):NodeSet
    klass:          NodeSetKlass,   // NodeSet.klass(className:String):NodeSet
    iter:           NodeSetIter     // [PROTECTED]
};

// NodeSetIter(0) - forEach Methods
uueach({
    bind:           uuevent,        // NodeSet.bind(eventTypeEx, callback)
    unbind:         uueventunbind,  // NodeSet.unbdin(eventTypeEx)
//{@mb
    hover:          uueventhover,   // NodeSet.hover(expr)
    unhover:        uueventunhover, // NodeSet.unhover()
//}@mb
    cyclic:         uueventcyclic,  // NodeSet.cyclic(eventTypeEx, callback, cyclic, loop)
    uncyclic:       uueventuncyclic,// NodeSet.cyclic(eventTypeEx)
//{@fx
    fx:             uufx,           // NodeSet.fx(duration, option)
    skip:           uufxskip,       // NodeSet.skip(skipAll, invisible)
    show:           uufxshow,       // NodeSet.show(duration, displayValue)
    hide:           uufxhide,       // NodeSet.hide(duration)
    fade:           uufxfade,       // NodeSet.fade(duration, option)
    puff:           uufxpuff,       // NodeSet.puff(duration, option)
    flare:          uufxflare,      // NodeSet.flare(duration, option)
    slide:          uufxslide,      // NodeSet.slide(duration, option)
    shrink:         uufxshrink,     // NodeSet.shrink(duration, option)
    movein:         uufxmovein,     // NodeSet.movein(duration, option)
    moveout:        uufxmoveout,    // NodeSet.moveout(duration, option)
    highlight:      uufxhighlight,  // NodeSet.highlight(duration, option)
//}@fx
    remove:         uunoderemove    // NodeSet.remove()
}, function(fn, name) {
    NodeSet[_prototype][name] = function() {
        return NodeSetIter(0, this, fn, arguments);
    };
});

// NodeSetIter(1) - map methods
uueach({
//{@form
    value:          uuvalue,        // NodeSet.value(value = void)
//}@form
    attr:           uuattr,         // NodeSet.attr(key:String/Hash = void, value:String = void)
    data:           uudata,         // NodeSet.data(key:String/Hash = void, value:String = void)
    css:            uucss,          // NodeSet.css(key:String/Hash = void, value:String = void)
    text:           uutext          // NodeSet.text(text:String = void, var_args...)
}, function(fn, name) {
    NodeSet[_prototype][name] = function() {
        return NodeSetIter(1, this, fn, arguments);
    };
});
//}@nodeset

// =========================================================

// uu.nop - none operation
function uunop() {
}

// uu.pao - `function-producing` function
function uupao(arg) { // @param Mix:
                      // @return Function:
    //  [1][pao literal ] uu.pao(false)  -> (function() { return false; })
    //  [2][pao function] uu.pao(uu.nop) -> (function() { return uu.nop; })

    return function() {
        return arg;
    };
}

// inner - new node
function newNode(tag) { // @param TagNameString(= "div"):
                        // @return Node: <div>
    return doc.createElement(tag || "div");
}

// inner - new text node
function newText(text) { // @param String:
                         // @return TextNode: <textNode>text</textNode>
    return doc.createTextNode(text);
}

// --- CONSTRUCTION ---
uu.config.baseDir || (uu.config.baseDir =
    uutag("script", doc).pop().src[_replace](/[^\/]+$/, function(file) {
        return file === "uupaa.js" ? "../" : "";
    }));

// --- MsgPump class ---
MsgPump[_prototype] = {
    send:           uumsgsend,      // MsgPump.send(address:NodeArray/InstanceArray/Array/Mix,
                                    //              message:String,
                                    //              param1:Mix = void,
                                    //              param2:Mix = void):Array/Mix
                                    //  [1][multicast] MsgPump.send([instance, ...], "hello") -> ["world!", ...]
                                    //  [2][unicast  ] MsgPump.send(instance, "hello") -> ["world!"]
                                    //  [3][broadcast] MsgPump.send(null, "hello") -> ["world!", ...]
    post:           uumsgpost,      // MsgPump.post(address:NodeArray/InstanceArray/Array/Mix,
                                    //              message:String,
                                    //              param1:Mix = void,
                                    //              param2:Mix = void)
                                    //  [1][multicast] MsgPump.post([instance, ...], "hello")
                                    //  [2][unicast  ] MsgPump.post(instance, "hello")
                                    //  [3][broadcast] MsgPump.post(null, "hello")
    bind:           uumsgbind,      // MsgPump.bind(instance:Instance)
    unbind:         uumsgunbind     // MsgPump.unbind(instance:Instance)
};
uu.msg = new MsgPump();             // uu.msg - MsgPump instance

// --- Junction class ---
uuclass("Junction", {
    init:           JunctionInit,   // uu.junction(race:Number, item:Number, callback:Function)
    ok:             JunctionOK,     // ok(value:Mix = void):this
    ng:             JunctionNG,     // ng(value:Mix = void):this
    judge:          JunctionJudge   // judge():this
});

// --- StyleSheet class ---
uuclass("StyleSheet", {
    init:           StyleSheetInit, // uu("StyleSheet", id:String = "")
    add:            StyleSheetAdd,  // styleSheet.add(expr:Hash/String, decl:String = void)
                                    //  [1] styleSheet.add({ "div>p": "color:red;font-weight:bold", ... })
    clear:          StyleSheetClear // styleSheet.clear()
});

// --- ECMAScript-262 5th ---
// Array.isArray - fallback impl.
function fallbackIsArray(search) { // @param Mix: search
                                   // @return Boolean:
    return toString.call(search) === "[object Array]";
}

uumix(Array[_prototype], {
//{@mb
    map:            ArrayMap,       //         map(evaluator:Function, that:this = void):Array
    some:           ArraySome,      //        some(evaluator:Function, that:this = void):Boolean
    every:          ArrayEvery,     //       every(evaluator:Function, that:this = void):Boolean
    filter:         ArrayFilter,    //      filter(evaluator:Function, that:this = void):Array
    forEach:        ArrayForEach,   //     forEach(evaluator:Function, that:this = void)
    indexOf:        ArrayIndexOf,   //     indexOf(search:Mix, fromIndex:Number = 0):Number
    lastIndexOf:                    // lastIndexOf(search:Mix, fromIndex:Number = this.length):Number
                    ArrayLastIndexOf,
//}@mb
    reduce:         ArrayReduce,    //      reduce(evaluator:Function, initialValue:Mix = void):Mix
    reduceRight:                    // reduceRight(evaluator:Function, initialValue:Mix = void):Mix
                    ArrayReduceRight
}, 0, 0);

uumix(Boolean[_prototype], {
    toJSON:         ObjectToJson    //      toJSON():Boolean
}, 0, 0);

uumix(Date[_prototype], {
    toISOString:    DateToISOString,// toISOString():String
    toJSON:         DateToJSON      //      toJSON():String
}, 0, 0);

uumix(Number[_prototype], {
    toJSON:         ObjectToJson    //      toJSON():Number
}, 0, 0);

uumix(String[_prototype], {
    trim:           StringTrim,     //        trim():String
    toJSON:         ObjectToJson    //      toJSON():String
}, 0, 0);

//{@mb
_gecko && !HTMLElement[_prototype].innerText &&
(function(proto) {
    proto.__defineGetter__("innerText", innerTextGetter);
    proto.__defineSetter__("innerText", innerTextSetter);
    proto.__defineGetter__("outerHTML", outerHTMLGetter);
    proto.__defineSetter__("outerHTML", outerHTMLSetter);
})(HTMLElement[_prototype]);
//}@mb

// --- CREATE HASH TABLES ---
uueach(("BOOLEAN,NUMBER,STRING,FUNCTION,ARRAY,DATE," +
        "REGEXP,UNDEFINED,NULL,HASH,NODE,FAKEARRAY").split(","), function(v, i) {
    uutype[v] = i + 1;              // uu.type = { BOOLEAN: 1, NUMBER: 2, ... }
});

uueach([_true, 0, "", uunop, [], new Date, /0/], function(v, i) {
    ++i < 4 && (_types[typeof v] = i);
    _types[toString.call(v)] = i;
});

(function(i, n, v) {
    for (; i < 0x200; ++i) {
        n = i - 0x100;
        _num2hh[n] = v = i.toString(16).slice(1);
        _hh2num[v] = n;
        _num2bb[n] = v = String.fromCharCode(n);
        _bb2num[v] = n;
    }
    for (i = 100; i < 200; ++i) {
        n = i - 100;
        _num2dd[n] = v = i.toString().slice(1);
        _dd2num[v] = n;
    }
    uumix(uuhash, {
        dd2num:     _dd2num,        // uu.hash.dd2num - { "00":   0 , ... "99":  99  }
        num2dd:     _num2dd,        // uu.hash.num2dd - {    0: "00", ...   99: "99" }
        bb2num:     _bb2num,        // uu.hash.bb2num - { "\00": 0, ... "\ff": 255 }
        num2bb:     _num2bb,        // uu.hash.num2bb - { 0: "\00", ... 255: "\ff" }
        hh2num:     _hh2num,        // uu.hash.hh2num - { "00": 0, ... "ff": 255 }
        num2hh:     _num2hh         // uu.hash.num2hh - { 0: "00", ... 255: "ff" }
    });
})(0x100);

// ===================================================================

// uu - factory
function uufactory(expr,   // @param NodeSet/Node/NodeArray/OOPClassNameString/window: ClassName or Expression
                   arg1,   // @param NodeSet/Node/Expression/Mix(= void): ClassName.init arg1 or Expression.context
                   arg2,   // @param Mix(= void): ClassName.init arg2
                   arg3,   // @param Mix(= void): ClassName.init arg3
                   arg4) { // @param Mix(= void): ClassName.init arg4
                           // @return Instance/NodeSet:
    //  [1][Class factory]   uu("MyClass", arg1, arg2) -> new uu.Class.MyClass(arg1, arg2)
    //  [2][NodeSet factory] uu("div>ul>li", <body>) -> NodeSet

    if (typeof expr === _string && uuclass[expr]) {     // Class factory
        return new uuclass[expr](arg1, arg2, arg3, arg4);
    }
//{@nodeset
    return new NodeSet(expr, arg1, arg2, arg3, arg4);   // NodeSet factory
//}@nodeset
}

// --- SNIPPET ---
//  <script>
//  var arg = {
//      hoge: 'style="color:red"',
//      listStyle: 'style="color: #3d3; background-color: #ddd"',
//      list: {
//          key: "a,b,c".split(",")   <-- "key" is <each> reserved word
//          value: "value1,value2,value3".split(",")
//      }
//  };
//  uu.snippet(snippetid, arg);
//  </script>
//  <script type="text/html" src="...">
//  return <>
//      <div {{arg.hoge}}>                              // {{arg.hoge}} -> style...
//          <ul>
//              <each arg.list>                         // <each arg.list> -> for (...)
//                  <li {{arg.listStyle}}>{{key}}</li>  // {{key}}   -> arg.list.key[n]
//                  <li>{{value}}</li>                  // {{value}} -> arg.list.value[n]
//              </each>
//          </ul>
//      </div>
//  </>
//  </script>
//
//{@snippet
// uusnippet - evaluate snippet
function uusnippet(id,    // @param String: snippet id. <script id="...">
                   arg) { // @param Array/Hash(= void): arg
                          // @return String/Mix:
    function brace2ident(_, ident) {
        // {{ident}}     -> {(ident)}  (dualBrace to eachBrace)
        // {{uu.ident}}  -> uu.ident
        // {{arg.ident}} -> arg.ident

        return ident[_indexOf](".") > 0 ? "'+" + ident + "+'"  // "{{arg.ident}}" -> "+ident+"
                                        : '{(' + ident + ')}'; // "{{ident}}"     -> "{(ident)}" // each brace
    }

    // <>...</> -> uu.node.bulk(' ... ');
    function each(_, match) {
        return "uu.node.bulk('" +
                match[_replace](/^\s+|\s+$/gm, "")
                     [_replace](/("|')/g, "\\$1")
                     [_replace](/\n/g, "\\n")
                     [_replace](eachBlock, function(_, hash, block) { // <each arg.list>...</each>
                        return "'+uu.snippet.each(" + hash + ",'" +
                               block[_replace](dualBrace, brace2ident) + "')+'";
                     })
                     [_replace](dualBrace, brace2ident) + "');";
    }

    arg = arg || {};
    var xhr, js = uusnippet.js[id] || "", node, // {
        eachBlock = /<each ([^>]+)>([\s\S]*?)<\/each>/g,
        dualBrace = /\{\{([^\}]+)\}\}/g;

    if (!js) {
        node = uuid(id);
        if (node) {
            if (node.src) { // <script type="text/html" src="...">
                xhr = uurequire(node.src);
                if (xhr.ok) {
                    js = xhr.data;
                }
            } else {
                js = node.text;
            }
            if (js) {
                js = js[_replace](/\r\n|\r|\n/g, "\n")
                       [_replace](/<>\n([\s\S]*?)^<\/>$/gm, each)  // <>...</>
                       [_replace](/^\s*\n|\n$/g, "");
                uusnippet.js[id] = js;
            }
        }
        uusnippet.run[id] = 0; // activated counter
    }
    if (js) {
        arg.run = uusnippet.run[id];
        ++uusnippet.run[id];
    }
    return js ? (new Function("arg", js))(arg) : "";
}
uusnippet.js = {};  // { id: JavaScriptExpression, ... }
uusnippet.run = {}; // { id: activated counter, ... }
uusnippet.each = function(hash, fragment) { // (
    var i = 0, iz = hash.key.length, // get each length from "key"
        block = [], eachBrace = /\{\(([^\)]+)\)\}/g,
        lastValue = {};

    for (; i < iz; ++i) {
        block.push(fragment[_replace](eachBrace, function(_, ident) {
            if (ident === "i") { // {{i}} is loop count
                return i;
            }
            var rv = isArray(hash[ident]) ? hash[ident][i]
                                          : hash[ident],
                undef;

            return rv === undef ? lastValue[ident]
                                : (lastValue[ident] = rv);
        }));
    }
    return block.join("");
};
//}@snippet

// --- AJAX ---
// uu.ajax
//{@ajax
function uuajax(url,        // @param String: url
                option,     // @param Hash: { data, ifmod, method, timeout,
                            //                header, binary, before, after }
                            //    option.data    - Mix: upload data
                            //    option.ifmod   - Boolean: true is "If-Modified-Since" header
                            //    option.method  - String: "GET", "POST", "PUT"
                            //    option.timeout - Number(= 10): timeout sec
                            //    option.header  - Hash(= {}): { key: "value", ... }
                            //    option.binary  - Function: binary data evaluator, binary(xhr)
                            //    option.before  - Function: before(xhr, option)
                            //    option.after   - Function: after(xhr, option, { ok, status })
                callback) { // @param Function: callback(data, option, { ok, status })
                            //    data   - String: xhr.responseText
                            //    option - Hash:
                            //    status - Number: xhr.status
                            //    ok     - Boolean:
    function readyStateChange() {
        if (xhr.readyState === 4) {
            var data, status = xhr.status, lastMod,
                rv = { status: status,
                       ok: !status || (status >= 200 && status < 300) };

            if (!run++) {
                if (rv.ok) {
                    data = binary ? binary(xhr) : (xhr.responseText || "");
                    // --- "Last-Modified" ---
                    if (ifmod) {
                        lastMod = xhr.getResponseHeader("Last-Modified");
                        if (lastMod) {
                            cache[url] = uudate(Date.parse(lastMod)).GMT(); // add cache
                        }
                    }
                }
                option[_after] && option[_after](xhr, option, rv);
                callback(data, option, rv);
                gc();
            }
        }
    }

    function ng(abort, status) {
        if (!run++) {
            var rv = { status: status || 400, ok: _false };

            option[_after] && option[_after](xhr, option, rv);
            callback(null, option, rv);
            gc(abort);
        }
    }

    function gc(abort) {
        abort && xhr && xhr.abort && xhr.abort();
        watchdog && (clearTimeout(watchdog), watchdog = 0);
        xhr = null;
//{@mb
        uueventdetach(win, "beforeunload", ng); // [Gecko]
//}@mb
    }

    var watchdog = 0,
        method = option.method || "GET",
        header = option.header || {},
        binary = option.binary,
        ifmod = option.ifmod,
        cache = uuajax.cache,
        data = option.data || null,
        xhr = newXHR(url),
        run = 0, i,
        overrideMimeType = "overrideMimeType",
        setRequestHeader = "setRequestHeader",
        getbinary = method === "GET" && binary;

    try {
        xhr.onreadystatechange = readyStateChange;
        xhr.open(method, url, _true); // ASync

        option[_before] && option[_before](xhr, option);

        getbinary && xhr[overrideMimeType] &&
            xhr[overrideMimeType]("text/plain; charset=x-user-defined");
        // Content-Type:       "application/x-www-form-urlencoded"
        data &&
            xhr[setRequestHeader]("Content-Type",
                                  "application/x-www-form-urlencoded");
        // If-Modified-Since:  "Wed, 16 Sep 2009 16:18:14 GMT"
        ifmod && cache[url] &&
            xhr[setRequestHeader]("If-Modified-Since", cache[url]);

        for (i in header) {
            xhr[setRequestHeader](i, header[i]);
        }
//{@mb
        uueventattach(win, "beforeunload", ng); // [Gecko]
//}@mb
        xhr.send(data);
        watchdog = setTimeout(function() {
            ng(1, 408); // 408: Request Time-out
        }, (option.timeout || 10) * 1000);
    } catch (err) {
        ng(); // 400: Bad Request
    }
}
uuajax.cache = {}; // { "url": DateHash(lastModified), ... }

// uu.ajax.post - post
function uuajaxpost(url,        // @param String: url
                    option,     // @param Hash: { data, ifmod, timeout,
                                //                header, binary, before, after }
                    callback) { // @param Function: callback(data, option, { status, ok })
    uuajax(url, uuarg(option, { method: "POST" }), callback);
}

// uu.ajax.clear - clear "If-Modified-Since" request cache
function uuajaxclear() {
    uuajax.cache = {};
}

// uu.ajax.binary - upload / download binary data
function uuajaxbinary(url, option, callback) {
    option.method = option.data ? "PUT" : "GET";
    option.binary = /*{@mb*/ _ie ? xhr2baryIE : /*}@mb*/
                                   xhr2bary;

    uuajax(url, option, callback);
}

// inner - XHR To ByteArray
function xhr2bary(xhr) { // @param XMLHttpRequest:
                         // @return ByteArray: [0x00, 0x01]
    var rv = [], bb2num = _bb2num, remain,
        ary = xhr.responseText.split(""), // "\00\01"
        i = -1, iz;

    iz = ary.length;
    remain = iz % 8;

    while (remain--) {
        ++i;
        rv[i] = bb2num[ary[i]];
    }
    remain = iz >> 3;
    while (remain--) {
        rv.push(bb2num[ary[++i]], bb2num[ary[++i]],
                bb2num[ary[++i]], bb2num[ary[++i]],
                bb2num[ary[++i]], bb2num[ary[++i]],
                bb2num[ary[++i]], bb2num[ary[++i]]);
    }
    return rv;
}

//{@mb
// inner - XHR to ByteArray
function xhr2baryIE(xhr) { // @param XMLHttpRequest:
                           // @return ByteArray: [0x00, 0x01]
    var rv = [], data, remain,
        charCodeAt = "charCodeAt", _0xff = 0xff,
        loop, v0, v1, v2, v3, v4, v5, v6, v7,
        i = -1, iz;

    iz = vblen(xhr);
    data = vbstr(xhr);
    loop = Math.ceil(iz / 2);
    remain = loop % 8;

    while (remain--) {
        v0 = data[charCodeAt](++i); // 0x00,0x01 -> 0x0100
        rv.push(v0 & _0xff, v0 >> 8);
    }
    remain = loop >> 3;
    while (remain--) {
        v0 = data[charCodeAt](++i);
        v1 = data[charCodeAt](++i);
        v2 = data[charCodeAt](++i);
        v3 = data[charCodeAt](++i);
        v4 = data[charCodeAt](++i);
        v5 = data[charCodeAt](++i);
        v6 = data[charCodeAt](++i);
        v7 = data[charCodeAt](++i);
        rv.push(v0 & _0xff, v0 >> 8, v1 & _0xff, v1 >> 8,
                v2 & _0xff, v2 >> 8, v3 & _0xff, v3 >> 8,
                v4 & _0xff, v4 >> 8, v5 & _0xff, v5 >> 8,
                v6 & _0xff, v6 >> 8, v7 & _0xff, v7 >> 8);
    }
    iz % 2 && rv.pop();

    return rv;
}
_ie && document.write('<script type="text/vbscript">\
Function vblen(b)vblen=LenB(b.responseBody)End Function\n\
Function vbstr(b)vbstr=CStr(b.responseBody)+chr(0)End Function</'+'script>');
//}@mb
//}@ajax

// inner - create XMLHttpRequest object
function newXHR(url) { // @param String: url
                       // @return XMLHttpRequest:
//{@mb
    if (_ie678) {
        var obj = win["ActiveXObject"];

        if (obj) {
            // http:// or https:// -> "Msxml2.XMLHTTP"
            // file://             -> "Microsoft.XMLHTTP"
            return new obj(!url[_indexOf]("file:") ? "Microsoft.XMLHTTP"
                                                   : "Msxml2.XMLHTTP");
        }
    }
//}@mb
    return new XMLHttpRequest;
}

// uujs - Async load JavasScript
function uujs(url) { // @param String:
                         // @return Node:
    var rv = doc.head[_appendChild](uumix(newNode("script"), uujs.attr));

    rv.src = url;
    return rv;
}
uujs.attr = { type: "text/javascript", charset: "utf-8", run: 0 };

// uu.stat - Sync file stat
function uustat(url) { // @param String: url
                       // @return Boolean: true is file exists
    return uurequire(url, { stat: _true }).ok;
}

// uu.require - Sync load
function uurequire(url,      // @param String: url
                   option) { // @param Hash(= {}): { stat, before, after }
                             //     option.stat   - Boolean: check whether a file exists
                             //     option.before - Function: before(xhr, option)
                             //     option.after  - Function: after(xhr, option, { status, ok })
                             // @return Hash: { data, option, status, ok }
    option = option || {};

    var rv = { ok: _false, status: 400 },
        xhr = newXHR(url), data, status;

    try {
        xhr.open("GET", url, _false); // open(,,false) is sync request
        option[_before] && option[_before](xhr, option);
        xhr.send(null);

        rv.status = status = xhr.status;
        rv.ok = !status || (status >= 200 && status < 300);
        if (!option.stat) {
            data = xhr.responseText;
        }

        option[_after] && option[_after](xhr, option, rv);

        xhr = null;
    } catch (err) {
    }
    rv.data = data;
    rv.option = option;
    return rv;
}

//{@ajax
// uu.jsonp - Async JSONP request
function uujsonp(url,        // @param String: "http://example.com?callback=@"
                 option,     // @param Hash: { timeout, method }
                             //     timeout - Number(= 10):
                             //     method  - String(= "callback")
                 callback) { // @param Function: callback(data, option, { ok, status })
                             //     data    - JSONObject:
                             //     option  - Hash:
                             //     status  - Number: 200 or 408
                             //     ok      - Boolean:
    var timeout = option.timeout || 10,
        method = option.method || "callback",
        guid = uunumber(),
        node = uumix(newNode("script"), uujs.attr);

    url = uuf(url, method);
    uujsonp.db[guid] = method;

    // build callback global function
    win[method] = function(data, rv) { // @param Mix: json data
        if (!node.run++) {
            rv = { ok: !!data, status: data ? 200 : 408 };

            option[_after] && option[_after](node, option, rv);
            callback(data, option, rv);

            setTimeout(function() {
                uunoderemove(node);
                win[method] = null;
                delete uujsonp.db[guid];
            }, (timeout + 10) * 1000);
        }
    };

    uunodeadd(node, doc.head);

    option[_before] && option[_before](node, option);

    node.src = url;

    setTimeout(function(fn) {
        isFunction(fn = uujsonp.db[guid]) && fn(); // 408 "Request Time-out"
    }, timeout * 1000);
}
uujsonp.db = {}; // { guid: callbackMethod, ... }
//}@ajax

// --- TYPE ---

// uu.like - like and deep matching
function uulike(lval,   // @param Date/Hash/Fake/Array: lval
                rval) { // @param Date/Hash/Fake/Array: rval
                        // @return Boolean:
    //  [1][literal like literal]    uu.like("abcdef", "abcdef")              -> true
    //  [2][Date like Date]          uu.like(new Date(123), new Date(123))    -> true
    //  [3][Hash like Hash]          uu.like({ a: { b: 1 }}, { a: { b: 1 }})  -> true
    //  [4][Array like Array]        uu.like([1, [2, 3]], [1, [2, 3]])        -> true
    //  [5][FakeArray like FakeArray] uu.like(document.links, document.links) -> true

    var type = uutype(lval);

    if (type !== uutype(rval)) {
        return _false;
    }
    switch (type) {
    case uutype.FUNCTION:   return _false;
    case uutype.DATE:       return uudate(lval).ISO() === uudate(rval).ISO();
    case uutype.HASH:       return (uusize(lval) === uusize(rval) && uuhas(lval, rval));
    case uutype.FAKEARRAY:  // http://d.hatena.ne.jp/uupaa/20091223
    case uutype.ARRAY:      return uuarray(lval) + "" == uuarray(rval);
    }
    return lval === rval;
}

// uu.type - type detection
function uutype(mix) { // @param Mix: search literal/object
                       // @return Number: uu.types
    //  [1][typeof] uu.type("str")          -> uu.type.STRING
    //  [2][typeof] uu.type(Node)           -> uu.type.NODE
    //  [3][typeof] uu.type(document.links) -> uu.type.FAKEARRAY

    if (mix == null) {
        return mix === null ? uutype.NULL : uutype.UNDEFINED;
    }
    if (mix === win) {
        return uutype.HASH;
    }
    if (mix[_nodeType] && mix[_appendChild]) {
        return uutype.NODE;
    }
    return _types[typeof mix] ||
           _types[toString.call(mix)] ||
           ((mix.callee || mix.item) ? uutype.FAKEARRAY : uutype.HASH);
}

// uu.complex - complex type detection
function uucomplex(key,     // @param String/Hash(= void):
                   value) { // @param String/Number(= void): 1 ~ 4
    //  [1][get items]  uu.complex() -> 1
    //  [2][get item]   uu.complex(key) -> 2
    //  [3][set item]   uu.complex(key, value) -> 3
    //  [4][set items]  uu.complex({ key: value, ... }) -> 4

    return key === void 0 ? 1
                          : value !== void 0 ? 3
                                             : typeof key === _string ? 2 : 4;
}

// uu.isNumber - is number
function isNumber(search) { // @param Mix: search
                            // @return Boolean:
    return typeof search === _number;
}

// uu.isString - is string
function isString(search) { // @param Mix: search
                            // @return Boolean:
    return typeof search === _string;
}

// uu.isFunction - is function
function isFunction(search) { // @param Mix: search
                              // @return Boolean:
    return toString.call(search) === "[object Function]";
}

// uu.ifFunction - get literal value or call function
function ifFunction(value,      // @param Mix/Function:
                    var_args) { // @param Arguments(= void): function arguments as [arg, ...]
                                // @return Mix:
    return isFunction(value) ? (var_args ? value.apply(this, var_args)
                                         : value())
                             : value;
}

// --- hash / array ---

// uu.arg - supply default arguments
function uuarg(arg1,   // @param Hash/Function(= {}): arg1
               arg2,   // @param Hash: arg2
               arg3) { // @param Hash(= void): arg3
                       // @return Hash/Function: new Hash(mixed args) or arg1 + args
    //  [1][supply args]   uu.arg({ a: 1 }, { b: 2 })          -> { a: 1, b: 2 }
    //  [2][LookDown args] uu.arg(function hoge(){}, { b: 2 }) -> hoge.b = 2

    return isFunction(arg1) ? uumix(arg1, arg2, arg3)
                            : uumix(uumix({}, arg1 || {}), arg2, arg3, 0);
}

// uu.mix - mixin
function uumix(base,       // @param Hash/Function: mixin base
               flavor,     // @param Hash: add flavor
               aroma,      // @param Hash(= void): add aroma
               override) { // @param Boolean(= true): true is override
                           // @return Hash/Function: base
    //  [1][override value] uu.mix({a:9, b:9}, {a:1}, {b:2})    -> { a: 1, b: 2 }
    //  [2][stable value]   uu.mix({a:9, b:9}, {a:1}, {b:2}, 0) -> { a: 9, b: 9 }

    var i;

    if (override || override === i) { // override === void 0 // [1][3]
        for (i in flavor) {
            base[i] = flavor[i];
        }
    } else { // [2]
        for (i in flavor) {
            i in base || (base[i] = flavor[i]);
        }
    }
    return aroma ? uumix(base, aroma, 0, override) : base;
}

// uu.each - for each
function uueach(source,    // @param Hash/Array/Number: source or loop count
                evaluator, // @param Function: evaluator
                arg) {     // @param Mix(= void):
    //  [1][Array.forEach]  uu.each([1, 2],         function(v, i) {...})
    //  [2][Hash.forEach ]  uu.each({ a: 1, b: 2 }, function(v, i) {...})
    //  [3][Number.forEach] uu.each(3,              function(v, i) {...})

    function each(v, i) {
        evaluator(v, i, arg);
    }

    var i = 0;

    if (typeof source === _number) {
        for (; i < source; ++i) {
            evaluator(i, i, arg); // evaluator(index, index, arg)
        }
    } else if (isArray(source)) {
        source.forEach(arg ? each : evaluator);
    } else {
        for (i in source) {
            evaluator(source[i], i, arg); // evaluator(value, index, arg)
        }
    }
}

// uu.keys - enum keys
function uukeys(source,           // @param Hash/Array: source
                __enumValues__) { // @hidden Number(= 0): 1 is enum values
                                  // @return Array: [key, ... ]
    //  [1][Hash.keys]   uu.keys({ a: 1, b: 2 }) -> ["a", "b"]
    //  [2][Array.keys]  uu.keys([1, 2]) -> [0, 1]

    var rv = [], ri = -1, i, iz, keys = Object.keys;

    if (isArray(source)) {
        for (i = 0, iz = source.length; i < iz; ++i) {
            i in source && (rv[++ri] = __enumValues__ ? source[i] : i);
        }
    } else {
        if (!__enumValues__ && keys) {
            return keys(source);
        }
        for (i in source) {
            source[_hasOwnProperty](i) &&
                (rv[++ri] = __enumValues__ ? source[i] : i);
        }
    }
    return rv;
}

// uu.values - enum values
function uuvalues(source) { // @param Hash/Array: source
                            // @return Array: [value, ... ]
    // [1][Hash.values]   uu.keys({ a: 1, b: 2 }) -> [1, 2]
    // [2][Array.values]  uu.keys([1, 2]) -> [1, 2]

    return uukeys(source, 1);
}

// uu.hash - to hash
function uuhash(source,     // @param JointString: "a,1,b,2"
                splitter) { // @param String/RegExp(= /[,;:]/): splitter
                            // @return Hash: { a: "1", b: "2" }

    //  [1][String to Hash] uu.hash("a,1,b,2") -> { a: "1", b: "2" }
    //  [2][String to Hash] uu.hash("a:1,b:2") -> { a: "1", b: "2" }
    //  [3][String to Hash] uu.hash("a:1;b:2") -> { a: "1", b: "2" }

    var rv = {}, ary = source.split(splitter || uuhash._), i = 0, iz = ary.length;

    for (; i < iz; i += 2) {
        rv[ary[i]] = ary[i + 1];
    }
    return rv;
}
uuhash._ = /[,;:]/; // default splitter

// uu.array - to array + slice
function uuarray(source,     // @param Array/Mix/NodeList/Arguments: source
                 sliceStart, // @param Number(= void): Array.slice(start, end)
                 sliceEnd) { // @param Number(= void): Array.slice(start, end)
                             // @return Array+Hash: [element, ...] + { first, last }
                             //     first - Mix: first element
                             //     last  - Mix: last elemen
    //  [1][through Array]      uu.array([1, 2])    -> [1, 2]      + { first, last }
    //  [2][mix to Array]       uu.array(mix)       -> [mix]       + { first, last }
    //  [3][NodeList to Array]  uu.array(NodeList)  -> [node, ...] + { first, last }
    //  [4][arguments to Array] uu.array(arguments) -> [arg, ...]  + { first, last }
    //  [5][to Array + slice]   uu.array(uu.tag("", document), 1, 3) -> [<head>, <meta>] + { first, last }

    var type = uutype(source),
        rv = (type === uutype.FAKEARRAY) ? fakeToArray(source) // [3][4]
           : (type === uutype.ARRAY)     ? source : [source];  // [1][2]

    if (sliceStart) {
        rv = sliceEnd ? rv.slice(sliceStart, sliceEnd)
                      : rv.slice(sliceStart);
    }
    rv.first = rv[0];
    rv.last  = rv[rv.length - 1];
    return rv;
}

// uu.has
function uuhas(source,   // @param Hash/Array/Node: context, parentNode
               search) { // @param Hash/Array/Node/String: search element, childNode
                         // @return Boolean:
    //  [1][Array has Array] uuhas([1, 2], [1]) -> true
    //  [2][Hash has Hash]   uuhas({ a: 1, b: 2 }, { a: 1 }) -> true
    //  [3][Node has Event]  uuhas(node, "namespace.click") -> true
    //  [4][Node has Node]   uuhas(parentNode, childNode) -> true
    //  [5][Array has Mix]   uuhas([1, 2], 1) -> true
    //  [6][Array has Mix]   uuhas([1, "a"], "a") -> true

    if (source && search) {
        var i = 0, iz;

        if (source[_nodeType]) {
            if (isString(search)) { // [3]
                i = source[nodeData + "event"];
                return (i ? i.t : "")[_indexOf]("," + search + ",") >= 0;
            }
            for (i = search; i && i !== source; i = i[_parentNode]) { // [4]
            }
            return search !== source && i === source;
        }

        if (isArray(source)) { // [1]
            search = uuarray(search);

            for (iz = search.length; i < iz; ++i) {
                if (i in search && source[_indexOf](search[i]) < 0) {
                    return _false;
                }
            }
        } else { // [2]
            for (i in search) {
                if (!(i in source)
                    || (source[i] !== search[i]
                        && uujsonencode(source[i]) !== uujsonencode(search[i]))) {
                    return _false;
                }
            }
        }
        return _true;
    }
    return _false;
}

// uu.nth - get nth pair
function uunth(source,  // @param Hash/Array: source, Array is DenceArray
               index) { // @param Number(= 0): 0 is first, -1 is last pair
                        // @return Array: [key, value]
                        //                or [undefined, undefined] (not found)
    //  [1][Hash nth ]   uunth({ a: 1, b: 2 }, 1)    -> ["b", 2]
    //  [2][Array nth]   uunth(["a", 100, true], 1)  -> [1, 100]
    //  [3][Array first] uunth(["a", 100, true])     -> [0, "a"]
    //  [4][Array last]  uunth(["a", 100, true], -1) -> [2, true]

    index = index || 0;
    var ary, key, i = 0;

    if (isArray(source)) {
        i = index < 0 ? index + source.length : index;
        return [i, source[i]];
    }
    if (index > 0) {
        for (key in source) {
            if (i++ === index) {
                return [key, source[key]];
            }
        }
        return [void 0, void 0];
    }
    ary = uukeys(source);
    key = ary[index < 0 ? index + ary.length : index];
    return [key, source[key]];
}

// uu.pair - make pair
function uupair(key,     // @param Number/String/Hash: key
                value) { // @param Mix: value
                         // @return Hash: { key: value }
    //  [1][make pair]     uu.pair(1, 2)        -> { 1: 2 }
    //  [2][through hash]  uu.pair({ 1: 2 }, 3) -> { 1: 2 }

    if (typeof key !== "object") {
        var rv = {};

        rv[key] = value;
        return rv;
    }
    return key; // Hash or Hash Like Object
}

// inner - get length
function uusize(source) { // @param Hash/Array: source
                          // @return Number:
    // [1][Hash.length]   uusize({ a: 1, b: 2 }) -> 2
    // [2][Array.length]  uusize([1,2]) -> [1,2]

    return (isArray(source) ? source : uukeys(source)).length;
}

// uu.calls - call functions
function uucalls(functionArray, // @param FunctionArray:
                 args,          // @param Arguments/MixArray(= void): [arg, ...]
                 that) {        // @param this(= void):
    var rv = [], i = 0, iz = functionArray.length;

    for (; i < iz; ++i) {
        rv.push(functionArray[i].apply(that || null, args || []));
    }
    return rv;
}

// uu.clone - clone hash, clone array - shallow copy
function uuclone(source) { // @param Hash/Array: source
                           // @return Hash/Array: cloned hash/array
    // [1][Hash.clone]   uuclone({ a: 1, b: 2 }) -> { a: 1, b: 2 }
    // [2][Array.clone]  uuclone([1,2]) -> [1,2]

    return isArray(source) ? source[_concat]() : uumix({}, source);
}

// uu.indexOf - find first key from value
function uuindexof(source,        // @param Hash/Array: source
                   searchValue) { // @param Mix: search value
                                  // @return Number/String/void: "found-key" or undefined
    // [1][Hash.indexOf]   uu.indexOf({ a: 1, b: 2, c: 2 }, 2) -> "b"
    // [2][Array.indexOf]  uu.indexOf(["A", "Z", "a"], "Z") -> 1

    if (isArray(source)) {
        return source[_indexOf](searchValue);
    }
    for (var key in source) {
        if (source[key] === searchValue && source[_hasOwnProperty](key)) {
            return key; // String
        }
    }
//{@mb
    return void 0;
//}@mb
}

// inner - sort array
function uuarraysort(source,   // @param Array: source
                     method) { // @param String/Function(= "A-Z"): method
                               //                   sort method or callback-function
                               // @return Array: source
    //  [1][ascii sort a-z]    uu.array.sort(["a","z"], "A-Z") -> ["a", "z"]
    //  [2][ascii sort a-z]    uu.array.sort(["a","z"], "Z-A") -> ["z", "a"]
    //  [3][numeric sort 0-9]  uu.array.sort([0,1,2], "0-9")   -> [0, 1, 2]
    //  [4][numeric sort 9-0]  uu.array.sort([0,1,2], "9-0")   -> [2, 1, 0]

    // 0x1: numeric sort, 0x2: reverse
    var r = { "A-Z": 0, "Z-A": 2, "0-9": 1, "9-0": 3 }[method] || 0;

    (r & 1) ? source.sort(function(a, b) {
                            return a - b;
                          })
            : source.sort();
    return (r & 2) ? source.reverse() : source;
}

// inner - array compaction, trim null and undefined elements
function uuarrayclean(source) { // @param Array: source
                                // @return Array: clean Array
    //  [1][Array.clean]         uuarrayclean([,,1,2,,]) -> [1,2]

    var rv = [], i = 0, iz = source.length;

    for (; i < iz; ++i) {
        i in source && source[i] != null // skip null or undefined
                    && rv.push(source[i]);
    }
    return rv;
}

// uu.array.dump - dump ByteArray
function uuarraydump(source,     // @param ByteArray: [0x00, ... 0xff]
                     prefix,     // @param String(= ""):
                     splitter) { // @param String(= ""):
                                 // @return String: "00010203"
    //  [1][ByteArray dump] uu.array.dump([1, 2, 3]) -> "010203"
    //  [2][ByteArray dump] uu.array.dump([1, 2, 3], "0x", ", 0x") -> "0x01, 0x02, 0x03"

    var rv = [], i = 0, iz = source.length, num2hh = _num2hh;

    for (; i < iz; ++i) {
        rv[i] = num2hh[source[i]];
    }
    return iz ? (prefix || "") + rv.join(splitter || "") : "";
}

// uu.array.toHash - make { key: value } pair from array
function uuarraytohash(key,        // @param Array: key array
                       value,      // @param Array/Mix: value array or a mix value
                       toNumber) { // @param Boolean(= false): true is numeric value
                                   //                          false is original value
                                   // @return Hash: { key: value, ... }
    //  [1][Array x 2 = Hash]    uu.array.toHash(["a", "b"], [1, 2]) -> { a: 1, b: 2 }
    //  [2][Array + Mix = Hash]  uu.array.toHash(["a", "b"], 1)      -> { a: 1, b: 1 }

    var rv = {}, i = 0, iz = key.length, val, num = !!toNumber;

    if (isArray(value)) { // [1]
        for (; i < iz; ++i) {
            rv[key[i]] = num ? +(value[i]) : value[i];
        }
    } else { // [2]
        val = num ? +(value) : value;
        for (; i < iz; ++i) {
            rv[key[i]] = val;
        }
    }
    return rv;
}

// inner - make array from unique element(trim null and undefined elements)
function uuarrayunique(source,        // @param Array: source
                       literalOnly) { // @param Boolean(= false): true is literal only(quickly)
                                      // @return Array:
    //  [1][unique elements]  uu.array.unique([<body>, <body>]) -> [<body>]
    //  [2][unique literals]  uu.array.unique([0,1,2,1,0], true) -> [0,1,2]

    var rv = [], ri = -1, v, i = 0, j, iz = source.length,
        literal = !!literalOnly, found, unique = {};

    for (; i < iz; ++i) {
        v = source[i];
        if (v != null) { // v === null or v === undefined
            if (literal) { // [2]
                unique[v] || (unique[v] = 1, rv[++ri] = v);
            } else { // [1]
                for (found = 0, j = i - 1; !found && j >= 0; --j) {
                    found = (v === source[j]);
                }
                found || (rv[++ri] = v);
            }
        }
    }
    return rv;
}

// --- ATTRIBUTE ---

// uu.attr - attribute accessor
function uuattr(node,    // @param Node:
                key,     // @param String/Hash(= void): key
                value) { // @param String(= void): "value"
                         // @return String/Hash/Node:
    //  [1][get items]  uu.attr(node) -> { key: "value", ... }
    //  [2][mix items]  uu.attr(node, { key: "value", ... }) -> node
    //  [3][get item]   uu.attr(node, key) -> "value"
    //  [4][set item]   uu.attr(node, key, "value") -> node

    var rv = {}, ary, i = 0, attr, fix = uuattr._;

    // [IE6][IE7] for     -> htmlFor   class     -> className
    // [WEB STD]  htmlFor -> for       className -> class
    switch (uucomplex(key, value)) { // 1: (), 2: (k), 3: (k,v), 4: ({})
    case 1:
/*{@mb*/    if (!uuready[_getAttribute]) { // [IE6][IE7][IE8]
                for (ary = node.attributes; attr = ary[i++]; ) {
                    if (attr.specified && attr.name[_indexOf](nodeData)) {
                        rv[attr.name] = attr.value;
                    }
                }
            } else { /*}@mb */
                for (ary = node.attributes; attr = ary[i++]; ) {
                    rv[attr.name] = attr.value;
                }
/*{@mb*/    } /*}@mb*/
            return rv;
    case 2: // [IE6] tagindex, colspan is number
            return (node[_getAttribute](fix[key] || key, 2) || "") + "";
    case 3: node[_setAttribute](fix[key] || key, value);
            break;
    case 4: for (attr in key) {
                node[_setAttribute](fix[attr] || attr, key[attr]);
            }
    }
    return node;
}
// [SVG] w=width,h=height, [DOM] cn=class
uuattr._ = uuhash(
//{@mb
    !uuready[_getAttribute] ? "for,htmlFor,class,className,cn,className" : // [IE6][IE7]
//}@mb
    _className + ",class,cn,class,htmlFor,for,w,width,h,height"
);

// uu.data - node data accessor [HTML5 spec - Embedding custom non-visible data]
function uudata(node,    // @param Node:
                key,     // @param String/Hash(= void): key
                value) { // @param Mix(= void): value
                         // @return Hash/Mix/Node/undefined:
    //  [1][get items]  uu.data(node) -> { key: value, ... }
    //  [2][mix items]  uu.data(node, { key: value, ... }) -> node
    //  [3][get item]   uu.data(node, key) -> value
    //  [4][set item]   uu.data(node, key, value) -> node

    var rv = {}, i, prefix = "data-";

    switch (uucomplex(key, value)) { // 1: (), 2: (k), 3: (k,v), 4: ({})
    case 1: for (key in node) {
                key[_indexOf](prefix) || (rv[key.slice(5)] = node[key]); // "data-*" -> "*"
            }
            return rv;
    case 2: return node[prefix + key]; // Mix or undefined
    case 3: if (key === "*") {
                for (key in uudata(node)) {
                    node[prefix + key] = value;
                }
            } else {
                node[prefix + key] = value;
            }
            break;
    case 4: for (i in key) {
                node[prefix + i] = key[i];
            }
    }
    return node;
}
uudata.handler = {}; // { "data-uu***": callback }

// uu.data.clear - clear/remove node data
function uudataclear(node,  // @param Node:
                     key) { // @param String(= void): key
                            // @return Node:
    //  [1][clear items]  uu.data.clear(node) -> node
    //  [2][clear item]   uu.data.clear(node, key) -> node

    return uudata(node, key || "*", null);
}

// uu.data.bind - bind data handler
//function uudatabind(key,        // @param String: "data-uu..."
//                    callback) { // @param Function: callback function
//    uudata.handler[key] = callback;
//}

// uu.data.unbind - unbind data handler
//function undataunbind(key) { // @param String: "data-uu..."
//    delete uudata.handler[key];
//}

// --- CSS ---

// uu.css - css and StyleSheet accessor
function uucss(node,    // @param Node:
               key,     // @param String/Hash(= void): key
               value) { // @param String(= void): value
                        // @return Hash/String/Node:
    //  [1][get computed items]              uu.css(node) -> { key: value, ... }
    //  [2][mix items]                       uu.css(node, { key: value, ... }) -> node
    //  [3][get item]                        uu.css(node, key)  -> value
    //  [4][set item]                        uu.css(node, key, value) -> node
    //  [5][get computed(px unitized) items] uu.css(node, "px") -> { key: value, ... }

    var style = node.style, undef, opacity = "opacity", fix = uufix._,
        fuzzy, // either "text-align" or "textAlign"
        right; // right "textAlign" style

    switch (uucomplex(key, value)) { // 1: (), 2: (k), 3: (k,v), 4: ({})
    case 1:                                         // uu.css(node)
    case 2: if (key === undef || key === "px") {    // uu.css(node, "px")
/*{@mb*/        if (getComputedStyle) { /*}@mb*/
                    return getComputedStyle(node, 0);
/*{@mb*/        }
                return key ? getComputedStyleIE(node) : node.currentStyle; /*}@mb*/
            }
            right = fix[key] || key;
/*{@mb*/    if (getComputedStyle) { /*}@mb*/
                return getComputedStyle(node, 0)[right] || "";
//{@mb
            }
            if (right === opacity) { // [IE6][IE7][IE8]
                return style[opacity] || uucssopacity(node);
            }
            return (node.currentStyle || {})[right] || "";
//}@mb
    case 3: key = uupair(key, value);
    case 4: for (fuzzy in key) {
                value = key[fuzzy];
                right = fix[fuzzy] || fuzzy;

                if (right === opacity) {
                    uucssopacity(node, +value);
                } else {
                    if (typeof value === _number) {
                        uucss.care[right] || (value += "px"); // number -> pixel value
                    }
                    style[right] = value;
                }
            }
    }
    return node;
}
uucss.care = { /*{@mb*/ zoom: 1, fontSizeAdjust: 1, /*}@mb*/ // [CSS3]
               lineHeight: 1, fontWeight: 1, zIndex: 1 };

// --- Style Sheet ---
function uuss(id) { // @param StyleSheetIDString(= ""):
                    // @return StyleSheetObject:
    id = id || "";
    return uuss.db[id] || (uuss.db[id] = uu("StyleSheet", id));
}
uuss.db = {}; // { id: styleSheetObject }

// --- Viewport ---
// uu.viewport
function uuviewport() { // @return Hash: { innerWidth, innerHeight,
                        //                 pageXOffset, pageYOffset,
                        //                 orientation, devicePixelRatio }
                        //      innerWidth  - Number:
                        //      innerHeight - Number:
                        //      pageXOffset - Number:
                        //      pageYOffset - Number:
                        //      orientation - Number: last orientation
                        //      devicePixelRatio - Number: 2 is iPhone4 Retina dispiay
                        //            0 is Portrait
                        //          -90 is Landscape
                        //           90 is Landscape
                        //          180 is Portrait
//{@mb
    var undef,
        orientation = "orientation",
        devicePixelRatio = "devicePixelRatio";

    if (!win.innerWidth) { // [IE6][IE7][IE8] CSSOM View Module
        return { innerWidth:  root.clientWidth,    // [IE9] supported
                 innerHeight: root.clientHeight,   // [IE9] supported
                 pageXOffset: root.scrollLeft,     // [IE9] supported
                 pageYOffset: root.scrollTop,      // [IE9] supported
                 orientation: 0,                   // [IPHONE] only
                 devicePixelRatio: 1 };            // [IPHONE] only
    }
    win[orientation] === undef && (win[orientation] = 0);
    win[devicePixelRatio] === undef && (win[devicePixelRatio] = 1);
//}@mb
    return win;
}

// --- TIMER ---
// uu.interval - interval timer
function uuinterval(callback, // @param Function: callback
                    arg) {    // @param Mix(= void): arg
                              // @return Number: id
    var id = uunumber();

    uuinterval.ary.push(id, callback, arg);
    if (uuinterval.base === null) {
        uuinterval.base = setInterval(tick, _env.chrome ? 4 : 12);
    }
    return id;
}
uuinterval.ary = [];    // [<id, callback, arg>, ...]
uuinterval.base = null; // base interval timer id

// inner - tick interval timer
function tick() {
    var ary = uuinterval.ary, i = 0, iz = ary.length;

    for (; i < iz; i += 3) {
        // callback(timer.id, arg) -> false is loopout
        if (ary[i + 1](ary[i], ary[i + 2]) === _false) {
            ary.splice(i, 3);
            i  -= 3;
            iz -= 3;
        }
    }
}

// --- EFFECT / ANIMATION ---

// uu.fx - add effect queue
//{@fx
function uufx(node,     // @param Node: animation target node
              duration, // @param Number: duration (unit ms)
              option) { // @param Hash/Function: { key: endValue, key: [endValue, easing], key: callback, ... }
                        //     key      - CSSPropertyString/String: "color", "opacity", "before", "after", ...
                        //     endValue - String/Number: end value, "red", "+0.5", "+100px"
                        //     easing   - String: easing function name, "InOutQuad"
                        //     callback - Function: before or after callback function
                        // @return Node:
    //  [1][abs]              uu.fx(node, 500, { o: 0.5, x: 200 })
    //  [2][rel]              uu.fx(node, 500, { h: "+100", o: "+0.5" })
    //  [3][with "px" unit]   uu.fx(node, 500, { h: "-100px" })
    //  [4][with easing fn]   uu.fx(node, 500, { h: [200, "InOutQuad"] })
    //  [5][after callback]   uu.fx(node, 500, { o: 1, after: afterCallback })
    //  [6][before callback]  uu.fx(node, 500, { o: 1, before: beforeCallback })
    //  [7][chain]            uu.fx(node, 500, { o: 1, chain: 1 })
    //  [8][reverse chain]    uu.fx(node, 500, { o: 1, reverse: 1 })
    //  [9][delay or sleep]   uu.fx(node, 500, callback)
    //  [10][deny]            uu.fx(node, 500, { deny: 1 })

    // --- INTERNAL DATA STRUCTURE ---
    //
    //  node["data-uufx"] = {
    //       q: [FxQueueDataHash, ...]  // forward queue
    //      rq: [FxQueueDataHash, ...]  // reverse queue
    //      id: 0                       // timer id
    //  }
    //
    //  FxQueueDataHash = { js, tm, dur, fin, guid, option }
    //      js     - String: JavaScript Expression
    //      tm     - Number: start time
    //      dur    - Number: duration
    //      fin    - Boolean: force finish flag
    //      guid   - Number:
    //      option - FxOptionHash:
    //
    //  FxOptionHash = { key: endValue, key: [endValue, esaing], key: callback, ... }
    //      key      - String: CSS Property or ReserveWord
    //      endValue - Number/String: 1, "+1", "-1", "1px", "*1.5", "/1.5"
    //      easing   - String: easing function name
    //      callback - Function: callback function
    //
    //  ReserveWord
    //      "before"    - Function: before callback
    //      "after"     - Function: after callback
    //      "_before"   - Function: before callback (system reserved)
    //      "_after"    - Function: after callback (system reserved)
    //      "reverse"   - Number/Boolean: reverse
    //      "chain"     - Number/Boolean: reverse chain
    //      "deny"      - Number/Boolean:
    //      "stop"      - Number/Boolean: before uu.fx.stop()
    //      "init"      - Function: init callback (system)
    //      "back"      - Number/Boolean: backward (system)
    //      "cssCache"  - Hash: cached css (system)
    //      "junction"  - Instance: uu.Class.Junction

    option = option || {};

    // init fx queue
    var meta = nodeData + "fx", // data-uufx
        data = node[meta] || (node[meta] = { q: [], rq: [], id: 0 });

    if (data.q[0] && data.q[0].option.deny) {
        return node;
    }

    // before stop
    option.stop && uufxstop(node);

    // add queue
    data.q.push({
        tm:       0,
        dur:      Math.max(duration, 1),
        fin:      _false,
        guid:     uunumber(),
        option:   option
    });
    data.id || (data.id = uuinterval(uufxloop, node));
    return node;
}

// inner - fx loop
function uufxloop(id,     // @param Number: timer id
                  node) { // @param Node:
    var data = node[nodeData + "fx"], q = data.q[0], // fetch current queue
        option = q.option, back = !!option.back, tm, finished;

    if (q.tm) { // already running?
        tm = +new Date; // running -> get current time
    } else {
        // initialize
        option.init && (option.init(node, option, back), option.init = 0);
        option["_" + _before] && option["_" + _before](node, option, back);
        option[_before] && option[_before](node, option, back);
        q.js = isFunction(option) ? option
                                  : uufxbuild(node, data, q, option);
        q.tm = tm = +new Date;
    }
    finished = q.fin || (tm >= q.tm + q.dur);

    q.js(node, finished, tm - q.tm, q.dur); // js(node, finished, gain, duration)

    if (finished) {
        option[_after] && option[_after](node, option, back);
        option["_" + _after] && option["_" + _after](node, option, back);
        option.junction && option.junction.ok();
        data.q.shift(); // remove current queue

        if (!option.back && option.reverse && data.rq.length) {
            data.q = data.rq.reverse()[_concat](data.q); // inject reverse queue
            data.rq = []; // clear
        }
        if (!data.q.length) {
            data.id = 0;
        }
    }
    return !!data.id; // return false -> clearInterval
}
uufx.props = { opacity: 1, color: 2, backgroundColor: 2,
               width: 3, height: 3, left: 4, top: 5 };

// uu.fx.easing - easing functions
uu.fx.easing = {
        linear: "(c*t/d+b)", // linear(t,b,c,d)
                             //     t:Number - current time
                             //     b:Number - beginning value
                             //     c:Number - change in value(delta)
                             //     d:Number - duration(unit: ms)
// Quad ---
        inquad: "(z1=t/d,c*z1*z1+b)",
       outquad: "(z1=t/d,-c*z1*(z1-2)+b)",
     inoutquad: "(z1=t/(d*0.5),z1<1?c*0.5*z1*z1+b:-c*0.5*((--z1)*(z1-2)-1)+b)",
// Cubic ---
       incubic: "(z1=t/d,c*z1*z1*z1+b)",
      outcubic: "(z1=t/d-1,c*(z1*z1*z1+1)+b)",
    inoutcubic: "(z1=t/(d*0.5),z1<1?c*0.5*z1*z1*z1+b:c*0.5*((z1-=2)*z1*z1+2)+b)",
    outincubic: "(z1=t*2,z2=c*0.5,t<d*0.5?(z3=z1/d-1,z2*(z3*z3*z3+1)+b)" +
                                        ":(z3=(z1-d)/d,z2*z3*z3*z3+b+z2))",
// Quart ---
       inquart: "(z1=t/d,c*z1*z1*z1*z1+b)",
      outquart: "(z1=t/d-1,-c*(z1*z1*z1*z1-1)+b)",
    inoutquart: "(z1=t/(d*0.5),z1<1?c*0.5*z1*z1*z1*z1+b" +
                                  ":-c*0.5*((z1-=2)*z1*z1*z1-2)+b)",
    outinquart: "(z1=t*2,z2=c*0.5,t<d*0.5?(z3=z1/d-1,-z2*(z3*z3*z3*z3-1)+b)" +
                                        ":(z4=z1-d,z3=z4/d,z2*z3*z3*z3*z3+b+z2))",
// Back ---
        inback: "(z1=t/d,z2=1.70158,c*z1*z1*((z2+1)*z1-z2)+b)",
       outback: "(z1=t/d-1,z2=1.70158,c*(z1*z1*((z2+1)*z1+z2)+1)+b)",
     inoutback: "(z1=t/(d*0.5),z2=1.525,z3=1.70158," +
                    "z1<1?(c*0.5*(z1*z1*(((z3*=z2)+1)*z1-z3))+b)" +
                        ":(c*0.5*((z1-=2)*z1*(((z3*=z2)+1)*z1+z3)+2)+b))",
     outinback: "(z1=t*2,z2=c*0.5," +
                    "t<d*0.5?(z3=z1/d-1,z4=1.70158,z2*(z3*z3*((z4+1)*z3+z4)+1)+b)" +
                           ":(z3=(z1-d)/d,z4=1.70158,z2*z3*z3*((z4+1)*z3-z4)+b+z2))",
// Bounce ---
      inbounce: "(z1=(d-t)/d,z2=7.5625,z3=2.75,c-(z1<(1/z3)?(c*(z2*z1*z1)+0)" +
                ":(z1<(2/z3))?(c*(z2*(z1-=(1.5/z3))*z1+.75)+0):z1<(2.5/z3)" +
                "?(c*(z2*(z1-=(2.25/z3))*z1+.9375)+0)" +
                ":(c*(z2*(z1-=(2.625/z3))*z1+.984375)+0))+b)",
     outbounce: "(z1=    t/d,z2=7.5625,z3=2.75,   z1<(1/z3)?(c*(z2*z1*z1)+b)" +
                ":(z1<(2/z3))?(c*(z2*(z1-=(1.5/z3))*z1+.75)+b):z1<(2.5/z3)" +
                "?(c*(z2*(z1-=(2.25/z3))*z1+.9375)+b)" +
                ":(c*(z2*(z1-=(2.625/z3))*z1+.984375)+b))"
};

uu.fx.timing =  {
    // uu.fx.timing["default"]
    "default": function(t, duration) {
        return uu.fx.timing.cubicBezier(t, duration, 0.25, 0.1, 0.25, 0.1);
    },
    // uu.fx.timing["ease-in"]
    "ease-in": function(t, duration) {
        return uu.fx.timing.cubicBezier(t, duration, 0.42, 0, 1, 1);
    },
    // uu.fx.timing["ease-out"]
    "ease-out": function(t, duration) {
        return uu.fx.timing.cubicBezier(t, duration, 0, 0, 0.58, 1);
    },
    // uu.fx.timing["ease-in-out"]
    "ease-in-out": function(t, duration) {
        return uu.fx.timing.cubicBezier(t, duration, 0.42, 0, 0.58, 1);
    },
    // uu.fx.timing.cubicBezier
    cubicBezier: function(t,          // @param Number: current time
                          duration,   // @param Number: unit ms
                          p1x,        // @param Number: 0.0 ~ 1.0
                          p1y,        // @param Number: 0.0 ~ 1.0
                          p2x,        // @param Number: 0.0 ~ 1.0
                          p2y) {      // @param Number: 0.0 ~ 1.0
                                      // @return Number: 0.0 ~ 1.0
        var cx = p1x * 3,
            cy = p1y * 3,
            bx = (p2x - p1x) * 3 - cx,
            by = (p2y - p1y) * 3 - cy,
            ax = 1 - cx - bx,
            ay = 1 - cy - by,
            xx, fin = 0,
            epsilon = 1 / (duration * 200),
            t0 = 0, t1 = 1, t2 = t, x2, d2, i = 0;

        for (; i < 8; ++i) {
            x2 = ((ax * t2 + bx) * t2 + cx) * t2 - t;
            if ((x2 >= 0 ? x2 : 0 - x2) < epsilon) {
                fin = 1;
                break;
            }
            d2 = (3 * ax * t2 + 2 * bx) * t2 + cx;
            if ((d2 >= 0 ? d2 : 0 - d2) < 0.000001) {
                break;
            }
            t2 = t2 - x2 / d2;
        }
        if (!fin) {
            if (t < 0 || t > 1) {
                return t < 0 ? 0 : 1;
            }
            for (t2 = t; t0 < t1; ) {
                x2 = ((ax * t2 + bx) * t2 + cx) * t2;
                xx = x2 - t;
                if ((xx >= 0 ? xx : -xx) < epsilon) {
                    break;
                }
                t > x2 ? (t0 = t2) : (t1 = t2);
                t2 = (t1 - t0) * 0.5 + t0;
            }
        }
        return ((ay * t2 + by) * t2 + cy) * t2;
    }
};

// inner - build animation
function uufxbuild(node, data, queue, option) {
    function ezfn(v0, v1, ez) {
        return "(b=" + v0 + ",c=" + (v1 - v0) + "," + uu.fx.easing[ez] + ")";
    }
/*
    // 123.4  -> 123.4
    // "+123" -> curt + 123
    // "-123" -> curt - 123
    function unitNormalize(curt, end, fn) {
        if (typeof end === _number) {
            return end;
        }
        var c = end.charCodeAt(0) - 42;

        // 0: "*", 1: "+", 3: "-", 5: "/"
        return !c    ? fn(curt * parseFloat(end.slice(1))) :
               c < 4 ? curt + fn(end[_replace](/^\+/, "")) : //  "+10".replace() ->  "10"
                                                             // "+-10".replace() -> "-10"
                                                             //  "-10".replace() -> "-10"
               c < 6 ? fn(curt / parseFloat(end.slice(1))) : fn(end);
    }
 */

    // fx1 = opacity, gain/dur, width, height
    // fx2 = node.filters, uu.hash.num2hh,
    var rv = 'var style=node.style,t=gain,b,c,d=dur,fx1,fx2,z1,z2,z3,z4;',
        reverseOption = { junction: option.junction,
                          before: option[_before],
                          after: option[_after],
                          back: 1 },
        i, w, n, opt,
        ez, // easing function name. eg: "inoutquad"
        sv, // start value
        ev, // end value
        cs = option.cssCache || uucss(node, "px"), // current style
        fixdb = uufix._;

    for (i in option) {
        w = fixdb[i] || i;

        if (w in cs) {
            opt = option[i];
            isArray(opt) ? (ev = opt[0], ez = opt[1][_toLowerCase]()) // { left: [100, "linear"] }
                         : (ev = opt,    ez = "inoutquad");           // { left: 100 }

            if (ev != null) {

                switch (n = uufx.props[w]) {
                case 1: // opacity
                    sv = uucssopacity(node); // start value
//{@mb
                    // init opacity [IE6][IE7][IE8]
                    uuready.opacity || (uucssopacity(node, sv),
                                        node.style[_visibility] = "visible"); // [FIX]
//}@mb
//                  ev = unitNormalize(sv, ev, parseFloat);
                    ev = uunumberexpand(sv, ev);
                    /*
                     *  b = sv;
                     *  c = ev - sv;
                     *  fx1 = c * t / d + b;
                     *  fx1 = (fx1 > 0.999) ? 1
                     *      : (fx1 < 0.001) ? 0
                     *      : fx1;
                     */
                    rv += 'fx1=' + ezfn(sv, ev, ez)
                                 + ';fx1=fx1>0.999?1:fx1<0.001?0:fx1;';

//{@mb
                    if (!uuready.opacity) { // [IE6][IE7][IE8]
                        if (uuready.filter) {
                            rv += 'fx2=node.filters.item("DXImageTransform.Microsoft.Alpha");' +
                                  'fx2.Enabled=true;fx2.Opacity=(fx1*100)|0;' +
                                  'fin&&uu.css.opacity(node,' + ev + ');';
                        }
                    } else {
//}@mb
                        rv += 'style.opacity=fin?' + ev + ':fx1;';
/*{@mb*/            } /*}@mb*/
                    break;
                case 2: // color, backgroundColor
//{@color
                    sv = uucolor(cs[w]);
                    ev = uucolor(ev);
                    rv += ['fx1=gain/dur;fx2=uu.hash.num2hh;style.',w,'="#"+',
                           '(fx2[(fin?',ev.r,':(',ev.r,'-',sv.r,')*fx1+',sv.r,')|0]||0)+',
                           '(fx2[(fin?',ev.g,':(',ev.g,'-',sv.g,')*fx1+',sv.g,')|0]||0)+',
                           '(fx2[(fin?',ev.b,':(',ev.b,'-',sv.b,')*fx1+',sv.b,')|0]||0);'
                          ].join("");
//}@color
                    break;
                case 3: // width, height:
                    sv = parseInt(cs[w]) || 0;
//                  ev = unitNormalize(sv, ev, parseInt);
                    ev = uunumberexpand(sv, ev, parseInt);
                    rv += 'fx1=fin?'+ev+':'+ezfn(sv,ev,ez)
                       +  ';fx1=fx1<0?0:fx1;style.'+w+'=(fx1|0)+"px";';
                    break;
                default: // top, left, other...
                    sv = n ? (n > 4 ? node.offsetTop  - parseInt(cs.marginTop)
                                    : node.offsetLeft - parseInt(cs.marginLeft))
                           : parseInt(cs[w]) || 0;
//                  ev = unitNormalize(sv, ev, parseInt);
                    ev = uunumberexpand(sv, ev, parseInt);
                    rv += 'style.'+w+'=((fin?'+ev+':'+ezfn(sv,ev,ez)+')|0)+"px";';
                }
                reverseOption[w] = [sv, ez];
            }
        }
    }

    // add reverse queue
    if (option.chain || option.reverse) {
        data.rq.push({
            tm: 0,
            dur: queue.dur,
            fin: _false,
            guid: queue.guid, // copy guid
            option: reverseOption
        });
    }

    return new Function("node,fin,gain,dur", rv); // node, finished, gain, duration
}

// uu.fx.skip
function uufxskip(node,        // @param Node(= null): null is all node
                  skipAll,     // @param Boolean(= false): true is skip all queue
                               //                          false is skip top queue
                  invisible) { // @param Boolean(= false): true is avoid flicker
                               // @return NodeArray:
    var ary = node ? [node] : uutag(),
        i = 0, iz = ary.length,
        j, k, jz, kz, data, guid, option, q, rq;

    for (; i < iz; ++i) {
        data = ary[i][nodeData + "fx"];

        if (data && data.id) { // running
            q  = data.q;  // queue
            rq = data.rq; // reverse queue
            guid = [];

            // set finished flag
            for (j = 0, jz = skipAll ? q.length : 1; j < jz; ++j) {
                q[j].fin = _true;
                option = q[j].option;
                (option.chain || option.reverse) && guid.push(q[j].guid);
            }

            // reverse queue
            for (j = 0, jz = guid.length; j < jz; ++j) {
                for (k = 0, kz = rq.length; k < kz; ++k) {
                    if (rq[k].guid === guid[j]) {
                        rq[k].fin = _true;
                    }
                }
            }

            // avoid flicker
            if (invisible && q.length > 2) {
                q.push({
                    tm: 0, guid: 0, fin: 1, dur: 0,
                    option: function(node) {
                        node.style[_visibility] = "visible";
                    }});

                ary[i].style[_visibility] = "hidden";
            }
        }
    }
    return ary;
}

// uu.fx.stop
function uufxstop(node) { // @param Node:
                          // @return Node:
    if (uufxisbusy(node)) {
        var q = node[nodeData + "fx"].q[0];

        q.js = uunop; // clear function
        q.tm = 1;     // past time
    }
    return node;
}

// uu.fx.isBusy
function uufxisbusy(node) { // @param Node:
                            // @return Boolean:
    var data = node[nodeData + "fx"];

    return data && data.id;
}

// uu.fx.show - show node
function uufxshow(node,            // @param Node:
                  duration,        // @param Number(= 0): fadein effect duration
                  displayValue,    // @param String(= "block"): applied at display "none"
                  __slideDown__) { // @hidden Boolean(= false): true is slideDown
                                   // @return Node:
    var cs = uucss(node), disp = displayValue || "block",
        w = cs[_width], h = cs[_height], o = uucssopacity(node) || 1;

//{@mb
    // [Opera] getComputedStyle(node).display === "none" -> width and height = "0px"
    if (cs[_display] === "none" && w === "0px" && w === h) { // [Opera] fix
        node.style[_display] = disp;
        cs = uucss(node);
        w = cs[_width];
        h = cs[_height];
        node.style[_display] = "none";
    }
//}@mb
    return uufx(node, duration || 0, { init: function(node, option) {
                var style = node.style;

                uucssopacity(node, 0);
                __slideDown__ || (style[_width] = "0");
                style[_height] = "0";
                style[_visibility] = "visible";
                if (uucss(node)[_display] === "none") {
                    style[_display] = disp;
                }
                __slideDown__ ? uumix(option, {       h: h, o: o })
                              : uumix(option, { w: w, h: h, o: o });
            }});
}

// uu.fx.hide - hide node
function uufxhide(node,       // @param Node:
                  duration) { // @param Number(= 0): fadeout effect duration
                              // @return Node:
    if (uufxishide(node)) {
        node.style[_display] = "none" // hidden -> force hide
    }
    return uufx(node, duration || 0, { w: 0, h: 0, o: 0 });
}

// uu.fx.isHide - is hidden
function uufxishide(node) { // @param Node:
                            // @return Boolean:
    var style = uucss(node);

    return style[_display] === "none" ||
           style[_visibility] === "hidden" ||
           uucssopacity(node) === 0;
}

// uu.fx.fade - fadeout / fadein
function uufxfade(node,     // @param Node:
                  duration, // @param Number: duration
                  option) { // @param Hash(= {}):
                            // @return Node:
    return uufx(node, duration, uuarg(option, { init: function(node, option) {
            uumix(option, { o: uucssopacity(node) < 0.5 ? 1 : 0 });
        }}));
}

// uu.fx.puff - zoom out and fadeout
function uufxpuff(node,     // @param Node:
                  duration, // @param Number: duration
                  option) { // @param Hash(= {}):
                            // @return Node:
    return uufx(node, duration, uuarg(option, { init: function(node, option) {
            var cs = uucss(node, "px");

            uumix(option, { w: "*1.5", h: "*1.5", o: 0,
                            x: "-" + parseInt(cs[_width])  * 0.25,
                            y: "-" + parseInt(cs[_height]) * 0.25 },
                  _env.jit ? { fs: "*1.5" } : {});
        }}));
}

// uu.fx.flare - flare
function uufxflare(node,     // @param Node:
                   duration, // @param Number: duration
                   option) { // @param Hash(= { parts: 10, range: 200 }):
                             // @return Node:
    return uufx(node, duration, uuarg(option, {
        o:      0,
        parts:  10,
        range:  200,
        init:   function(node, option) {
            var cs = uucss(node, "px"),
                x = parseInt(cs.left),
                y = parseInt(cs.top),
                cloneNode, i = 0, angle,
                p = uumix({}, option, {
                    w: parseInt(cs[_width])  * 1.5,
                    h: parseInt(cs[_height]) * 1.5,
                    cssCache: cs,
                    init: 0 // disable
                }),
                parts = (360 / p.parts) | 0;

            _env.jit && (p.fs = parseInt(cs.fontSize) * 1.5);

            for (; i < 360; i += parts) {
                cloneNode = node[_parentNode][_appendChild](uunodeclone(node, _true));
                angle = i * Math.PI / 180;

                uufx(cloneNode, duration, uuarg(p, {
                    x: Math.cos(angle) * p.range + x,
                    y: Math.sin(angle) * p.range + y,
                    init: function(cloneNode) {
                        uucssopacity(cloneNode, 0.5);
                    },
                    after: function(cloneNode, option, back) {
                        back || node[_parentNode].removeChild(cloneNode);
                    }
                }));
            }
        }
    }));
}

// uu.fx.slide - slideUp and slideDown
function uufxslide(node,     // @param Node:
                   duration, // @param Number: duration
                   option) { // @param Hash(= {}):
                             // @return Node:
    return uufx(node, duration, uuarg(option, { init: function(node, option) {
            var cs = uucss(node, "px"),
                hash = uudata(node, "uufxsize") || 0, // get
                w = parseInt(cs.width),
                h = parseInt(cs.height);

            if (!hash) {
                if (uufxishide(node)) {
                    return uufxshow(node, duration, "", 1);
                }
                if (!h) {
                    return;
                }
                uudata(node, "uufxsize", hash = { w: w, h: h }); // set
            }
            uumix(option, { h: h ? 0 : hash.h, o: h ? 0 : 1 });
        }}));
}

// uu.fx.shrink - shrink
function uufxshrink(node,     // @param Node:
                    duration, // @param Number: duration
                    option) { // @param Hash(= {}):
                              // @return Node:
//{@mb
    _env.ie6 && (node.style.overflow = "hidden"); // [IE6]
//}@mb
    return uufx(node, duration, uuarg(option, { init: function(node, option) {
            var cs = uucss(node, "px");

            uumix(option, { w: 0, h: 0, o: 0,
                            x: "-" + parseInt(cs[_width])  * 0.5,
                            y: "-" + parseInt(cs[_height]) * 0.5, fs: "*0.5" });
        }}));
}

// uu.fx.movein - movein + fadein
function uufxmovein(node,     // @param Node:
                    duration, // @param Number: duration
                    option) { // @param Hash(= { degree: 0, range: 200 }):
                              // @return Node:
    return uufx(node, duration, uuarg(option, {
            degree: 0,
            o:      1,
            init:   function(node, option) {
                var cs = uucss(node, "px"), style = node.style,
                    angle, endX, endY, fs, w, h, o, range = option.range || 200;

                angle = option.degree * Math.PI / 180;
                endX = parseInt(cs.left);
                endY = parseInt(cs.top);
                if (_env.jit) {
                    fs = parseInt(cs.fontSize);
                }
                w = parseInt(cs[_width]);
                h = parseInt(cs[_height]);
                o = uucssopacity(node);
                style.left   = (Math.cos(angle) * range + endX) + "px";
                style.top    = (Math.sin(angle) * range + endY) + "px";
                style[_width]  = (w * 1.5) + "px";
                style[_height] = (h * 1.5) + "px";
                if (_env.jit) {
                    style.fontSize = (fs * 1.5) + "px";
                }
                uucssopacity(node, 0);

                _env.jit && (option.fs = fs);
                uumix(option, { w: w, h: h, x: endX, y: endY });
            }}));
}

// uu.fx.moveout - moveout + fadeout
function uufxmoveout(node,     // @param Node:
                     duration, // @param Number: duration
                     option) { // @param Hash(= { degree: 0, range: 200 }):
                               // @return Node:
    return uufx(node, duration, uuarg(option, { init: function(node, option) {
                var cs = uucss(node, "px"), angle, endX, endY,
                    range = option.range || 200;

                angle = option.degree * Math.PI / 180;
                endX = Math.cos(angle) * range + parseInt(cs.left);
                endY = Math.sin(angle) * range + parseInt(cs.top);

                uumix(option, { w: "*1.5", h: "*1.5", x: endX, y: endY },
                      _env.jit ? { fs: "*1.5" } : {});
            }, degree: 0, o: 0 }));
}

// uu.fx.highlight - highlight color
function uufxhighlight(node,     // @param Node:
                       duration, // @param Number: duration
                       option) { // @param Hash(= { bgc: "#ff9", reverse: 1 }):
                                 // @return Node:
    var bgc = uucssbgcolor(node, "transparent"),
        undo = function(node, option, back) {
            back && uucss(node, { bgc: bgc });
        };

    return uufx(node, duration,
                uuarg(option, { bgc: "#ff9", reverse: 1, _after: undo }));
}
//}@fx

// --- CSS 2 ---
// uu.css.bgcolor - get inherit background color
function uucssbgcolor(node,           // @param Node:
                      defaultColor) { // @param ColorString(= "#fff"):
                                      // @return Color:
    var n = node, bgc = "transparent",
        zero = { transparent: 1, "rgba(0, 0, 0, 0)": 1 };

    while (n && n !== doc && zero[bgc]) {
//{@mb
        if (_ie678 && !n.currentStyle) {
            break;
        }
//}@mb
        bgc = uucss(n).backgroundColor;
        n = n.parentNode;
    }
    return uucolor(zero[bgc] ? defaultColor : bgc);
}

// --- CSS 3 ---
// uu.css.opacity
function uucssopacity(node,      // @param Node:
                      opacity) { // @param Number/String(= void): Number(0.0 - 1.0) absolute
                                 //                               String("+0.5", "-0.5") relative
                                 // @return Number/Node:
    var style = node.style,
/*{@mb*/ident = "DXImageTransform.Microsoft.Alpha", tmpParent, /*}@mb*/
        undef;

    if (opacity === undef) {
//{@mb
        if (!uuready.opacity) { // [IE6][IE7][IE8]
            opacity = node[nodeData + "opacity"]; // undefined or 1.0 ~ 2.0

            return opacity ? (opacity - 1): 1;
        }
        if (getComputedStyle) {
//}@mb
            return parseFloat(getComputedStyle(node, 0).opacity);
//{@mb
        }
        return 1;
//}@mb
    }

//{@mb
    if (!uuready.opacity) {
        if (!node[nodeData + "opacity"]) {
            if (uuready.filter) {
                // init opacity
                node.style.filter += " progid:" + ident + "()";
            }
            if (_env.ie6 || _env.ie7) { // [FIX][IE6][IE7]
                if ((node.currentStyle || {})[_width] === "auto") {
                    style.zoom = 1;
                }
            }
        }
    }
//}@mb

    // relative opacity -> absolute opacity
    if (typeof opacity === _string) { // "+0.1" or "-0.1"
        opacity = uucssopacity(node) + parseFloat(opacity);
    }

    // normalize
    style.opacity = opacity = (opacity > 0.999) ? 1
                            : (opacity < 0.001) ? 0 : opacity;

//{@mb
    if (!uuready.opacity) { // [IE6][IE7][IE8]
        node[nodeData + "opacity"] = opacity + 1; // (1.0 ~ 2.0)
        if (uuready.filter) {
            // http://d.hatena.ne.jp/uupaa/20100819
            if (!node[_parentNode]) {
                tmpParent = doc.body;
                tmpParent[_appendChild](node);
            }
            var filter = node.filters.item(ident);

            if (opacity > 0 && opacity < 1) {
                filter.Enabled = _true;
                filter.Opacity = (opacity * 100) | 0;
            } else {
                filter.Enabled = _false;
            }
            tmpParent && tmpParent.removeChild(node);
        }
        style[_visibility] = opacity ? "visible" : "hidden";
    }
//}@mb
    return node;
}

// uu.css.transform
function uucsstransform(node,    // @param Node:
                        param) { // @param NumberArray(= void): [scaleX, scaleY,
                                 //                              rotate(degree),
                                 //                              translateX, translateY]
                                 // @return Node/NumberArray:
    //  [1][get transform] uu.css.transform(node) -> [scaleX, scaleY, rotate,
    //                                                translateX, translateY]
    //  [2][set transform] uu.css.transform(node, 1, 1, 0, 0, 0) -> node

    var meta = nodeData + "trans";

    if (!param) {
        return node[meta] || [1, 1, 0, 0, 0];
    }

//{@mb
    if (_ie) {
        if (uuready.filter) {
            var ident = "DXImageTransform.Microsoft.Matrix",
                data = nodeData + "transie",
                rotate = param[2] * Math.PI / 180, // deg2rad
                cos = Math.cos(-rotate),
                sin = Math.sin(-rotate),
                // scale * rotate * translate
                mtx = [ cos * param[0], sin * param[0], 0,
                       -sin * param[1], cos * param[1], 0,
                              param[3],       param[4], 1],
                filter, rect, cx, cy;

            if (!node[meta]) {
                // init - get center position
                rect = node.getBoundingClientRect();
                cx = (rect.right  - rect.left) / 2; // center x
                cy = (rect.bottom - rect.top)  / 2; // center y

                node.style.filter += " progid:" + ident
                                   + "(sizingMethod='auto expand')";
                node[data] = { cx: cx, cy: cy };
            }
            filter = node.filters.item(ident),

            filter.M11 = mtx[0];
            filter.M12 = mtx[1];
            filter.M21 = mtx[3];
            filter.M22 = mtx[4];
            filter.Dx  = mtx[6];
            filter.Dy  = mtx[7];

            // recalc center
            rect = node.getBoundingClientRect();
            cx = (rect.right  - rect.left) / 2;
            cy = (rect.bottom - rect.top)  / 2;

            node.style.marginLeft = node[data].cx - cx + "px";
            node.style.marginTop  = node[data].cy - cy + "px";
        }
    } else {
//}@mb

    //  node.style.webkitTransformOrigin = ""
        node.style[_webkit ? "webkitTransform" :
//{@mb
                   _gecko  ? "MozTransform" :
                   _opera  ? "OTransform" :
//                 _ie     ? "msTransform" :
//}@mb
                   "transform"] =
            "scale(" + param[0] + "," + param[1] + ") rotate("
                     + param[2] + "deg) translate("
                     + param[3] + "," + param[4] + ")";
//{@mb
    }
//}@mb
    node[meta] = param[_concat]();
    return node;
}

// --- CSS BOX MODEL ---

// clientWidth           = node.style.width + padding
// offsetWidth           = node.style.width + padding + border
// getBoundingClientRect = node.style.width + padding + border
//
//   [CSS2.1 box model] http://www.w3.org/TR/CSS2/box.html
//
//       B-------border--------+ -> border edge [CSS2.1 KEYWORD]
//       |                     |
//       |  P----padding----+  | -> padding edge [CSS2.1 KEYWORD]
//       |  |               |  |
//       |  |  C-content-+  |  | -> content edge [CSS2.1 KEYWORD]
//       |  |  |         |  |  |
//       |  |  |         |  |  |
//       |  |  +---------+  |  |
//       |  |               |  |
//       |  +---------------+  |
//       |                     |
//       +---------------------+
//
//       B = event.offsetX/Y in WebKit
//           event.layerX/Y  in Gecko
//       P = event.offsetX/Y in IE6 ~ IE8
//       C = event.offsetX/Y in Opera

//{@cssbox

// uu.css.box - get box size(margin, padding, border, width, height)
function uucssbox(node,  // @param Node:
                  quick, // @param Boolean(= false): false is use-cache, true is quick-mode
                  mbp) { // @param Number(= 0x7): select properties, 0x7 is all,
                         //                       0x4 is margin only,
                         //                       0x2 is border only,
                         //                       0x1 is padding only
                         // @return Hash: { w: style.width,
                         //                 h: style.height,
                         //                 m: { t, l, r, b },  // margin:  { top, left, right, bottom }
                         //                 b: { t, l, r, b },  // border:  { top, left, right, bottom }
                         //                 p: { t, l, r, b } } // padding: { top, left, right, bottom }
    var meta = nodeData + "cssbox",
        rv = node[meta];

    if (!rv || !quick) {
        mbp = mbp || 0x7;

        var zero = "0px", bw = uucssbox.bw, prop = uucssbox.prop,
            ns = uucss(node, "px"), // computed pixel unit
            mt = ns[prop[0]],   // ns.marginTop
            ml = ns[prop[1]],   // ns.marginLeft
            mr = ns[prop[2]],   // ns.marginRight
            mb = ns[prop[3]],   // ns.marginBottom
            pt = ns[prop[4]],   // ns.paddingTop
            pl = ns[prop[5]],   // ns.paddingLeft
            pr = ns[prop[6]],   // ns.paddingRight
            pb = ns[prop[7]],   // ns.paddingBottom
            bt = ns[prop[8]],   // ns.borderTopWidth
            bl = ns[prop[9]],   // ns.borderLeftWidth
            br = ns[prop[10]],  // ns.borderRightWidth
            bb = ns[prop[11]];  // ns.borderBottomWidth

        if (mbp & 0x4) { // margin
            mt = mt === zero ? 0 : uucssunit(node, mt, 1);
            ml = ml === zero ? 0 : uucssunit(node, ml, 1);
            mr = mr === zero ? 0 : uucssunit(node, mr, 1);
            mb = mb === zero ? 0 : uucssunit(node, mb, 1);
        }
        if (mbp & 0x2) { // border
            bt = bw[bt] || (bt === zero ? 0 : uucssunit(node, bt, 1));
            bl = bw[bl] || (bl === zero ? 0 : uucssunit(node, bl, 1));
            br = bw[br] || (br === zero ? 0 : uucssunit(node, br, 1));
            bb = bw[bb] || (bb === zero ? 0 : uucssunit(node, bb, 1));
        }
        if (mbp & 0x1) { // padding
            pt = pt === zero ? 0 : uucssunit(node, pt, 1);
            pl = pl === zero ? 0 : uucssunit(node, pl, 1);
            pr = pr === zero ? 0 : uucssunit(node, pr, 1);
            pb = pb === zero ? 0 : uucssunit(node, pb, 1);
        }
        rv = node[meta] = {
            w: ns.width,
            h: ns.height,
            m: { t: mt, l: ml, r: mr, b: mb },
            b: { t: bt, l: bl, r: br, b: bb },
            p: { t: pt, l: pl, r: pr, b: pb }
        };
    }
    return rv;
}
uucssbox.prop = ("marginTop,marginLeft,marginRight,marginBottom," +
                 "paddingTop,paddingLeft,paddingRight,paddingBottom," +
                 "borderTopWidth,borderLeftWidth," +
                 "borderRightWidth,borderBottomWidth").split(",");
uucssbox.bw = { // border-width
    thin: 1, medium: 3, thick: (_env.ie6 || _env.ie7 || _opera) ? 6 : 5
};

// uu.css.rect - get offset from AncestorNode/LayoutParentNode
function uucssrect(node,           // @param Node:
                   ancestorNode) { // @param Node(= null): AncestorNode,
                                   //                      null is detect LayoutParentNode
                                   // @return Hash: { x, y, w, h, parent }
                                   //   x - Number: total offset
                                   //   y - Number: total offset
                                   //   w - Number: offsetWidth  (style.width  + padding + border)
                                   //   h - Number: offsetHeight (style.height + padding + border)
                                   //   from - Node: AncestorNode or LayoutParentNode

    //  [1][offset from LayoutParentNode] uu.css.rect(<div>)         -> { x: 100, y: 100, w: 100, h: 100, from: <?> }
    //  [2][offset from AncestorNode]     uu.css.rect(<div>, <html>) -> { x: 200, y: 200, w: 100, h: 100, from: <html> }

    var cs = uucss(node), position, body = doc.body,
        x = 0,
        y = 0,
        w = 0, // offsetWidth  = node.style.width  + padding + border
        h = 0, // offsetHeight = node.style.height + padding + border
        n = node,
        from = null,
        quick = 0;

    if (cs) {
        position = cs.position;
        w = node.offsetWidth  || 0; // offsetWidth  = node.style.width  + padding + border
        h = node.offsetHeight || 0; // offsetHeight = node.style.height + padding + border

        if (position === "relative" || position === "absolute") {
            if (cs.left !== "auto" && cs.top !== "auto") {
                quick = 1;
            }
//{@mb
            if (_gecko) {
                if (cs.left === "0px" || cs.top === "0px") { // [GECKO][FIX] left:auto -> "0px"
                    quick = 0;
                }
            }
//}@mb
        }

        if (ancestorNode == null) {
            // offset from LayoutParentNode
            if (quick) {
                x = parseInt(cs.left);
                y = parseInt(cs.top);
                from = n.offsetParent;
            } else {
                while (n && n !== body) {
                    x += n.offsetLeft || 0;
                    y += n.offsetTop  || 0;
                    n  = n.offsetParent;
                    if (n) {
                        cs = (getComputedStyle ? getComputedStyle(n, 0)
                                               : n.currentStyle).position;
                        if (cs === "relative" || cs === "absolute") {
                            from = n;
                            break;
                        }
                    }
                }
            }
        } else {
            // offset from AncestorNode
            while (n && n !== body) {
                x += n.offsetLeft || 0;
                y += n.offsetTop  || 0;
                n  = n.offsetParent;
                if (n && n === ancestorNode) {
                    from = n;
                    break;
                }
            }
        }
    }
    return { x: x, y: y, w: w, h: h, from: from };
}

// uu.css.position - to static / to absolute / to relative
function uucssposition(node,  // @param Node:
                       pos) { // @param String(= "s"): "static", "absolute", "relative"
                              //                    or "s", "a", "r"
                              // @return Node:
    var ns = node.style, cs, rect, box;

    switch ((pos || "s").charAt(0)) {
    case "s":   ns.position = "static"; break;
    case "a":   rect = uucssrect(node); // offset from foster
                box = uucssbox(node, _false, 0x4); // margin only
                ns.left = (rect.x - box.m.l) + "px"; // margin.left
                ns.top  = (rect.y - box.m.t) + "px"; // margin.top
                ns.position = "absolute";
                break;
    case "r":   cs = uucss(node); // get computed style
                ns.left = cs.left;
                ns.top  = cs.top;
                ns.position = "relative";
    }
    return node;
}
//}@cssbox

// --- CSS3 ---

// uu.css.userSelect - user select
function uucssuserSelect(node,    // @param Node(= null):
                         allow) { // @param Boolean(= false):
                                  // @return Node:
    var undef, all = node === undef,
/*{@mb*/ary, i, iz,/*}@mb*/
        style, val = allow ? "" : "none";

    all && (node = doc.body);
    style = node.style;

    if (style.userSelect !== undef) { // [CSS3] user-select:
        style.userSelect = val;
    } else if (style.WebkitUserSelect !== undef) {
        style.WebkitUserSelect = val;
//{@mb
    } else if (style.MozUserSelect !== undef) {
        ary = all ? uutag("", doc.body) : [node];
        for (i = 0, iz = ary.length; i < iz; ++i) {
            ary[i].style.MozUserSelect = allow ? "" : "-moz-none";
        }
    } else if (style.OUserSelect !== undef) {
        style.OUserSelect = val;
    } else { // [IE][OPERA]
        if (_ie && all) { // [IE]
            doc.unselectable  = allow ? "" : "on";
            doc.onselectstart = allow ? "" : uupao(false);
        } else { // [IE][OPERA]
            ary = all ? uutag("", doc.body) : [node];
            for (i = 0, iz = ary.length; i < iz; ++i) {
                ary[i].unselectable  = allow ? "" : "on";
                ary[i].onselectstart = allow ? "" : uupao(false);
            }
        }
//}@mb
    }
    return node;
}

// --- STYLE SHEET ---

// StyleSheet.init
function StyleSheetInit(id) { // @param String(= ""): style sheet id
    var node;

    uuhead(node = uunode("style", [{ id: id || "" }, _webkit ? " " : null]));

    this.ss = node.sheet /*{@mb*/ || node.styleSheet /*}@mb */ ; // [IE] node.styleSheet
    this.rules = {};
}

// StyleSheet.add
function StyleSheetAdd(expr,   // @param Hash/String: { selector: declaration, ... } or a "selector"
                       decl) { // @param Hash(= void): "declaration"
    var ss = this.ss,
/*{@mb*/ary, i, iz, rex, /*}@mb*/
        selector, declaration, pair = uupair(expr, decl);

    uumix(this.rules, pair);

    for (selector in pair) {
        declaration = this.rules[selector];

//{@mb
        if (ss.insertRule) {
//}@mb
            ss.insertRule(selector + "{" + declaration + "}",
                          ss.cssRules.length);
//{@mb
        } else { // [IE]
            rex = _env.ie6 ? /(?:\+>~)/ : 0;
            ary = selector.split(",");
            for (i = 0, iz = ary.length; i < iz; ++i) {
                if (rex && rex.test(ary[i])) {
                    // http://d.hatena.ne.jp/uupaa/20100717/1279297903
                    throw new Error("BAD_SELECTOR");
                }
                ss.addRule(ary[i], declaration.trim());
            }
        }
//}@mb
    }
}

// StyleSheet.clear - clear all rules
function StyleSheetClear() {
    this.rules = {};
    clearAllRules(this);
}

// inner - clear all rules
function clearAllRules(that) {
    var ss = that.ss, i;

//{@mb
    if (ss.deleteRule) {
//}@mb
        i = ss.cssRules.length;
        while (i--) {
            ss.deleteRule(i);
        }
//{@mb
    } else {
        i = ss.rules.length;
        while (i--) {
            ss.removeRule(i);
        }
    }
//}@mb
}

// uu.css.unit - convert to pixel unit
function uucssunit(node,   // @param Node: context
                   value,  // @param Number/CSSUnitString: 123, "123", "123px",
                           //                              "123em", "123pt", "auto"
                   quick,  // @param Boolean(= false): true is quick mode
                   prop) { // @param String(= "left"): property
    prop = prop || "left";

    var fontSize, ratio, _float = parseFloat;

    if (typeof value === _number) {
        return value;
    }

    // "123px" -> 123
    if (uucssunit.px.test(value)) {
        return parseInt(value) || 0;
    }
    if (value === "auto") {
        if (!prop[_indexOf]("bor") || !prop[_indexOf]("pad")) { // /^border|^padding/g
            return 0;
        }
    }
    if (!quick) {
        return uucssunit.calc(node, prop, value);
    }
    if (uucssunit.pt.test(value)) {
        return (_float(value) * 4 / 3) | 0; // 12pt * 1.333 = 16px
    } else if (uucssunit.em.test(value)) {
        fontSize = uucss(node).fontSize;
        ratio = uucssunit.pt.test(fontSize) ? 4 / 3 : 1;
        return (_float(value) * _float(fontSize) * ratio) | 0;
    }
    return parseInt(value) || 0;
}
uumix(uucssunit, { px: /px$/, pt: /pt$/, em: /em$/, calc: calcPixel });

// inner - convert CSS unit
function calcPixel(node,    // @param Node:
                   prop,    // @param String: property, "left", "width", ...
                   value) { // @param CSSUnitString: "10em", "10pt", "10px", "auto"
                            // @return Number: pixel value
    var style = node.style, mem = [style.left, 0, 0], // [left, position, display]
        position = "position",
        important = "important",
        setProperty = "setProperty",
        removeProperty = "removeProperty",
        getPropertyValue = "getPropertyValue";

//{@mb
    if (_webkit) {
//}@mb
        mem[1] = style[getPropertyValue](position);
        mem[2] = style[getPropertyValue](_display);
        style[setProperty](position, "absolute", important);
        style[setProperty](_display, "block",    important);
//{@mb
    }
//}@mb
    style[setProperty](prop, value, important);
    // get pixel
    value = parseInt(getComputedStyle(node, 0).left);
    // restore
    style[removeProperty](prop);
    style[setProperty](prop, mem[0], "");
//{@mb
    if (_webkit) {
//}@mb
        style[removeProperty](position);
        style[removeProperty](_display);
        style[setProperty](position, mem[1], "");
        style[setProperty](_display, mem[2], "");
//{@mb
    }
//}@mb
    return value || 0;
}

//{@mb
// inner - convert CSS unit
function calcPixelIE(node,    // @param Node:
                     prop,    // @param String: property, "left", "width", ...
                     value) { // @param CSSUnitString: "10em", "10pt", "10px", "auto"
                              // @return Number: pixel value
    var style = node.style,
        runtimeStyle = node.runtimeStyle,
        mem = [style[prop], runtimeStyle[prop]]; // keep !important value

    // overwrite
    runtimeStyle[prop] = node.currentStyle[prop];
    style[prop] = value;

    // get pixel
    value = style.pixelLeft;

    // restore
    style[prop] = mem[0];
    runtimeStyle[prop] = mem[1];

    return value || 0;
}

if (!getComputedStyle) {
    uucssunit.calc = calcPixelIE;
}

// inner - emulate getComputedStyle [IE6][IE7][IE8]
function getComputedStyleIE(node) { // @param Node:
                                    // @return Hash: { width: "123px", ... }
    // http://d.hatena.ne.jp/uupaa/20091212
    var rv, rect, ut, v, w, x, i = 0, mem,
        style = node.style,
        currentStyle = node.currentStyle,
        runtimeStyle = node.runtimeStyle,
        UNITS = { m: 1, t: 2, "%": 3, o: 3 }, // em, pt, %, auto,
        RECTANGLE = { top: 1, left: 2, width: 3, height: 4 },
        fontSize = currentStyle.fontSize,
        em = parseFloat(fontSize) * (uucssunit.pt.test(fontSize) ? 4 / 3 : 1),
        boxProperties = getComputedStyleIE.boxs,
        cache = { "0px": "0px", "1px": "1px", "2px": "2px", "5px": "5px",
                  thin: "1px", medium: "3px",
                  thick: _env.ie8 ? "5px" : "6px" }; // [IE6][IE7] thick = "6px"

    rv = getComputedStyleIE.getProps(currentStyle);

    // calc: border***Width, padding***, margin***
    for (; w = boxProperties[i++]; ) {
        v = currentStyle[w];
        if (!(v in cache)) {
            x = v;
            switch (ut = UNITS[v.slice(-1)]) {
            case 1: x = parseFloat(v) * em; break;    // "12em"
            case 2: x = parseFloat(v) * 4 / 3; break; // "12pt"
            case 3: // %, auto
                    mem = [style.left, runtimeStyle.left];
                    runtimeStyle.left = currentStyle.left;
                    style.left = v;
                    x = style.pixelLeft;
                    style.left = mem[0];
                    runtimeStyle.left = mem[1];
            }
            cache[v] = ut ? (x + "px") : x;
        }
        rv[w] = cache[v];
    }
    // calc: top, left, width, height
    for (w in RECTANGLE) {
        v = currentStyle[w];
        switch (ut = UNITS[v.slice(-1)]) {
        case 1: v = parseFloat(v) * em; break;    // "12em"
        case 2: v = parseFloat(v) * 4 / 3; break; // "12pt"
        case 3: // %, auto
            switch (RECTANGLE[w]) {
            case 1: v = node.offsetTop; break;  // style.top
            case 2: v = node.offsetLeft; break; // style.left
            case 3: rect || (rect = node.getBoundingClientRect());
                    v = (node.offsetWidth  || rect.right - rect.left) // style.width
                      - parseInt(rv.borderLeftWidth)
                      - parseInt(rv.borderRightWidth)
                      - parseInt(rv.paddingLeft)
                      - parseInt(rv.paddingRight);
                    v = v > 0 ? v : 0;
                    break;
            case 4: rect || (rect = node.getBoundingClientRect());
                    v = (node.offsetHeight || rect.bottom - rect.top) // style.height
                      - parseInt(rv.borderTopWidth)
                      - parseInt(rv.borderBottomWidth)
                      - parseInt(rv.paddingTop)
                      - parseInt(rv.paddingBottom);
                    v = v > 0 ? v : 0;
            }
        }
        rv[w] = ut ? (v + "px") : v;
    }
    rv.opacity = uucssopacity(node);
    rv.fontSize = em + "px";
    rv.cssFloat = currentStyle.styleFloat; // compat
    return rv;
}
getComputedStyleIE.boxs = // boxProperties
    ("borderBottomWidth,borderLeftWidth,borderRightWidth,borderTopWidth," +
     "marginBottom,marginLeft,marginRight,marginTop," +
     "paddingBottom,paddingLeft,paddingRight,paddingTop").split(",");

getComputedStyleIE.getProps = (function(props) {
    var js = [], i = 0, prop;

    for (; prop = props[i++]; ) {
        js.push(prop + ":style." + prop); // "{{prop}}: style.{{prop}}"
    }
    return new Function("style", "return {" + js.join(",") + "}");
})( ("backgroundColor,backgroundImage,backgroundPosition,backgroundRepeat," +
     "borderBottomColor,borderBottomStyle,borderLeftColor,borderLeftStyle," +
     "borderRightColor,borderRightStyle,borderTopColor,borderTopStyle," +
     "bottom,clear,clipBottom,clipLeft,clipRight,clipTop,color,cursor," +
     "direction,display,fontFamily,fontSize,fontStyle,fontWeight," +
     "letterSpacing,lineBreak,lineHeight,listStyleImage,listStylePosition," +
     "listStyleType,maxHeight,maxWidth,minHeight,minWidth,position," +
     "right,textAlign,textIndent,textOverflow,verticalAlign,visibility," +
     "whiteSpace,wordBreak,wordSpacing,wordWrap,zIndex,zoom").split(","));
//}@mb

// --- className(klass) ---
// uu.klass - as document.getElementsByClassName and className accessor
function uuklass(expr,      // @param String/Node: "class", "class1, ..." or Node
                 context) { // @param String/Node(= <body>): query context
                            // @return NodeArray/Node: [Node, ...] or Node

    //  [1][query  className]  uu.klass("warn", <div>)             -> NodeArray
    //  [2][add    className]  uu.klass(<div>,              "A")   -> <div class="A">
    //  [3][add    className]  uu.klass(<div>,             "+A B") -> <div class="A B">
    //  [4][remove className]  uu.klass(<div class="A B">, "-A B") -> <div>
    //  [5][toggle className]  uu.klass(<div class="A">,   "!A B") -> <div>

    var rv, ri, i, iz, m, v, ary, az, rex, nodeList, sp = " ",
        w = context, n = expr;

    // className accessor [2][3][4][5]
    if (expr.nodeType) {
        switch ({ "+": 3, "-": 4, "!": 5 }[w.charAt(0)] || 2) {
        case 2: n[_className] += sp + w; break;          //  add
        case 3: n[_className] += sp + w.slice(1); break; // +add
        case 4: rex = classNameMatcher(uutrim(w.slice(1)).split(sp)); // -remove
                n[_className] = uutrim(n[_className][_replace](rex, ""));
                break;
        case 5: m = uuklasshas(n, w = w.slice(1)) ? "-" : "+"; // !toggle
                uuklass(n, m + w);
        }
        return n;
    }

    // query.class [1]
//{@mb
    if (doc.getElementsByClassName) {
//}@mb
        return toArray.call((context || doc.body).getElementsByClassName(expr));
//{@mb
    }

    ary = uutrim(expr).split(sp);
    az  = ary.length;
    rex = classNameMatcher(ary);
    nodeList = (context || doc.body).getElementsByTagName("*");

    for (rv = [], ri = -1, i = 0, iz = nodeList.length; i < iz; ++i) {
        v = nodeList[i];
        (w = v[_className]) && ((m = w.match(rex)) && m.length >= az)
                            && (rv[++ri] = v);
    }
    return rv;
//}@mb
}

// uu.klass.has - has className
function uuklasshas(node,         // @param Node:
                    classNames) { // @param String: "class1 class2 ..." (joint space)
                                  // @return Boolean:
    var m, w = node[_className], ary = uutrim(classNames).split(" ");

    return w ? ((m = w.match(classNameMatcher(ary))) && (m.length >= ary.length))
             : _false;
}

// inner - className matcher
function classNameMatcher(ary) { // @param Array:
                                 // @return RegExp:
    return RegExp("(?:^| )(" + ary.join("|") + ")(?:$|(?= ))", "g");
}

// --- OOP ---
// uu.Class - create a generic class
function uuclass(className,      // @param String: "Class"
                                 //             or "Class : SuperClass"  (inherit)
                                 //             or "Class < SuperClass"  (inherit)
                 protoMember,    // @param Hash/Function(= void): prototype object
                                 //                               or init function
                 staticMember) { // @param Hash(= void): static member

    //  [1][define tiny class]     uu.Class("Class")
    //  [2][define generic class]  uu.Class("Class",            { proto: ... }, { static: func... })
    //  [3][inherit]               uu.Class("SuperClass:Class", { proto: ... }, { static: func... })
    //  [4][inherit]               uu.Class("SuperClass<Class", { proto: ... }, { static: func... })

    var ary = className.split(/\s*[\x3a\x3c]\s*/),
        Class = ary[0],
        Super = ary[1] || "",
        protoIsFunction = protoMember && isFunction(protoMember),
        tmp, i, classPrototype;

    uuclass[Class] = function() {
        var that = this,
            args = arguments,
            Super = that.superClass || 0;

        that.name = Class;        // class name
        that.uuguid = uunumber(); // instance guid
        that.msgbox || (that.msgbox = uunop);
        uu.msg.bind(that);       // bind MsgPump

        // constructor(Super -> that)
        Super && Super.init && Super.init.apply(that, args);
                  that.init &&  that.init.apply(that, args);
    };
    uuclass[Class].toString = function() { // uujsonencode()
        return Class;
    };
    uuclass[Class][_prototype] = protoIsFunction ? { init: protoMember }
                                                 : protoMember || {};
    staticMember && uumix(uuclass[className], staticMember);

    if (Super && protoMember && !protoIsFunction) { // [2]
        tmp = function() {};
        tmp[_prototype] = uu.Class[Super][_prototype];
        classPrototype = uuclass[Class][_prototype] = new tmp;

        for (i in protoMember) {
            classPrototype[i] = protoMember[i];
        }
        classPrototype.constructor = uuclass[Class];
        classPrototype.superClass = uu.Class[Super][_prototype];
        classPrototype.superMethod = superMethod;
    }

    function superMethod(method              // @param String: method name
                         /*, var_args */ ) { // @param Mix: args
        return this.superClass[method].apply(this, uuarray(arguments, 1));
    }
}

// uu.Class.singleton - create a singleton class
function uuclasssingleton(className,      // @param String: class name
                          protoMember,    // @param Hash/Function(= void): prototype member
                                          //                               or init function
                          staticMember) { // @param Hash(= void): static member
    uuclass[className] = function() {
        var that = this, arg = arguments, self = arg.callee,
            instance = "instance";

        if (!self[instance]) {
            that.name = className;    // class name
            that.uuguid = uunumber(); // instance guid
            that.init && that.init.apply(that, arg);
            that.msgbox || (that.msgbox = uunop);
            uu.msg.bind(that);       // bind MsgPump
        }
        return self[instance] || (self[instance] = that);
    };
    uuclass[className].toString = function() { // uujsonencode()
        return className;
    };
    uuclass[className][_prototype] =
        protoMember && isFunction(protoMember) ? { init: protoMember }
                                               : protoMember || {};
    staticMember && uumix(uuclass[className], staticMember);
}

// --- MsgPump ---
// MsgPump
function MsgPump() {
    this.addr = {}; // AddressMap { guid: instance, ... }
    this.cast = []; // Broadcast AddressMap [guid, ...]
}

// MsgPump.send - send a message synchronously
function uumsgsend(address,  // @param NodeArray/InstanceArray/Array/Mix: address or guid or UINode
                             //           [instance, ...] is multicast
                             //           instance is unicast
                             //           null is broadcast
                   message,  // @param String: message
                   param1,   // @param Mix(= void): param1
                   param2) { // @param Mix(= void): param2
                            // @return Arra: [result, ...]

    //  [1][multicast] MsgPump.send([instance, ...], "hello") -> ["world!", ...]
    //  [2][unicast  ] MsgPump.send(instance, "hello") -> ["world!"]
    //  [3][broadcast] MsgPump.send(null, "hello") -> ["world!", ...]

    var rv = [], ri = -1, to, obj, i = 0,
        ary = address ? uuarray(address) : this.cast;

    for (; to = ary[i++]; ) {
        obj = this.addr[to.instance ? to.instance.uuguid
                                    : (to.uuguid || to || 0)];
        obj && (rv[++ri] = obj.msgbox(message, param1, param2));
    }
    return rv;
}

// MsgPump.post - send a message asynchronously
function uumsgpost(address,  // @param NodeArray/InstanceArray/Array/Mix: address or guid or UINode
                             //           [instance, ...] is multicast
                             //           instance is unicast
                             //           null is broadcast
                   message,  // @param String: message
                   param1,   // @param Mix(= void): param1
                   param2) { // @param Mix(= void): param2

    //  [1][multicast] MsgPump.post([instance, ...], "hello")
    //  [2][unicast  ] MsgPump.post(instance, "hello")
    //  [3][broadcast] MsgPump.post(null, "hello")

    var that = this;

    setTimeout(function() {
        that.send(address ? uuarray(address) : that.cast,
                  message, param1, param2);
    }, 0);
}

// MsgPump.bind - register the destination of the message
function uumsgbind(instance) { // @param Instance: class instance
    this.addr[instance.uuguid] = instance;
    this.cast = uukeys(this.addr);
}

// MsgPump.unbind
function uumsgunbind(instance) { // @param Instance: class instance
    delete this.db[instance.uuguid];
    this.cast = uukeys(this.addr);
}

// --- event ---

// uu.event - bind event
function uuevent(node,         // @param Node:
                 eventTypeEx,  // @param EventTypeExString: some EventTypeEx, "click,click+,..."
                 evaluator,    // @param Function/Instance: callback function
                 __unbind__) { // @hidden Boolean(= false): true is unbind, false is bind
                               // @return Node:
    function eventClosure(event) {
        if (!event.node) {
            var fullcode = uuevent.codes[event.type] || 0,
                target = event.target /*{@mb*/ || event.srcElement || doc; /*}@mb*/

            event.node = node;
            event.code = fullcode & 0xff; // half code
            event.touch = fullcode & 0x0200;
            event.gesture = fullcode & 0x0400;
            event.mouse = event.button || 0;
            event.at = (target[_nodeType] === 3) // 3: TEXT_NODE
                     ? target[_parentNode] : target;

/* Gecko2 multitouch events support
            if (_gecko && event.touch) { // [Gecko2][Firefox4]
                if (event.mozInputSource === 5) { // 5: MOZ_SOURCE_TOUCH
                    switch (fullcode) {
                    case uuevent.codes.MozTouchDown:
                        uuevent.finger[event.streamId] = 1;
                        uuevent.finger.length += 1;
                        break;
                    case uuevent.codes.MozTouchUp:
                        uuevent.finger[event.streamId] = 0;
                        uuevent.finger.length -= 1;
                    }
                }
            }
 */

//{@mb
            if (_ie678) {
                if (!event.target) { // [IE6][IE7][IE8]
                    event.currentTarget = node;

                    switch (event.code) {
                    case uuevent.codes.mousedown:
                    case uuevent.codes.mouseup:
                        event.mouse = (event.button & 1) ? 0
                                    : (event.button & 2) ? 2 : 1;
                        break;
                    case uuevent.codes.contextmenu:
                        event.mouse = 2;
                        break;
                    case uuevent.codes.mouseover:
                    case uuevent.codes.mouseout:
                        event.relatedTarget = target === event.fromElement
                                            ? event.toElement
                                            : event.fromElement;
                    }
                }
                if (event.pageX === void 0) { // [IE6][IE7][IE8]
                    event.pageX = event.clientX + (owner.scrollLeft || 0);
                    event.pageY = event.clientY + (owner.scrollTop  || 0);
                }
            }
//}@mb
            if (event.code === uuevent.codes.mousewheel) {
                event.wheel = (/*{@mb*/ event.detail ? event.detail : /*}@mb*/
                               (event.wheelDelta / -120)) | 0;
            }
        }
        // callback(event, node)
        (isInstance ? handler.call(evaluator, event)
                    : evaluator(event)) === _false && uueventstop(event);
    }

    // [1][bind a event]            uu.event(node, "click", fn)             -> node
    // [2][bind multi events]       uu.event(node, "click,dblclick", fn)    -> node
    // [3][bind a capture event]    uu.event(node, "mousemove+", fn)        -> node
    // [4][bind a namespace.event]  uu.event(node, "MyNameSpace.click", fn) -> node

    // --- init event database ---
    if (!(nodeData + "event" in node)) {
        node[nodeData + "event"] = { t: ",", c: {}, e: {} }; // t:types, c:closure, e:evaluator
    }

    var eventTypeExArray = eventTypeEx.split(","),
        eventData = node[nodeData + "event"],
        ex, token, eventType, capture, closure, bound,
        handler, i = 0, pos,
/*{@mb*/owner = (node.ownerDocument || doc).documentElement,/*}@mb*/
        isInstance = 0;

    if (__unbind__) {
        closure = evaluator;
    } else {
        handler = isFunction(evaluator) ? evaluator
                                        : (isInstance = 1, evaluator.handleEvent);
        closure = eventClosure;
    }

    //
    // event database structure
    //
    //  node["data-uuevent"]                             // aka eventData
    //  node["data-uuevent"].t = "," + eventTypeEx + "," // types
    //  node["data-uuevent"].c[eventTypeEx] = closure    // closure db
    //  node["data-uuevent"].e[eventTypeEx] = evaluator  // evaluator db
    //

    for (; ex = eventTypeExArray[i++]; ) { // ex = "namespace.click+"

        //
        // parse EventTypeExString( "namespace.click+" )
        //                                v
        // token = ["namespace.click+", "namespace", "click", "+"]
        //

        token = uuevent._.parse.exec(ex);
        eventType = token[2]; // "click"
        capture   = token[3]; // "+"
        bound     = eventData.t[_indexOf]("," + ex + ",") >= 0;

//{@mb
        // IE mouse capture [IE6][IE7][IE8]
        if (_ie678) {
            if (eventType === "mousemove") {
                capture && (__unbind__ ? uueventunbind
                                       : uuevent)(node, "losecapture", closure);
            } else if (eventType === "losecapture") {
                if (node.setCapture) {
                    __unbind__ ? node.releaseCapture()
                               : node.setCapture();
                }
            }
        }
//}@mb
        if (__unbind__) {
            if (bound) {

                pos = eventData.c[ex][_indexOf](evaluator);
                if (pos >= 0) {

                    eventData.c[ex].splice(pos, 1); // remove closure
                    eventData.e[ex].splice(pos, 1); // remove evaluator

                    // removed all handlers in a type
                    if (!eventData.c[ex].length) {

                        // ",dblclick," <- ",namespace.click+,dblclick,".
                        //                      replace(",namespace.click+,", ",")
                        eventData.t =
                            eventData.t[_replace]("," + ex + ",", ",");
                    }
                    uueventattach(node, eventType, closure, capture, _true); // detach
                }
            }
        } else {
            // ",namespace.click+,dblclick," <- ",namespace.click+," + "dblclick" + ,"
            if (!bound) {
                // --- init ---
                eventData.t += ex + ",";
                eventData.c[ex] = [];
                eventData.e[ex] = [];
            }
            eventData.c[ex].push(closure);
            eventData.e[ex].push(evaluator);
            uueventattach(node, eventType, closure, capture);
        }
    }
    return node;
}
uuevent._ = {
    // uuevent._.parse - parse EventTypeEx
    parse:  /^(?:(\w+)\.)?(\w+)(\+)?$/, // ^[NameSpace.]EvntType[Capture]$
//{@mb
    // uuevent._.fix - crossbrowse event names
    fix:    _gecko ? { mousewheel: "DOMMouseScroll",
                       touchstart: "MozTouchDown",
                       touchend:   "MozTouchUp",
                       touchmove:  "MozTouchMove" } :
            _opera ? { contextmenu: "mousedown" } : {},
//}@mb
    // uuevent._.as - shortcuts, uu.mousedown as uu.event.mousedown
    as:     ("mousedown,mouseup,mousemove,mousewheel,click,dblclick,keydown," +
             "keypress,keyup,change,submit,focus,blur,contextmenu").split(",")
};
//{@mb
//uuevent.finger = { length: 0 }; // [Gecko] touch event fingers
//}@mb
uuevent.codes = {
//{@mb
    // Cross Browser Event
    losecapture:    0x102, // as mouseup    [IE]
    DOMMouseScroll: 0x104, // as mousewheel [GECKO]
//}@mb
    // DOM Level2 Events    iPhone Touch Events         iPhone Gesture Events
    mousedown:      1,      touchstart:     0x201,      gesturestart:   0x401,
    mouseup:        2,      touchend:       0x202,      gestureend:     0x402,
    mousemove:      3,      touchmove:      0x203,      gesturechange:  0x403,
    mousewheel:     4,
//{@mb
/*
    //                      Gecko Touch Events
                            MozTouchDown:   0x201,
                            MozTouchUp:     0x202,
                            MozTouchMove:   0x203,
 */
//}@mb
    click:          10,
    dblclick:       11,
    keydown:        12,
    keypress:       13,
    keyup:          14,
    mouseenter:     15,
    mouseleave:     16,
    mouseover:      17,
    mouseout:       18,
    contextmenu:    19,
    focus:          20,
    blur:           21,
    resize:         22,
    scroll:         23,
    change:         24,
    submit:         25,
    // HTML5 Events
    online:         50,
    offline:        51,
    message:        52
};

// uu.event.fire - fire event / fire custom event(none capture event only)
function uueventfire(node,      // @param Node: target node
                     eventType, // @param String: "click", "custom"
                     param) {   // @param Mix(= void): param
                                // @return Node:
    if (uuhas(node, eventType)) {

        var fakeEventObjectEx = {
                type:           eventType,
                pageX:          0,
                pageY:          0,
                param:          param,
                target:         node,
                button:         0,
                detail:         0,
                customEvent:    _true,
                currentTarget:  node,
                relatedTarget:  node
            };

        uueach(node[nodeData + "event"].c[eventType], function(closure) {
            closure.call(node, fakeEventObjectEx);
        });
    }
    return node;
}

// uu.event.stop - stopPropagation and preventDefault
function uueventstop(event) { // @param EventObjectEx:
//{@mb
    if (event.stopPropagation) {
//}@mb
        event.stopPropagation();
        event.preventDefault();
//{@mb
    } else {
        event.cancelBubble = _true;
        event.returnValue = _false;
        // [IE6][FIX]
        if (_env.ie6 && (event.type === "mouseover" ||
                         event.type === "mouseout")) {
            event.returnValue = _true; // preventDefault
        }
    }
//}@mb
}

// uu.event.evaluator - get evaluator array
function uueventevaluator(node,          // @param Node:
                          eventTypeEx) { // @param EventTypeExString:
                                         // @return FunctionArray:
    var eventData = node[nodeData + "event"];

    return eventData && eventData.e[eventTypeEx] ? eventData.e[eventTypeEx].concat()
                                                 : [];
}

// uu.event.unbind - unbind event
function uueventunbind(node,          // @param Node: target node
                       eventTypeEx) { // @param EventTypeExString(= void): namespace and event types, "click,click+,..."
                                      // @return Node:
    //  [1][unbind all]              uu.event.unbind(node) -> node
    //  [2][unbind some]             uu.event.unbind(node, "click+,dblclick") -> node
    //  [3][unbind namespace all]    uu.event.unbind(node, "namespace.*") -> node
    //  [4][unbind namespace some]   uu.event.unbind(node, "namespace.click+,namespace.dblclick") -> node

    var eventData = node[nodeData + "event"], ns, ary, ex, i = 0, c = ",";

    if (eventData) {
        eventTypeEx = eventTypeEx ? c + eventTypeEx + c         // [2] ",click,"
                                  : node[nodeData + "event"].t; // [1] ",click,MyNamespace.mousemove+,"
        ary = eventTypeEx[_replace](/^,|,$/g, "").split(c);

        for (; ex = ary[i++]; ) {
            if (ex.lastIndexOf(".*") > 1) { // [3] "namespace.*"
                ns = ex.slice(0, -1);       // "namespace.*" -> "namespace."
                uueach(ary, function(ex) {
                    if (!ex[_indexOf](ns)) {
                        uueach(eventData.c[ex], function(closure) {
                            uuevent(node, ex, closure, _true); // unbind
                        });
                    }
                });
            } else { // [2][4]
                if (eventTypeEx[_indexOf](c + ex + c) >= 0) {
                    uueach(eventData.c[ex], function(closure) {
                        uuevent(node, ex, closure, _true); // unbind
                    });
                }
            }
        }
    }
    return node;
}

// uu.event.attach - attach event - Raw Level API wrapper
function uueventattach(node,         // @param Node:
                       eventType,    // @param String: event type
                       evaluator,    // @param Function: evaluator
                       useCapture,   // @param Boolean(= false):
                       __detach__) { // @hidden Boolean(= false): true is detach
//{@mb
    eventType = uuevent._.fix[eventType] || eventType;
//}@mb

/* event log
    if (uu.ready.dom) {
        var fnguid;

        if (evaluator.fnguid) {
            fnguid = evaluator.fnguid;
        } else {
            evaluator.fnguid = uunumber();
            fnguid = evaluator.fnguid;
        }
        if (__detach__) {
            uulog("detach(" + eventType + ")" + fnguid);
        } else {
            uulog("attach(" + eventType + ")" + fnguid);
        }
    }
 */

//{@mb
    if (node[_addEventListener]) {
//}@mb
        node[__detach__ ? "removeEventListener"
                        : _addEventListener](eventType, evaluator, !!useCapture);
//{@mb
    } else {
        node[__detach__ ? "detachEvent"
                        : "attachEvent"]("on" + eventType, evaluator);
    }
//}@mb

//{@ui
    if (node.instance) {
        //
        // uu.bind(<input type="range" instance={uu.Class.Slider} />)
        //
        //              | post message
        //              v
        //
        // <div class="Slider**" ui="Slider" instance={uu.Class.Slider}>
        //      <div class="Slider*Grip" />
        // </div>
        //
        uu.msg.post(node.instance, "event",
                    { bind: !__detach__, node: node,
                      type: eventType, callback: evaluator });
    }
//}@ui
}

// uu.event.detach - detach event - Raw Level API wrapper
function uueventdetach(node,         // @param Node:
                       eventType,    // @param String: event type
                       evaluator,    // @param Function: evaluator
                       useCapture) { // @param Boolean(= false):
    uueventattach(node, eventType, evaluator, useCapture, 1);
}

// uu.event.key - get key and keyCode (cross browse keyCode)
function uueventkey(event) { // @param EventObjectEx:
                             // @return Hash: { key, code }
                             //     key  - String: "UP", "1", "A"
                             //     code - Number:   38,  49,  65
    var code = event.keyCode || event.charCode || 0;

    return { key: uueventkey.ident[code] || "", code: code };
}

// ::event.keyCode
//    http://www.w3.org/TR/DOM-Level-3-Events/#events-keyboardevents

uueventkey.ident = uuhash( // virtual keycode -> "KEY IDENTIFIER"
    "8,BS,9,TAB,13,ENTER,16,SHIFT,17,CTRL,18,ALT,27,ESC," +
    "32,SP,33,PGUP,34,PGDN,35,END,36,HOME,37,LEFT,38,UP,39,RIGHT,40,DOWN," +
    "45,INS,46,DEL,48,0,49,1,50,2,51,3,52,4,53,5,54,6,55,7,56,8,57,9," +
    "65,A,66,B,67,C,68,D,69,E,70,F,71,G,72,H,73,I,74,J,75,K,76,L,77,M," +
    "78,N,79,O,80,P,81,Q,82,R,83,S,84,T,85,U,86,V,87,W,88,X,89,Y,90,Z");

// uu.event.edge - get padding edge (cross browse offsetX/Y)
function uueventedge(event) { // @param EventObjectEx:
                              // @return Hash: { x, y }
                              //     x - Number: fixed offsetX
                              //     y - Number: fixed offsetY
    // http://d.hatena.ne.jp/uupaa/20100430/1272561922
    var style =
//{@mb
                _ie ? null :
//}@mb
                             getComputedStyle(event.at, 0),
        x = event.offsetX || 0,
        y = event.offsetY || 0;

//{@mb
    if (_webkit) {
//}@mb
        x -= parseInt(style.borderTopWidth)  || 0; // "auto" -> 0
        y -= parseInt(style.borderLeftWidth) || 0;
//{@mb
    } else if (_opera) {
        x += parseInt(style.paddingTop)  || 0;
        y += parseInt(style.paddingLeft) || 0;
    } else if (_gecko || event.layer !== void 0) {
        x = (event.layerX || 0) - (parseInt(style.borderTopWidth)  || 0);
        y = (event.layerY || 0) - (parseInt(style.borderLeftWidth) || 0);
    }
//}@mb
    return { x: x, y: y };
}

//{@mb
// uu.event.hover - enter / leave event handler
function uueventhover(node,         // @param Node:
                      expr,         // @param Function/ClassNameString: enter/leave-callback or toggle-className
                      __unbind__) { // @hidden Boolean(= false): true is unbind
                                    // @return Node:
    function hoverEventClosure(evt, rel) {
        // ignode mouse transit(mouseover, mouseout) in child node
        toggle ? uuklass(node, "!" + expr) // toggle className
               : _ie ? expr(evt, evt.code === uuevent.codes.mouseenter, node)
                     : node !== (rel = evt.relatedTarget) && !uuhas(node, rel) &&
                       expr(evt, evt.code === uuevent.codes.mouseover, node);
        uueventstop(evt);
    }

    var type = _ie ? "mouseenter,mouseleave"
                   : "mouseover+,mouseout+",
        toggle = isString(expr),
        dataset = "uu-eventhover", handler = node[dataset];

    if (__unbind__) {
        uueventunbind(node, type, handler);
        node[dataset] = null;
        return node;
    }
    handler && uueventunbind(node, type, handler); // bound? -> unbind

    return uuevent(node, type, node[dataset] = hoverEventClosure); // bind(rebind)
}

// uu.event.unhover - unbind hover event
function uueventunhover(node) { // @param Node:
                                // @return Node:
    return uueventhover(node, "", _true);
}
//}@mb

//{@eventcyclic
// uu.event.cyclic - cyclic events
function uueventcyclic(node,         // @param Node: target node
                       eventTypeEx,  // @param EventTypeExString: "click,..."
                       callback,     // @param Function: callback(evt, times)
                       cyclic,       // @param Number: cyclic count
                       loop,         // @param Number(= 0): loops, zero is infinity
                       __unbind__) { // @hidden Boolean(= false): true is unbind
                                     // @return Node:
    function cyclicEventClosure(evt, rv) {
        //  function callback() {
        //     :
        //     return true; // cancel cyclic and stopPropagation
        //  }
        //
        //  function callback() {
        //     :
        //     return false; // stopPropagation
        //  }
        rv = callback(evt, count);

        if (++count >= cyclic) {
            count = 0;
            loop && !--loop && (rv = _true);
        }
        rv === _true && (uueventstop(evt),
                         uueventunbind(node, eventTypeEx, cyclicEventClosure)); // cancel & stop
        return rv;
    }

    var dataset = "uu-eventcyclic", data = node[dataset], count = 0;

    if (__unbind__) {
        uueventunbind(node, eventTypeEx, data[eventTypeEx]);
        data[eventTypeEx] = null;
        return node;
    }
    data && data[eventTypeEx] && uueventunbind(node, eventTypeEx, data[eventTypeEx]); // bound? -> unbind

    node[dataset] || (node[dataset] = {});
    node[dataset][eventTypeEx] = cyclicEventClosure;
    return uuevent(node, eventTypeEx, cyclicEventClosure); // bind(rebind)
}

// uu.event.uncyclic - unbind cyclic events
function uueventuncyclic(node,          // @param Node: target node
                         eventTypeEx) { // @param EventTypeExString: "click,..."
    return uueventcyclic(node, eventTypeEx, 0, 0, 0, _true);
}
//}@eventcyclic

//{@eventresize
// uu.event.resize
function uueventresize(evaluator) { // @param Function: callback function
    var db = uueventresize.db;

    if (!db.fn.length) { // init
//{@mb
        uueventresize.unsafe ? (db.vp = uuviewport(),
                                db.tm = setInterval(onresizeagent, db.delay)) : // [IE6][IE7][IE8]
//}@mb
                               uueventattach(win, "resize", onresize);          // [W3C]
    }
    db.fn.push(evaluator);
}
uueventresize.unsafe = _ie678; // [IE6][IE7][IE8]
uueventresize.db = {
    fn:     [],
    tm:     0,  // setInterval timer id
    lock:   0,
    delay:  uueventresize.unsafe ? 100 : 40  // 100ms(unsafe) or 40ms(safe)
};

// uu.event.unresize
function uueventunresize() {
    var db = uueventresize.db;

    db.fn = [];
//{@mb
    uueventresize.unsafe ? (db.tm && (clearInterval(db.tm), db.tm = 0)) : // [IE6][IE7][IE8]
//}@mb
                           uueventdetach(win, "resize", onresize);        // [W3C]
    db.lock = 0;
}

// inner - resize event handler
function onresize(event) {
    var db = uueventresize.db,
        evt = uumix(event, { node: win, code: uuevent.codes.resize, at: win });

    if (!db.lock++) {
        setTimeout(function() {
            for (var i = 0, iz = db.fn.length; i < iz; ++i) {
                db.fn[i] && db.fn[i](evt); // callback(event)
            }
            setTimeout(function() { // [lazy] unlock
                db.lock = 0;
            }, 0);
        }, db.delay); // event-intensive
    }
}

// inner - resize handler(resize agent) for unsafe browser
//{@mb
function onresizeagent() {
    var db = uueventresize.db, i = 0, iz, vp,
        evt = { node: win, code: uuevent.codes.resize, at: win };

    if (!db.lock++) {
        //
        // peek innerWidth and innerHeight
        //
        vp = uuviewport();
        if (db.vp.innerWidth !== vp.innerWidth
            || db.vp.innerHeight !== vp.innerHeight) { // resized?

            db.vp = vp; // store
            for (iz = db.fn.length; i < iz; ++i) {
                db.fn[i] && db.fn[i](evt); // callback(event)
            }
        }
        setTimeout(function() { // [lazy] unlock
            db.lock = 0;
        }, 0);
    }
}
//}@mb
//}@eventresize

// --- LIVE EVENT ---
//{@live

// uu.event.live
function uulive(expr,        // @param CSSSelectorExpressionString "css > selector"
                eventTypeEx, // @param EventTypeExString: "namespace.click"
                evaluator,   // @param Function/Instance: callback function
                __data__) {  // @hidden Hash: data for recursive call
    function _liveClosure(event) { // @param EventObject:
        var fullcode = uuevent.codes[event.type] || 0,
            target = event.target
/*{@mb*/                          || event.srcElement || doc; /*}@mb*/

        event.at = (target[_nodeType] === 3) ? target[_parentNode]
                                             : target;

        if (uumatch(expr, event.at)) {
            event.code = fullcode & 0xff; // half code
//{@mb
            if (_ie678) {
                if (!event.target) { // [IE6][IE7][IE8]
                    event.currentTarget = doc;
                }
                if (event.pageX === void 0) { // [IE6][IE7][IE8]
                    event.pageX = event.clientX + (root.scrollLeft || 0);
                    event.pageY = event.clientY + (root.scrollTop  || 0);
                }
            }
//}@mb
            instance ? handler.call(evaluator, event)
                     : evaluator(event);
        }
    }

    var instance = 0,
        handler = isFunction(evaluator) ? evaluator
                                        : (instance = 1, evaluator.handleEvent),
        // split token (ignore capture[+])
        //      "namespace.click+"
        //              v
        //      ["namespace.click+", "namespace", "click", "+"]
        token     = uuevent._.parse.exec(eventTypeEx),
        ns        = token[1], // "namespace"
        eventType = token[2], // "click"
        capture   = 0,
        fixEventType = uulive.fix[eventType] || eventType;

    evaluator.liveClosure = _liveClosure;

    __data__ || (__data__ = uulive.db[expr + "\v" + eventTypeEx] = {
        s: expr,
        ns: ns,
        ex: eventTypeEx,
        unbind: []
    });

//{@mb
    if (_gecko) {
        if (eventType === "focus" || eventType === "blur") {
            capture = 1;
        }
    }
//}@mb

    __data__.unbind.push(function() {
        uueventdetach(doc, fixEventType, _liveClosure, capture);
    });
    uueventattach(doc, fixEventType, _liveClosure, capture);

//{@mb
    if (_ie) {
        if (/submit$/.test(eventType)) {
            uulive(expr + " input[type=submit]," +
                   expr + " input[type=image]",
                   eventTypeEx.replace(/submit$/, "click"), evaluator, __data__);

        } else if (/change$/.test(eventType)) { // "change"
            uulive(expr,
                   eventTypeEx.replace(/change$/, "focus"), function(event) {
                       uuevent(event.srcElement, "uulive.change", evaluator);
                   }, __data__);

            uulive(expr,
                   eventTypeEx.replace(/change$/, "blur"), function(event) {
                       uueventunbind(event.srcElement, "uulive.change");
                   }, __data__);
        }
    }
//}@mb
}
uulive.db = {}; // { "expr\vnamespace.click": {...}, ... }
uulive.fix =
//{@mb
             _ie ? { focus: "focusin", blur: "focusout" } :
//}@mb
             _webkit ? { focus: "DOMFocusIn", blur: "DOMFocusOut" } : {};

// uu.live.has
function uulivehas(expr,          // @param CSSSelectorExpressionString: "css > selector"
                   eventTypeEx) { // @param EventTypeExString: "namespace.click"
    var db = uulive.db[expr + "\v" + eventTypeEx];

    return db && expr === db.s && eventTypeEx === db.ex;
}

// uu.unlive
function uuunlive(expr,          // @param CSSSelectorExpressionString(= void 0): "css > selector"
                  eventTypeEx) { // @param String(= void 0): "namespace.click"
    function run(fn) {
        fn();
    }
    var db = uulive.db,
        ns, data, i, unbind,
        mode = !expr    ? 1 : // [1]
               !eventTypeEx ? 2 : // [2]
               eventTypeEx[_indexOf]("*") < 0 ? 3 :  // [3][5]
               (ns = eventTypeEx.slice(0, -2), 4); // [4] "namespace.*" -> "namespace"

    for (i in db) { // i = "expr\vnamespace.click"
        data = db[i]; // data = { s:expr, ns:ns, ex:eventTypeEx, unbind:[closure] }
        unbind = 1;
        switch (mode) {
        case 2: unbind = expr === data.s; break; // [2]
        case 3: unbind = expr === data.s && eventTypeEx === data.ex; break; // [3][5]
        case 4: unbind = expr === data.s && ns === data.ns; // [4]
        }
        if (unbind) {
            uueach(data.unbind, run);
            delete db[i];
        }
    }
}
//}@live

//{@junction
// uu.junction -
function uujunction(race,       // @param Number: race conditions
                    items,      // @param Number: items
                    callback) { // @param Function: callback(result, values)
                                //    result - Boolean: true is pass
                                //    values - Array: [value, ...]
                                // @throws Error("JUNCTION...")
    //  [1][some  1/3] uu.junction(1, 3, callback).ng(1).ng(2).ok(3)      -> callback(true,  [1, 2, 3])
    //  [2][some  2/3] uu.junction(2, 3, callback).ng(1).ng(2).ok(3)      -> callback(false, [1, 2, 3])
    //  [3][some  2/3] uu.junction(2, 3, callback).ok(1).ng(2).ok( )      -> callback(true,  [1, 2, undefined])
    //  [4][every 3/3] uu.junction(3, 3, callback).ok(1).ok(2).ok({id:3}) -> callback(true,  [1, 2, {id:3}])

    return new uuclass["Junction"](race, items, callback);
}

// uu.Class.Junction.init
function JunctionInit(race, items, callback) {
    this.db = { ok: 0, ng: 0, race: race, items: items,
                values: [], callback: callback };
    if (!race || !items || race > items) {
        throw new Error(uuf("JUNCTION @ @", race, items));
    }
}

// uu.Class.Junction.ok
function JunctionOK(value) { // @param Mix(= void): value
    ++this.db.ok;
    this.db.values.push(value);
    return this.judge();
}

// uu.Class.Junction.ng
function JunctionNG(value) { // @param Mix(= void): value
    ++this.db.ng;
    this.db.values.push(value);
    return this.judge();
}

// uu.Class.Junction.judge
function JunctionJudge() {
    var db = this.db;

    if (db.callback) {
        if (db.ok           >= db.race  || // 4     >= 4
            db.ng + db.race >  db.items || // 2 + 3 >  4
            db.ok + db.ng   >= db.items) { // 2 + 2 >= 4

            db.callback(db.ok >= db.race, db.values);
            db.callback = null;
        }
    }
    return this;
}
//}@junction

// --- READY ---
// uu.ready - hook event
function uuready(/* readyEventType, */  // @param CaseInsenseString(= "dom"): readyEventType
                 /* callback, ... */) { // @param Function: callback functions
    var args = arguments, v, i = 0, iz = args.length, db = uuready.uudb,
        m, type = "dom", order = 0, rex = /^([^\:]+)(\:[0-2])?$/; // "dom", "dom:1", "dom:2"

    if (!uuready.reload) {
        for (; i < iz; ++i) {
            v = args[i];
            if (isString(v)) {
                m = rex.exec(v);
                if (m) {
                    type = m[1][_toLowerCase]();
                    order = +m[2] || 0;
                }
            } else {
                if (uuready[type]) { // already? -> fire
                    v(uu); // callback(uu)
                } else {
                    db[type] || (db[type] = [[], [], []]);
                    db[type][order].push(v);
                }
            }
        }
    }
}
uuready.uudb = {}; // { readyEventType: [[low order], [mid order], [high order]], ... }

// uu.ready.fire
function uureadyfire(readyEventType, // @param CaseInsenseString: readyEventType
                     param) {        // @param Mix(= document): callback(uu, param)
    var type = readyEventType[_toLowerCase](),
        db = uuready.uudb[type], ary, callback, i = 0;

    if (db) {
        ary = db[2][_concat](db[1], db[0]); // join order: ary = [2] + [1] + [0]
        uuready.uudb[type] = null; // clear order array

        for (; callback = ary[i++]; ) {
            callback(uu, param || doc);
        }
    }
}

// --- node ---

// uu.node - node builder
function uunode(node,       // @param Node/SVGNode/TagNameString(= "div"): "div" or "svg:svg"
                args,       // @param Array/Arguments(= void): [Node/String/Number/Hash, ...]
                typical,    // @param StringArray(= void): ["x", "y"]
                callback) { // @param Function(= void):
                            // @return Node/SVGNode:
    //  [1][add node]            uu.div(uu.div())         -> <div><div></div></div>
    //  [2][add text node]       uu.div(uu.text("hello")) -> <div>hello</div>
    //  [2][add text by string]  uu.div("hello")          -> <div>hello</div>
    //  [4][set attr by string]  uu.div("class,hello")    -> <div class="hello"></div>
    //  [5][set attr by hash]    uu.div({ cn: "hello" })  -> <div class="hello"></div>
    //  [6][set css by string]   uu.div("", "color,red")  -> <div style="color:red"></div>
    //  [7][set css by hash]     uu.div("", { c: "red" }) -> <div style="color:red"></div>
    //  [8][callback]            uu.node.at(callback)
    //                           uu.div("@123")           -> callback(<div>, "123")
    //  [9][add SVGNode]         uu.svg.svg(uu.svg.g())       -> <svg:svg><svg:g></svg:g></svg:svg>
    //  [10][add SVGText node]   uu.svg.svg(uu.svg.text("!")) -> <svg:svg><svg:text>!</svg:text></svg:svg>
    //  [11][set attr by string] uu.svg.svg("class,hello")    -> <svg:svg class="hello"></svg:svg>
    //  [12][set attr by hash]   uu.svg.svg({ cn: "hello" })  -> <svg:svg class="hello"></svg:svg>
    //  [13][set typical attr]   uu.svg.svg(100, 100)         -> <svg:svg x="100" y="100"></svg:svg>
    //  [14][set css by string]  uu.svg.svg("", "color,red")  -> <svg:svg style="color:red"></svg:svg>
    //  [15][set css by hash]    uu.svg.svg("", { c: "red" }) -> <svg:svg style="color:red"></svg:svg>
    //  [16][callback]           uu.node.at(callback)
    //                           uu.svg.svg("@123")           -> callback(<svg:svg>, "123")

    node || (node = "div");
    node[_nodeType] || (node = node[_indexOf]("svg:")
                            ? newNode(node) // "div" -> <div>
                            : doc.createElementNS("http://www.w3.org/2000/svg",
                                                  node.slice(4))); // "svg:g" -> <svg:g>

    if (args) {
        var arg, i = 0, iz = args.length, token = 0, type, isstr, ident,
            ai = 0, hash = {};

        for (; i < iz; ++i) {
            arg = args[i];
            if (arg != null) { // null or undefined
                if (arg[_nodeType]) { // node -> appendChild(node)
                    node[_appendChild](arg);
                } else {
                    isstr = (type = typeof arg) === _string;

                    if (isstr && !arg[_indexOf]("@")) { // "@ident" -> callback(node, "ident")
                        ident = arg.slice(1);
                    } else {
                        // typical arguments(Number, String)
                        if (type === _number || (isstr && arg[_indexOf](",") < 0)) {
                            if (typical) {
                                hash[typical[ai++]] = arg; // uu.svg(100, 100)
                            } else if (arg !== "") {
                                node[_appendChild](newText(arg)); // uu.div("text")
                            }
                        } else if (++token < 3) {
                            (token < 2 ? uuattr
                                       : uucss)(node, isstr ? uuhash(arg) : arg);
                        }
                    }
                }
            }
        }
        ident && uunodeat.callback
              && uunodeat.callback(node, ident);
        callback && ai && callback(node, hash);
    }
    return node;
}

// uu.node.at - set Node builder callback
function uunodeat(callback) { // @param Function: callback
    uunodeat.callback = callback;
}

// HTML4(a ~ ul) exclude <html><head><body>
uutag.html4 = "a,b,br,dd,div,dl,dt,form,h1,h2,h3,h4,h5,h6,i,img,iframe," +
              "input,li,ol,option,p,pre,select,span,table,tbody,tr," +
              "td,th,thead,tfoot,textarea,u,ul";
// HTML5(abbr ~ video)
uutag.html5 = "abbr,article,aside,audio,canvas,datalist," +
              "details,eventsource,figure,footer,header,hgroup," +
              "mark,menu,meter,nav,output,progress,section,time,video";

// inner - setup node builder - uu.div(), uu.a(), ...
uueach((uutag.html4 + "," + uutag.html5).split(","), function(tag) {
    uu[tag] || (uu[tag] = function() { // @param Mix: var_args
        return uunode(tag, arguments);
    });
});

// uu.head
function uuhead(/* var_args */) { // @param Mix: var_args
                                  // @return Node: <head> node
    return uunode(doc.head, arguments);
}

// uu.body
function uubody(/* var_args */) { // @param Mix: var_args
                                  // @return Node: <body> node
    return uunode(doc.body, arguments);
}

// uu.node.add - add/insert node
function uunodeadd(source,     // @param Node/DocumentFragment/HTMLFragment/TagName(= "div"):
                   context,    // @param Node(= <body>): add to context
                   position) { // @param String(= "./last"): insert position
                               // @return Node: node
    //  [1][add div node]          uu.add()         -> <body><div /></body>
    //  [2][from tagName]          uu.add("p")      -> <body><p /></body>
    //  [3][from node]             uu.add(uu.div()) -> <body><div /></body>
    //  [4][from HTMLFragment]     uu.add("<div><p>txt</p></div>") -> <body><div><p>txt</p></div></body>
    //  [5][from DocumentFragment] uu.add(DocumentFragment)        -> <body>{{fragment}}</body>

    context = context || doc.body;

    var node = !source ? newNode()          // [1] uu.node.add()
             : source[_nodeType] ? source   // [3][5] uu.node.add(Node or DocumentFragment)
             : !source[_indexOf]("<") ? uunodebulk(source, context)
                                            // [4] uu.node.add(HTMLFragmentString)
             : newNode(source),             // [2] uu.node.add("p")
        reference = null,
        rv = (node[_nodeType] === 11) ? node[_firstChild] : node; // 11: DOCUMENT_FRAGMENT_NODE

    switch (uunodeadd.pos[position] || 8) {
    case 1: reference = context[_parentNode][_firstChild];
    case 2: reference || (reference = context);
    case 3: reference || (reference = context[_nextSibling]);
    case 4: context[_parentNode].insertBefore(node, reference); break;
    case 5: reference = context[_firstChild];
    case 8: context.insertBefore(node, reference);
    }
    return rv;
}
uunodeadd.pos = { first: 1, prev: 2, next: 3, last: 4, "./first": 5, "./last": 8 };

// uu.nodeid - Node <-> NodeID
function uunodeid(ident) { // @param Node/Number: Node or NodeID
                           // @return Number/Node: NodeID, from 1

    //  [1][get NodeID by Node]  uu.nodeid(Node)   -> NodeID
    //  [2][get Node by NodeID]  uu.nodeid(NodeID) -> Node
    var id, data = nodeData + "nodeid";

    return ident.nodeType ? (ident[data] || (_nodeiddb[id = ++_nodeidnum] = ident,
                                             ident[data] = id))
                          : _nodeiddb[ident];
}

// uu.nodeid.remove - remove NodeID
function uunodeidremove(nodeid) { // @param Number: NodeID
    var node = _nodeiddb[nodeid];

    node && (_nodeiddb[nodeid] = node[nodeData + "nodeid"] = 0);
}

// uu.node.bulk - convert HTMLString into DocumentFragment
function uunodebulk(source,    // @param Node/HTMLFragment: source
                    context) { // @param Node(= <div>): context
                               // @return DocumentFragment:
    //  [1][clone]  uu.node.bulk(Node) -> DocumentFragment
    //  [2][build]  uu.node.bulk("<p>html</p>") -> DocumentFragment

    var rv = doc.createDocumentFragment(),
        pad = _false,
        fragment = source[_nodeType] ? source.outerHTML // [1] node
                                     : source,          // [2] "<p>html</p>"
        placeholder = uunode((context || {})[_tagName]);

//{@mb
    // [IE][FIX] node.innerHTML = "<style></style>" neglect
    // http://twitter.com/uupaa/status/20443869519
    if (/^<style/i.test(fragment)) {
        if (!uu.ready.innerHTML.style && uu.ready.innerHTML.padStyle) { // [IE]
            fragment = "<br/>" + fragment; // <br/><style>...</style>...
            ++pad;
        }
    }
//}@mb

    placeholder.innerHTML = fragment;

//{@mb
    if (pad) {
        placeholder.removeChild(placeholder[_firstChild]);
    }
//}@mb

    while (placeholder[_firstChild]) {
        rv[_appendChild](placeholder[_firstChild]);
    }
    return rv;
}

// uu.node.glue - temporarily glued to <body>
function uunodeglue(node,   // @param Node: target node
                    work) { // @param Function: work(node)
                            // @return Node: node
    var div;

    uu.body(div = uu.div({}, "position:absolute;top:-9999px;left:-9999px;" +
                             "margin:0;padding:0;border:0 none", node));
    work(node);
    doc.body[_removeChild](node);
    return node;
}

// uu.node.path - get CSSQueryString fro node
function uunodepath(node) {  // @param Node: ELEMENT_NODE
                             // @return CSSQueryString: "body>div:nth-child(5)
    var rv = [], n = node, idx;

    while (n && n[_nodeType] === 1) { // 1: ELEMENT_NODE
        if (uunodepath.vip.test(n[_tagName])) {
            rv.push(n[_tagName]);
            break;
        } else {
            idx = "";
            if (n[_parentNode]) {
                idx = (uunodebros(n).length < 2
                    ? ""
                    : ":nth-child(" + (uunodebros(n).index + 1) + ")");
            }
            rv.push(n[_tagName] + idx);
        }
        n = n[_parentNode];
    }
    return rv.reverse().join(">")[_toLowerCase]();
}
uunodepath.vip = /^(?:html|head|body)$/i;

// uu.node.sort - sort by document order, detect duplicate
function uunodesort(ary,       // @param NodeArray:
                    context) { // @hidden Node(= <body>): search context
                               // @return Array: [SortedNodeArray, DuplicatedNodeArray]
    var rv = [], ri = -1, i = 0, iz = ary.length, hash = { length: iz },
        idx, min = 0xfffffff, max = 0, node, dups = [], di = -1,
        all = /*{@mb*/ _ie ? 0 : /*}@mb*/
                       uutag("", context || doc.body);

    for (; i < iz; ++i) {
        node = ary[i];
        idx = /*{@mb*/ _ie ? node.sourceIndex : /*}@mb*/
                       all[_indexOf](node);
        min > idx && (min = idx);
        max < idx && (max = idx);
        hash[idx] ? (dups[++di] = node) : (hash[idx] = node); // judge duplicate
    }
    for (i = min; i <= max; ++i) {
        (node = hash[i]) && (rv[++ri] = node);
    }
    return [rv, dups];
}

// uu.node.swap - swap node
function uunodeswap(swapout,  // @param Node: swapout
                    swapin) { // @param Node: swapin
                              // @return Node: swapout
    return swapout[_parentNode].replaceChild(swapin, swapout);
}

// uu.node.wrap - wrapper
function uunodewrap(innerNode,   // @param Node: inner node
                    outerNode) { // @param Node: wrapper, outer node
                                 // @return Node: innerNode
    //  [1][wrap] uu.node.wrap(<span>target</span>, <p>)
    //            <span>target</span>  ->  <p><span>target</span></p>

    return outerNode[_appendChild](uunodeswap(innerNode, outerNode));
}

// uu.node.bros - collection brothers(siblings)
function uunodebros(node) { // @param Node: needle
                            // @return NodeArray+Hash: [node, ...] + { first, prev, next, last, index }
                            //      first - Node/null: firstElementSibling
                            //      prev  - Node/null: previousElementSibling
                            //      next  - Node/null: nextElementSibling
                            //      last  - Node/null: lastElementSibling
                            //      index - Number: position index or -1 (TEXT_NODE or COMMENT_NODE)
    var rv = [], i = 0, first = null, last = null, index = -1,
        n = node[_parentNode][_firstChild];

    for (; n; n = n[_nextSibling]) {
        if (n[_nodeType] === 1) { // 1: ELEMENT_NODE
            rv.push(last = n);
            first || (first = n);
            n === node && (index = i); // found index
            ++i;
        }
    }
    // add property
    rv.first = first;
    rv.prev  = rv[index - 1] || null;
    rv.next  = rv[index + 1] || null;
    rv.last  = last;
    rv.index = index;
    return rv;
}

// uu.node.clear - clear all children
function uunodeclear(parent) { // @param Node: parent node
                               // @return Node: parent
    //  [1][clear children]      uu.node.clear(<body>)

    var rv = uutag("", parent), v, i = 0;

    for (; v = rv[i++]; ) {
        uunodeidremove(v);
        uueventunbind(v);
    }
    while (parent[_lastChild]) {
        parent[_removeChild](parent[_lastChild]);
    }
    return parent;
}

// uu.node.clone - clone node, clone Attribute, NodeData, DOM Events
function uunodeclone(parent,  // @param Node: parent node (ElementNode)
                     quick) { // @param Boolean(= false): true is quick clone
                              // @return Node: cloned node
    function cloneData(source,   // @param Node: source node
                       cloned) { // @param Node: cloned node
        var key, i, iz,
            handler = uudata.handler,
            checked = "checked",
            selected = "selected",
            eventData = source[nodeData + "event"],
            evaluator = eventData ? eventData.e : {};

        // new nodeid
//{@mb
        ready.data && (cloned[nodeData + "nodeid"] = 0); // reset
//}@mb
        uunodeid(cloned);

        // bind event
        for (key in evaluator) { // key = eventTypeEx
            for (i = 0, iz = evaluator[key].length; i < iz; ++i) {
                uuevent(cloned, key, evaluator[key][i]);
            }
        }
        // clone UI state (node.checked)
        checked in source && source[checked] && (cloned[checked] = source[checked]);
        selected in source && (cloned[selected] = source[selected]);

        // extras data handler
        for (key in handler) {
            source[key] && handler[key](source, key, cloneNode, { clonedNode: cloned });
        }
    }

//{@mb
    function reverseFetch(nodeArray) { // [IE]
        var i = 0, nodeid, cloned;

        for (; cloned = nodeArray[i++]; ) {
            (nodeid = cloned[nodeData + "nodeid"]) &&
                cloneData(uunodeid(nodeid), cloned); // NodeID -> Node
        }
    }
//}@mb

    function drillDown(node, cloned) { // recursive
        for (; node; node = node[_nextSibling], cloned = cloned[_nextSibling]) {
            if (node[_nodeType] === 1) { // 1: ELEMENT_NODE
                cloneData(node, cloned);
                drillDown(node[_firstChild], cloned[_firstChild]);
            }
        }
    }

    var cloneNode = "cloneNode",
//{@mb
        ready = uuready[cloneNode],
//}@mb
        rv;

//{@mb
    if (parent[_nodeType] === 1) { // 1: ELEMENT_NODE
        if (ready.event || ready.data) { // [IE] cloneNode bugfix
            rv = newNode();
            rv.innerHTML = parent[cloneNode](_true).outerHTML;
            quick ? (rv = rv[_firstChild]) : reverseFetch(uutag("", rv));
        } else {
//}@mb
            rv = parent[cloneNode](_true);
            if (!quick) {
                cloneData(parent, rv);
                drillDown(parent[_firstChild], rv[_firstChild]);
            }
//{@mb
        }
    }
//}@mb
    return rv;
}

// uu.node.remove - remove node, remove nodeid, remove data, remove events
function uunoderemove(node) { // @param Node:
                              // @return Node: node
    uueventunbind(node);
    uunodeidremove(node);

    // extras data handler
    var data, handler = uudata.handler;

    for (data in handler) {
        node[data] && handler[data](node, data, "removeNode");
    }
    node[_parentNode] && node[_parentNode][_removeChild](node);
    return node;
}

// uu.node.normalize - remove CRLF/blank-text/white-space/comment nodes
function uunodenormalize(parent, // @param Node(= <body>): parent node
                         max) {  // @param Number(= 0): max depth, 0 is infinity
                                 // @return Number: removed node count
    // markup blank and comment nodes
    function markup(node, dig, n) {
        for (n = node[_firstChild]; n; n = n[_nextSibling]) {
            switch (n[_nodeType]) {
            case 1: (dig + 1 < max) && markup(n, dig + 1); break; // recursive
            case 3: if (KEEP.test(n.nodeValue)) { // text node
                        break;
                    }
            case 8: nodeArray.push(n); // comment node
            }
        }
    }

    max = max || 9999;
    var nodeArray = [], node, i = 0, KEEP = /\S/;

    markup(parent || doc.body, 0);
    for (; node = nodeArray[i++]; ) {
        node[_parentNode][_removeChild](node); // remove
    }
    return nodeArray.length;
}

// uu.text - node.text / node.innerText accessor
function uutext(data,             // @param String/FormatString/Node: "string" or "format @ string" or node
                text              // @param String/Mix(= void): "textContent"
                /* var_args */) { // @param Mix(= void):
                                  // @return String/Node:
    //  [1][create text node]          uu.text("text")          -> createTextNode("text")
    //  [2][create formated text node] uu.text("@ @", "a", "b") -> createTextNode("a b")
    //  [3][get text]                  uu.text(node)            -> "text"
    //  [4][set text]                  uu.text(node, "text")    -> node
    //  [5][set formated text]         uu.text(node, "@", "a")  -> node

    var args = arguments, az = args.length, undef;

    if (isString(data)) {
        return newText(az < 2 ? data // [1]
                              : uuf.apply(this, args)); // [2]
    }
    if (text === undef) { // [3]
//{@mb
        if (_ie678) { // [IE6][IE7][IE8]
            return data.innerText;
        }
//}@mb
        return data.textContent; // [WEB STD][IE9]
    }
    uunodeadd(newText(az < 3 ? text // [4]
                             : uuf.apply(this, uuarray(args, 1))), // [5]
              uunodeclear(data));
    return data;
}

//{@form
// uu.value - value accessor
function uuvalue(node,    // @param Node:
                 value) { // @param String(= void 0):
                          // @return String/Node:
    //  [1][get value]            uu.value(node) -> value or [value, ...]
    //  [2][set value]            uu.value(node, "value") -> node
    //  [3][get <textarea>]       uu.value(node) -> "innerText"
    //  [4][get <button>]         uu.value(node) -> "<button value>"
    //  [5][get <option>]         uu.value(node) -> "<option value>" or
    //                                              "<option>value</option>"
    //  [6][get <selet>]          uu.value(node) -> selected option value
    //  [7][get <selet multiple>] uu.value(node) -> ["value", ...]
    //  [8][get <input checkbox>] uu.value(node) -> ["value", ...]
    //  [9][get <input radio>]    uu.value(node) -> "value"

    //
    //  type
    //      0: <textarea> <input type="button"> <input type="image"> ...
    //      2: <select>
    //      3: <select multiple>
    //      4: <input type="radio">
    //      5: <input type="checkbox">
    //
    var type = {
            select: node.multiple ? 3 : 2,
            input: { radio: 4, checkbox: 5 }[node.type] || 0
        }[node[_tagName][_toLowerCase]()] || 0,
        ary = type & 2 ? node.options
                       : uuarray(node.name ? doc.getElementsByName(node.name)
                                           : node);

    return (value ? setNodeValue : getNodeValue)(node, type, ary, value);
}

// inner - get node.value
function getNodeValue(node,  // @param Node:
                      type,  // @param Number: nodeType
                      ary) { // @param NodeArray: [node, ...]
                             // @return StringArray/String:
    var rv = [], v, i = 0, multi = type & 1;

    if (type) {
        if (type & 2) { // 2:<select>, 3:<select multiple>
            i = node.selectedIndex;
            if (i >= 0) {
                for (; v = ary[i++]; ) {
                    v.selected && rv.push(v.value || v.text);
                    if (!multi) { // <select>
                        break;
                    }
                }
            }
        } else if (type & 4) { // 4:<input type="radio">, 5:<input type="checkbox">
            for (; v = ary[i++]; ) {
                v.checked && rv.push(v.value);
            }
        }
        rv = multi ? rv : (rv[0] || "");
    } else {
        rv = node.value; // <textarea> <button> <option>
    }
    return rv;
}

// inner - set node.value
function setNodeValue(node,    // @param Node:
                      type,    // @param Number: nodeType
                      ary,     // @param NodeArray: [node, ...]
                      value) { // @param StringArray/Array:
                               // @return Node:
    var v, i = 0, j, k = 0,
        prop = type & 2 ? "selected" : "checked",
        valary = uuarray(value), jz = valary.length;

    if (type) {
        // 2: <select>, 3: <select multiple>
        // 4: <input type="radio">, 5: <input type="checkbox">
        if (ary) {
            if (type & 1) { // 3: <select multiple>, 5: <input type="checkbox">
                for (; v = ary[k++]; ) {
                    v[prop] = _false; // reset current state
                }
            }
            for (; v = ary[i++]; ) {
                for (j = 0; j < jz; ++j) {
                    (v.value || v.text) == valary[j] // 0 == "0"
                        && (v[prop] = _true);
                }
            }
        }
    } else {
        node.value = valary.join(""); // <textarea> <button> <option>
    }
    return node;
}
//}@form

// --- QUERY ---
// uu.query - as document.querySelectorAll
function uuquery(expr,      // @param CSSSelectorExpressionString: "css > selector"
                 context) { // @param Node(= <body>): query context
                            // @return NodeArray: [Node, ...]
    context = context || doc.body;

//{@mb
    if (context.querySelectorAll) {
        if (!_ie || (_env.ie8 && expr[_indexOf](":") < 0)
                 || (_env.ie8 && uuquery.ie8ready.test(expr))) { // IE8 unsupported CSS3 pseudo-class
            if (!uuquery.ngword.test(expr)) {
//}@mb
                return fakeToArray(context.querySelectorAll(expr));
//{@mb
            }
        }
    }

    var token = _tokenCache[expr] || (_tokenCache[expr] = uuquery.tokenizer(expr));

    return token.err ? [] : uuquery.selector(token, context);
//}@mb
}
//{@mb
uuquery.ngword = /\!\=|\:con/;
uuquery.ie8ready = /:(?:focus|hover|link|visited)/;
//}@mb

// uu.id - as document.getElementById
function uuid(expr,      // @param String: id
              context) { // @param Node(= document): query context
                         // @return Node/null:
    return (context || doc).getElementById(expr);
}

// uu.ids - multiple uu.id
function uuids(expr,      // @param CommaJointString: "id1,id2,..."
               context) { // @param Node(= document): query context
                          // @return Node/null:
    //  [1] uu.ids("A,B,C") -> [<a id="A">, <li id="B">, <div id="C">]

    var rv = [], ary = expr.split(","), i = 0, iz = ary.length,
        ctx = context || doc;

    for (; i < iz; ++i) {
        rv.push(ctx.getElementById(ary[i]));
    }
    return rv;
}

// uu.tag - as document.getElementsByTaName
function uutag(expr,      // @param String(= ""): tag name, "" is all
               context) { // @param Node(= <body>): query context
                          // @return NodeArray: [Node, ...]
//{@mb
    if (!_ie678) { // [WEB STD][IE9]
//}@mb
        return toArray.call((context || doc.body).getElementsByTagName(expr || "*"));
//{@mb
    }

    // [IE6][IE7][IE8]
    var rv = [], ri = -1, v, i = 0, skip = (!expr || expr === "*"),
        nodeList = (context || doc.body).getElementsByTagName(expr || "*"),
        iz = nodeList.length;

    // [IE] getElementsByTagName("*") has comment nodes
    for (; i < iz; ++i) {
        v = nodeList[i];
        if (!skip || v[_nodeType] === 1) { // 1: ELEMENT_NODE
            rv[++ri] = v;
        }
    }
    return rv;
//}@mb
}

// uu.match - as document.matchesSelector
function uumatch(expr,      // @param CSSSelectorExpressionString: "css > selector"
                 context) { // @param Node(= <body>): match context
                            // @return Boolean:
    context = context || doc.body;
//{@mb
    if (context.matchesSelector) {
        return context.matchesSelector(expr);
    }
    if (context.webkitMatchesSelector) {
//}@mb
        return context.webkitMatchesSelector(expr);
//{@mb
    }
    if (context.mozMatchesSelector) {
        return context.mozMatchesSelector(expr);
    }
    if (context.msMatchesSelector) {
        return context.msMatchesSelector(expr);
    }

    var node, i = 0, nodeArray = uuquery(expr, doc);

    for (; node = nodeArray[i++]; ) {
        if (node === context) {
            return _true;
        }
    }
    return _false;
//}@mb
}

// --- STRING ---

// uu.fix - fix style property, attribute name
function uufix(source) { // @param String: source
                         // @return String:
    //  [1][css-prop to js-css-prop] uu.fix("background-color") -> "backgroundColor"
    //  [2][std-name to ie-name]     uu.fix("float")            -> "cssFloat" or "styleFloat"(IE)
    //  [3][html-attr to js-attr]    uu.fix("for")              -> "htmlFor"
    //  [4][through]                 uu.fix("-webkit-shadow")   -> "-webkit-shadow"

    return uufix._[source] || source;
}
uufix._ = {}; // { "background-color": "backgroundColor", ... }

// uu.trim - trim both side and inner whitespace
function uutrim(source,        // @param String: " a   b  c "
                replacement) { // @param String(= " "): replacement
                               // @return String: "a b c"
    return source.trim()[_replace](/\s+/g,
                                   replacement === void 0 ? " " : replacement);
}

// uu.trim.tag - uu.trim() + strip tags
function uutrimtag(source) { // @param String:  "  <h1>A</h1>  B  <p>C</p>  "
                             // @return String: "A B C"
    return uutrim(source[_replace](/<\/?[^>]+>/g, ""));
}

// uu.trim.func - uu.trim() + strip "function-name(" ... ")"
function uutrimfunc(source) { // @param String:   '  url("http://...")  '
                              // @return String:  '"http://..."'
    return source[_replace](/^[^\(]+\(|\)\s*$/g, ""); // )
}

// uu.trim.quote - String.trim() + strip double and single quotes
function uutrimquote(source) { // @param String:  ' "quote string" '
                               // @return String: 'quote string'
    return source[_replace](/^\s*["']?|["']?\s*$/g, "");
}

// uu.f - placeholder( "@" ) replacement
function uuf(format) { // @param FormatString: formatted string with "@" placeholder
                       // @return String: "formatted string"
    //  [1][placeholder] uu.format("@ dogs and @", 101, "cats") -> "101 dogs and cats"

    var i = 0, args = arguments;

    return format[_replace](uuf.q, function() {
        return args[++i];
    });
}
uuf.q = /@/g;

//{@sprintf
// uu.sprintf - sprintf (PHP::sprintf like function)
function uusprintf(format            // @param String: sprintf format string
                   /* var_args */) { // @param Mix: sprintf var_args
                                     // @return String: "formatted string"
    // http://d.hatena.ne.jp/uupaa/20091214
    function parse(m, argidx, flag, width, prec, size, types) {
        if (types === "%") {
            return types;
        }
        idx = argidx ? parseInt(argidx) : next++;

        var w = uusprintf.bits[types], ovf, pad, undef,
            v = (av[idx] === undef) ? "" : av[idx];

        w & 3 && (v = w & 1 ? parseInt(v) : parseFloat(v), v = isNaN(v) ? "": v);
        w & 4 && (v = ((types === "s" ? v : types) || "").toString());
        w & 0x20  && (v = v >= 0 ? v : v % 0x100000000 + 0x100000000);
        w & 0x300 && (v = v.toString(w & 0x100 ? 8 : 16));
        w & 0x40  && flag === "#" && (v = (w & 0x100 ? "0" : "0x") + v);
        w & 0x80  && prec && (v = w & 2 ? v.toFixed(prec) : v.slice(0, prec));
        w & 0x400 && (v = uujsonencode(v)); // "%j"
        w & 0x6000 && (ovf = (typeof v !== _number || v < 0));
        w & 0x2000 && (v = ovf ? "" : String.fromCharCode(v));
        w & 0x8000 && (flag = flag === "0" ? "" : flag);
        v = w & 0x1000 ? v.toString().toUpperCase() : v.toString();
        // padding
        if (!(w & 0x800 || width === undef || v.length >= width)) {
            pad = Array(width - v.length + 1).join((!flag ||
                                                    flag === "#") ? " " : flag);
            v = ((w & 0x10 && flag === "0") && !v[_indexOf]("-")) ?
                ("-" + pad + v.slice(1)) : (pad + v);
        }
        return v;
    }

    var next = 1, idx = 0, av = arguments;

    return format[_replace](uusprintf.format, parse);
}
uusprintf.bits = { i: 0x8011, d: 0x8011, u: 0x8021, o: 0x8161, x: 0x8261,
                   X: 0x9261, f: 0x92, c: 0x2800, s: 0x84, j: 0xC00 };
uusprintf.format = /%(?:(\d+)\$)?(#|0)?(\d+)?(?:\.(\d+))?(l)?([%iduoxXfcsj])/g;
//}@sprintf

// --- CODEC ---
//{@codec
// uu.entity - encode String to HTML Entity
function uuentity(str) { // @param String:
                         // @return String:
    return str[_replace](uuentity.to, toEntityHash);
}
uumix(uuentity, {
    to:     /[&<>"]/g,
    from:   /&(?:amp|lt|gt|quot);/g,
    hash:   uuhash('&,&amp;,<,&lt;,>,&gt;,",&quot;,&amp;,&,&lt;,<,&gt;,>,&quot;,"', ","),
    uffff:  /\\u([0-9a-f]{4})/g // \u0000 ~ \uffff
});

// uu.entity.decode - decode String from HTML Entity
function uuentitydecode(str) { // @param String:
                               // @return String:
    return str[_replace](uuentity.from, toEntityHash)
              [_replace](uuentity.uffff, function(m, hex) {
        return String.fromCharCode(parseInt(hex, 16));
    });
}

// inner - to/from entity
function toEntityHash(code) {
    return uuentity.hash[code];
}

// uu.base64 - encode ByteArray to Base64 formated String
function uubase64(data,          // @param String/ByteArray:
                  toURLSafe64) { // @param Boolean(= false):
                                 // @return Base64String/URLSafe64String:
    var rv = [],
        ary = isString(data) ? uuutf8(data) : data,
        c = 0, i = -1, iz = ary.length,
        pad = [0, 2, 1][ary.length % 3],
        num2bb = _num2bb,
        num2b64 = _num2b64;

    if (win.btoa && !toURLSafe64) {
        while (i < iz) {
            rv.push(num2bb[ary[++i]]);
        }
        return btoa(rv.join(""));
    }
    --iz;
    while (i < iz) {
        c = (ary[++i] << 16) | (ary[++i] << 8) | (ary[++i]); // 24bit
        rv.push(num2b64[(c >> 18) & 0x3f], num2b64[(c >> 12) & 0x3f],
                num2b64[(c >>  6) & 0x3f], num2b64[ c        & 0x3f]);
    }
    pad > 1 && (rv[rv.length - 2] = "=");
    pad > 0 && (rv[rv.length - 1] = "=");
    return toURLSafe64 ? rv.join("")[_replace](/\=+$/g, "")[_replace](/\+/g, "-")
                                                           [_replace](/\//g, "_")
                       : rv.join("");
}

// uu.base64.decode - decode Base64 formated String to ByteArray
function uubase64decode(data,          // @param Base64String/URLSafe64String:
                        toByteArray) { // @param Boolean(= false): true is ByteArray result
                                       // @return String/ByteArray:
    var rv = [], c = 0, i = -1,
        ary = data.split(""),
        iz = data.length - 1,
        b642num = _b642num;

    while (i < iz) {                  // 00000000|00000000|00000000 (24bit)
        c = (b642num[ary[++i]] << 18) // 111111  |        |
          | (b642num[ary[++i]] << 12) //       11|1111    |
          | (b642num[ary[++i]] <<  6) //         |    1111|11
          |  b642num[ary[++i]]        //         |        |  111111
        rv.push((c >> 16) & 0xff, (c >> 8) & 0xff, c & 0xff);
    }
    rv.length -= [0, 0, 2, 1][data[_replace](/\=+$/, "").length % 4]; // cut tail

    return toByteArray ? rv : uuutf8decode(rv);
}

// uu.utf8 - String to UTF8ByteArray
function uuutf8(str) { // @param String: JavaScript string
                       // @return UTF8ByteArray: [ Number(utf8), ... ]
    var rv = [], iz = str.length, c = 0, i = 0;

    for (; i < iz; ++i) {
        c = str.charCodeAt(i);
        if (c < 0x80) { // ASCII(0x00 ~ 0x7f)
            rv.push(c & 0x7f);
        } else if (c < 0x0800) {
            rv.push(((c >>>  6) & 0x1f) | 0xc0, (c & 0x3f) | 0x80);
        } else if (c < 0x10000) {
            rv.push(((c >>> 12) & 0x0f) | 0xe0,
                    ((c >>>  6) & 0x3f) | 0x80, (c & 0x3f) | 0x80);
        }
    }
    return rv;
}

// uu.utf8.decode - UTF8ByteArray to String
function uuutf8decode(byteArray,  // @param UTF8ByteArray: [ Number(utf8), ... ]
                      startIndex, // @param Number(= 0):
                      endIndex) { // @param Number(= void):
                                  // @return String: JavaScript string
    var rv = [], ri = -1, iz = endIndex || byteArray.length, c = 0,
        i = startIndex || 0;

    if (iz > byteArray.length) {
        iz = byteArray.length;
    }

    for (; i < iz; ++i) {
        c = byteArray[i]; // first byte
        if (c < 0x80) { // ASCII(0x00 ~ 0x7f)
            rv[++ri] = c;
        } else if (c < 0xe0) {
            rv[++ri] = (c & 0x1f) <<  6 | (byteArray[++i] & 0x3f);
        } else if (c < 0xf0) {
            rv[++ri] = (c & 0x0f) << 12 | (byteArray[++i] & 0x3f) << 6
                                        | (byteArray[++i] & 0x3f);
        }
    }
    return String.fromCharCode.apply(null, rv);
}

//{@md5
// uu.md5 - encode
function uumd5(data) { // @param ASCIIString/ByteArray:
                       // @return HexString:
    return calcHash(data, "MD5");
}
//}@md5

//{@sha1
// uu.sha1 - encode
function uusha1(data) { // @param ASCIIString/ByteArray:
                        // @return HexString:
    return calcHash(data, "SHA1");
}
//}@sha1

// inner - calc hash
function calcHash(data,   // @param ASCIIString/ByteArray:
                  type) { // @param String: Hash Type
    var rv = [], hash, i, iz, c, _0xff = 0xff, n2h = _num2hh;

    // --- String to ByteArray ---
    if (isString(data)) {
        for (i = 0, iz = data.length; i < iz; ++i) {
            rv[i] = data.charCodeAt(i) & _0xff;
        }
    } else {
        rv = data.concat(); // clone
    }
    i = rv.length, c = i;

    // --- padding ---
    rv[i++] = 0x80;

    while (i % 64 !== 56) {
        rv[i++] = 0;
    }
    c *= 8;
    switch (type) {
//{@md5
    case "MD5":
        rv.push(c & _0xff, c >> 8 & _0xff, c >> 16 & _0xff, c >> 24 & _0xff,
                0, 0, 0, 0);
        hash = MD5(rv);
        for (rv = [], i = 0, iz = hash.length; i < iz; ++i) {
            rv.push(n2h[hash[i]       & _0xff], n2h[hash[i] >>  8 & _0xff],
                    n2h[hash[i] >> 16 & _0xff], n2h[hash[i] >> 24 & _0xff]);
        }
        break;
//}@md5
//{@sha1
    case "SHA1":
        rv.push(0, 0, 0, 0,
                c >> 24 & _0xff, c >> 16 & _0xff, c >> 8 & _0xff, c & _0xff);
        hash = SHA1(rv);
        for (rv = [], i = 0, iz = hash.length; i < iz; ++i) {
            rv.push(n2h[hash[i] >> 24 & _0xff], n2h[hash[i] >> 16 & _0xff],
                    n2h[hash[i] >>  8 & _0xff], n2h[hash[i]       & _0xff]);
        }
        break;
//}@sha1
    default:
        rv = [];
    }
    return rv.join("");
}

//{@md5
uumix(uumd5, {
    A: [0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee, 0xf57c0faf, 0x4787c62a,
        0xa8304613, 0xfd469501, 0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be,
        0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821, 0xf61e2562, 0xc040b340,
        0x265e5a51, 0xe9b6c7aa, 0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
        0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed, 0xa9e3e905, 0xfcefa3f8,
        0x676f02d9, 0x8d2a4c8a, 0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c,
        0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70, 0x289b7ec6, 0xeaa127fa,
        0xd4ef3085, 0x04881d05, 0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
        0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039, 0x655b59c3, 0x8f0ccc92,
        0xffeff47d, 0x85845dd1, 0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1,
        0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391],
    S: [7, 12, 17, 22,  7, 12, 17, 22,  7, 12, 17, 22,  7, 12, 17, 22,
        5,  9, 14, 20,  5,  9, 14, 20,  5,  9, 14, 20,  5,  9, 14, 20,
        4, 11, 16, 23,  4, 11, 16, 23,  4, 11, 16, 23,  4, 11, 16, 23,
        6, 10, 15, 21,  6, 10, 15, 21,  6, 10, 15, 21,  6, 10, 15, 21],
    X: [0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15,
        1,  6, 11,  0,  5, 10, 15,  4,  9, 14,  3,  8, 13,  2,  7, 12,
        5,  8, 11, 14,  1,  4,  7, 10, 13,  0,  3,  6,  9, 12, 15,  2,
        0,  7, 14,  5, 12,  3, 10,  1,  8, 15,  6, 13,  4, 11,  2,  9]
});

// inner - calc MD5
function MD5(data) { // @param ByteArray:
                     // @return ByteArray:
    var a = 0x67452301, b = 0xefcdab89, c = 0x98badcfe, d = 0x10325476,
        aa, bb, cc, dd, ra, rb, rc,
        A = uumd5.A, S = uumd5.S, X = uumd5.X,
        i = 0, iz = data.length, j, k, n, word = [];

    for (; i < iz; i += 64) {
        for (j = 0; j < 16; ++j) {
            k = i + j * 4;
            word[j] = data[k] + (data[k + 1] <<  8)
                              + (data[k + 2] << 16)
                              + (data[k + 3] << 24);
        }
        aa = a, bb = b, cc = c, dd = d;

        for (j = 0; j < 64; ++j) {
            n = j < 16 ? (b & c) | (~b & d) // ff - Round 1
              : j < 32 ? (b & d) | (c & ~d) // gg - Round 2
              : j < 48 ?  b ^ c ^ d         // hh - Round 3
                       :  c ^ (b | ~d);     // ii - Round 4
            n += a + word[X[j]] + A[j];

            ra = b + ((n << S[j]) | (n >>> (32 - S[j])));
            rb = b;
            rc = c;
            // rotate
            a = d, b = ra, c = rb, d = rc;
        }
        a += aa, b += bb, c += cc, d += dd;
    }
    return [a, b, c, d];
}
//}@md5

//{@sha1
// inner - calc SHA-1
function SHA1(data) { // @param ByteArray:
                      // @return ByteArray:
    var a = 0x67452301, b = 0xefcdab89, c = 0x98badcfe, d = 0x10325476,
        e = 0xc3d2e1f0, aa, bb, cc, dd, ee,
        i = 0, iz = data.length, j, jz, n, n16 = [];

    for (; i < iz; i += 64) {
        aa = a, bb = b, cc = c, dd = d, ee = e;

        for (j = i, jz = i + 64, n = 0; j < jz; j += 4, ++n) {
            n16[n] = (data[j]     << 24) | (data[j + 1] << 16) |
                     (data[j + 2] <<  8) |  data[j + 3];
        }
        for (j = 16; j < 80; ++j) {
            n = n16[j - 3] ^ n16[j - 8] ^ n16[j - 14] ^ n16[j - 16];
            n16[j] = (n << 1) | (n >>> 31);
        }
        for (j = 0; j < 80; ++j) {
            n = j < 20 ? ((b & c) ^ (~b & d))           + 0x5a827999
              : j < 40 ?  (b ^ c ^ d)                   + 0x6ed9eba1
              : j < 60 ? ((b & c) ^  (b & d) ^ (c & d)) + 0x8f1bbcdc
                       :  (b ^ c ^ d)                   + 0xca62c1d6;
            n += ((a << 5) | (a >>> 27)) + n16[j] + e;

            e = d, d = c, c = (b << 30) | (b >>> 2), b = a, a = n;
        }
        a += aa, b += bb, c += cc, d += dd, e += ee;
    }
    return [a, b, c, d, e];
}
//}@sha1

// --- init ---
(function(base, i) {
    _num2b64 = base.split(""); // ["A", "B", ... "/"]
    _b642num = { "=": 0, "-": 62, "_": 63 }; // URLSafe64 chars("-", "_")

    for (; i < 64; ++i) {
        _b642num[base.charAt(i)] = i;
    }
})("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", 0);
//}@codec

// --- URL ---
//{@url
// uu.url - url accessor
function uuurl(url) { // @param URLHash/URLString(= ""):
                      // @return URLString/URLHash/null:
    return !url ? uuurlabs.curt // [1]
                : (isString(url) ? parseURL
                                 : buildURL)(url); // [2][3]
}

// uu.url.abs - convert relative URL to absolute URL
function uuurlabs(url,          // @param URLString(= "."): rel/abs URL
                  currentDir) { // @param URLString(= ""): current dir
                                // @return URLString: absolute URL
    return (!url || url === ".") ? uuurlabs.curt : toAbsURL(url, currentDir);
}
uuurlabs.curt = toAbsURL("."); // current absolute-url cache

// inner - to absolute url
function toAbsURL(url,          // @param String:
                  currentDir) { // @param String:
                                // @return String:
/*
    if (!/^(?:file|https?):/.test(url)) { // no scheme
        var div = newNode();

        div.innerHTML = '<a href="' + (currentDir || "") + url + '" />';
        url = div[_firstChild] ? div[_firstChild].href
                               : /href\="([^"]+)"/.exec(div.innerHTML)[1];
    }
    return url[_replace](/&amp;|&/g, ";"); // "&" -> ";"
 */
    if (!/^(?:file|https?):/.test(url)) { // no scheme
        var a = newNode("a");

        a[_setAttribute]("href", (currentDir || "") + url);
        url = a.cloneNode(_false).href;
    }
    return url[_replace](/&amp;|&/g, ";"); // "&" -> ";"
}

// uu.url.dir - absolute path to absolute directory(chop filename)
function uuurldir(url) { // @param URLString/PathString: url or path
                         // @return String: directory path, has tail "/"
    var ary = url.split("/");

    ary.pop(); // chop "file.ext"
    return ary.join("/") + "/";
}

// inner - build URL
function buildURL(hash) { // @param URLHash:
                          // @return URLString: "scheme://domain:port/path?qs#fragment"
    return [hash.scheme, "://", hash.domain,
            hash.port     ? ":" + hash.port     : "", hash.path || "/",
            hash.qs       ? "?" + hash.qs       : "",
            hash.fragment ? "#" + hash.fragment : ""].join("");
}

// inner - parse URL
function parseURL(url) { // @param URLString:
                         // @return URLHash/null: null is fail,
    var m, w = ["/", ""], abs = uuurlabs(url);

    m = parseURL.file.exec(abs);
    if (m) {
        w = uuurlsplit(m[1]);
        return { url: abs, scheme: "file", domain: "", port: "",
                 base: "file:///" + w[0], path: m[1], dir: w[0],
                 file: w[1], qs: "", hash: m[2] ? parseQueryString(m[2]) : {},
                 fragment: m[3] || "" };
    }
    m = parseURL.http.exec(abs);
    if (m) {
        m[4] && (w = uuurlsplit(m[4]));
        return { url: abs, scheme: m[1], domain: m[2], port: m[3] || "",
                 base: (m[1] + "://" + m[2]) + (m[3] ? ":" + m[3] : "") + w[0],
                 path: m[4] || "/", dir: w[0], file: w[1], qs: m[5] || "",
                 hash: m[5] ? parseQueryString(m[5]) : {}, fragment: m[6] || "" };
    }
    return null;
}
parseURL.file = /^file:\/\/(?:\/)?(?:loc\w+\/)?([^ ?#]*)(?:\?([^#]*))?(?:#(.*))?/i;
parseURL.http = /^(\w+):\/\/([^\/:]+)(?::(\d*))?([^ ?#]*)(?:\?([^#]*))?(?:#(.*))?/i;

// uu.url.split - split dir/file "dir/file.ext" -> ["dir/", "file.ext"]
function uuurlsplit(url) { // @param URLString/PathString: url or path
                           // @return Array+Hash: ["dir/", "file.ext"] + { dir: "dir/", file: "file.ext" }
    var rv = [], ary = url.split("/");

    rv[1] = rv.file = ary.pop(); // file
    rv[0] = rv.dir  = ary.join("/") + "/";
    return rv;
}

// uu.qs - query string accessor
function uuqs(queryString, // @param QueryString/Hash:
              add) {       // @param Hash:
                           // @return QueryString/Hash:
    var rv, isstr = isString(queryString), i;

    if (add) {
        rv = isstr ? parseQueryString(queryString) : queryString;
        for (i in add) {
            rv[i] = add[i];
        }
        return buildQueryString(rv);
    }
    return (isstr ? parseQueryString : buildQueryString)(queryString); // [1][2]
}

// inner - build query string
function buildQueryString(queryString) { // @param Hash: { key: "val", key2: "val2" }
                                         // @return QueryString: "key=val;key2=val2"
    var rv = [], i, fn = encodeURIComponent;

    for (i in queryString) {
        rv.push(fn(i) + "=" + fn(queryString[i]));
    }
    return rv.join(";");
}

// inner - parse query string
function parseQueryString(queryString) { // @param URLString/QueryString: "key=val;key2=val2"
                                         // @return Hash: { key: value, ... }
    function _parse(m, key, value) {
        return rv[fn(key)] = fn(value);
    }
    var rv = {}, fn = decodeURIComponent;

    if (queryString[_indexOf]("?") >= 0) { // [1]
        return parseURL(queryString).hash;
    }
    queryString[_replace](/&amp;|&/g, ";")
               [_replace](/(?:([^\=]+)\=([^\;]+);?)/g, _parse); // [2]
    return rv;
}
//}@url

// --- DEBUG ---

//{@canvas
// uu.hatch - draw hatch pattern
function uuhatch(param) { // @param Hash: { size, unit, color, color2 }
                          //   size - Number(= 10):
                          //   unit - Number(= 5):
                          //   color - String(= "skyblue"):
                          //   color2 - String(= "steelblue"):
                          // @return Boolean: trus is draw, false is ng
    if (uuready.canvas) {
        var p = uuarg(param, { size: 10, unit: 5,
                               color: "#87ceeb", color2: "#4682b4" }),
            x = p.size, y = p.size, i = 1, j = 1,
            vp = uuviewport(),
            w = parseInt(vp.innerWidth),
            h = parseInt(vp.innerHeight),
            canvas, ctx;

        try {
            canvas = newNode("canvas");
            canvas.width = w;
            canvas.height = h;
            canvas.style.cssText = "position:absolute;z-index:-100";
            uunodeadd(canvas, doc.body, "first");

            ctx = canvas.getContext("2d");
            ctx.lineWidth = 0.2;

            for (; x < w; ++i, x += p.size) {
                ctx.strokeStyle = (i % p.unit) ? p.color : p.color2;
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, h);
                ctx.stroke();
                ctx.closePath();
            }
            for (; y < h; ++j, y += p.size) {
                ctx.strokeStyle = (j % p.unit) ? p.color : p.color2;
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(w, y);
                ctx.stroke();
                ctx.closePath();
            }
            return _true;
        } catch(err) {}
    }
    return _false;
}
//}@canvas

// uu.glow - glow node
function uuglow(node) { // @param Node/NodeArray/NodeList/NodeSet/CSSSelectorExpressionString:
//{@fx
    var ary = isString(node) ? uuquery(node)
                             : node[nodeSet] ? node[nodeSet]
                                             : node[_nodeType] ? [node]
                                                               : node;
    Array.isArray(ary) || (ary = uuarray(ary));

    uueach(ary, function(node) {
        var bgc = uucssbgcolor(node, "transparent"),
            undo = function(node, option, back) {
                back && uucss(node, { bgc: bgc });
            };

        uufx(node, 200, { bgc: "#f33", reverse: 1, _after: undo });
    });
//}@fx
}

// uu.puff - alert( uu.json(mix) )
function uupuff(source                   // @param Mix/FormatString: source object
                                         //                          or "format @ string"
                /* , var_args, ... */) { // @param Mix: var_args
    var args = arguments;

    alert(args.length > 1 || isString(source) ? uuf.apply(this, args)
                                              : uujsonencode(source, 0, 1));
}

// uu.log - add log
function uulog(log                      // @param Mix: log data
               /* , var_args, ... */) { // @param Mix: var_args
    var args = arguments, context = uuid("uulog"),
        txt = args.length > 1 || isString(log) ? uuf.apply(this, args)
                                               : uujsonencode(log, 0, 1);

    context || uunodeadd(context = uu.ol({ id: "uulog" }));

    uulog.max < uutag("", context).length && (context.innerHTML = "");

    uunodeadd(uu[/OL|UL/.test(context[_tagName]) ? "li" : "p"](newText(txt)),
              context);
}
uulog.max = 30; // max items

// uu.log.clear
function uulogclear() {
    var context = uuid("uulog");

    context && uunodeclear(context);
}

// --- UNIT TEST ---
//{@test

// uu.ok - unit test
function uuok(title,    // @param String: title
              lval,     // @param Mix: left handset
              operator, // @param String: operator
              rval,     // @param Mix(= void): right handset
              more) {   // @param String(= void): more info
                        // @return Hash/void: { ok, ng, ms, total }
                        //  ok - Number: truly count
                        //  ng - Number: falsy count
                        //  ms - Number: Elapsed time (unit: ms)
                        //  total - Number: ok + ng
                        // @throws Error from judge()
    //  [1][test]           uu.ok("title", 1, "===", 1, "more info")
    //  [2][add separater]  uu.ok("separater comment")
    //  [3][get/show score] uu.ok() -> { ok, ng, ms, total }

    var rv, r, tm, db = uuok.db, ol, undef;

    if (operator) {
        tm = +new Date;
        r = uuokjudge(lval, operator, rval);
//{@debug
        if (!r) {
            debugger;
        }
//}@debug
        tm = ((+new Date) - tm);
        ++db[r ? "ok" : "ng"];
        ++db.total;
        db.ms += tm;
        //  <li style="...">
        //      <span>title</span><b>(.. ms)</b><br />
        //      <span>lval operator rval</span><br />
        //      <span>more</span>
        //  </li>
        db.row.push(
            uuf(uuok.fmt.join(""),
                uuok.bgc[r + (db.row.length % 2) * 4], uuentity(title),
                tm > 0 ? "<b>(" + tm + " ms)</b>" : "",
                uujsonencode(lval, 1),
                operator,
                rval === undef ? "" : uujsonencode(rval, 1),
                more || ""));

    } else if (isString(title)) {
        db.row.push(
            uuf(uuok.fmt[0] + uuok.fmt[2],
                uuok.bgc[2 + (db.row.length % 2) * 4], uuentity(title)));
    } else {
        rv = uuclone(db);
        db.ng && uucss(doc.body, { bgc: uuok.bgc[0] });
        ol = uuid("uuok") || doc.body[_appendChild](uu.ol("id,uuok"));
        ol.innerHTML += db.row.join("");

        uuok.db = { ok: 0, ng: 0, total: 0, ms: 0, row: [] }; // reset
        return rv;
    }
}
uuok.fmt = ['<li style="line-height:1.5;padding:5px;background-color:@">',
            '<span>@</span> @ <br /><span>@ @ @</span><br />',
            '<span>@</span></li>'];
uuok.db = { ok: 0, ng: 0, total: 0, ms: 0, row: [] };
uuok.bgc = { 0: "#fcd", 1: "#dfc", 2: "#80c65a",   // 0 is ng, 1 is ok, 2 is title
             4: "#fac", 5: "#cfa", 6: "#72bf47" };

// inner -
function uuokjudge(lval,     // @param Mix: left hand set
                   operator, // @param String: operator
                   rval) {   // @param Mix(= void): right hand set
                             // @return Number: 0 is false, 1 is true
                             // @throws Error("BAD_OPERATOR")
    var rv, ope = uutrim(operator.toUpperCase(), "");

    if (ope === "===") {
        rv = lval.valueOf() == rval.valueOf();
    } else if (ope === "!==") {
        rv = lval.valueOf() != rval.valueOf();
    } else {
        switch (ope) {
        case "IS":
        case "==":  rv =  uulike(lval, rval); break;
        case "!=":  rv = !uulike(lval, rval); break;
        case ">":   rv = lval >  rval; break;
        case ">=":  rv = lval >= rval; break;
        case "<":   rv = lval <  rval; break;
        case "<=":  rv = lval <= rval; break;
        case "&&":  rv = !!(lval && rval); break;
        case "||":  rv = !!(lval || rval); break;
        case "HAS": rv = isString(lval) ? lval[_indexOf](rval) > 0
                                       : uuhas(lval, rval); break;
        case "ISNAN":     rv = isNaN(lval); break;
        case "ISTRUE":    rv = !!lval; break;
        case "ISFALSE":   rv =  !lval; break;
        case "ISERROR":   try { lval(), rv = 0; } catch(err) { rv = 1; } break;
        case "ISINFINITY":rv = !isFinite(lval); break;
        case "INSTANCEOF":rv = lval instanceof rval; break;
        default:
            ope = ope[_replace](/IS/, "");
            rv = isFunction(uutype[ope]) ? uutype[ope](lval, ope) // extend types
               : uutype[ope] ? uutype(lval) === uutype[ope] : 2;
            if (rv === 2) {
                throw new Error("BAD_OPERATOR " + operator);
            }
        }
    }
    return +rv;
}

// uu.ng - assert
function uung(title,    // @param String: title
              lval,     // @param Mix: left handset
              operator, // @param String: operator
              rval) {   // @param Mix(= void): right handset
                        // @throws Error from judge()
    var r = uuokjudge(lval, operator, rval);

    if (!r) {
//{@debug
        debugger;
//}@debug
        throw new Error(uuf("@: @ @ @", title,
                            uujsonencode(lval, 1), operator,
                            rval ? uujsonencode(rval, 1) : ""));
    }
}
//}@test

// --- JSON ---
// uu.json - mix to JSONString
function uujson(source, // @param Mix:
                alt) {  // @param Boolean(= false): false is JSON.stringify
                        //                          true is js impl(uu.json.encode)
                        // @return JSONString:
    return (alt || !JSON) ? uujsonencode(source, 1)
                          : source === void 0 ? "" // [IE8] undefined -> "undefined" bugfix
                                              : (JSON.stringify(source) || "");
}
uujson.x = [
    /[^,:{}\[\]0-9\.\-+Eaeflnr-u \n\r\t]/,                      // x[0] NGWORDS
    /"(\\.|[^"\\])*"/g,                                         // x[1] UNESCAPE
    /(?:\"|\\[bfnrt\\])/g,                                      // x[2] ESCAPE
    uuhash('",\\",\b,\\b,\f,\\f,\n,\\n,\r,\\r,\t,\\t,\\,\\\\'), // x[3] SWAP ENTITY
    /[\x00-\x1f]/g];                                            // x[4] NON-ASCII TO UNICODE ENTITY

// uu.json.decode - decode JSONString
function uujsondecode(jsonString, // @param JSONString:
                      alt) {      // @param Boolean(= false): false is JSON.parse
                                  //                          true is js impl(uu.json.decode)
                                  // @return Mix/Boolean: false is error
    var str = jsonString.trim(), x = uujson.x;

    return (alt || !JSON) ? (x[0].test(str[_replace](x[1], ""))
                                ? _false
                                : (new Function("return " + str))())
                          : JSON.parse(str);
}

// inner - json inspect
function uujsonencode(mix,     // @param Mix: value
                      esc,     // @param Boolean(= false): escape
                      space) { // @param Boolean(= false): add space
    var ary = [], type = uutype(mix), w, ai = -1, i, iz, q = '"', x,
        sp = space ? " " : "";

    if (mix === win) {
        return '"window"'; // window -> String("window")
    }
    // Class Instance -> '"ClassName"'
    if (type === uutype.HASH && mix.name && uu.Class[mix.name] &&
        mix instanceof uu.Class[mix.name]) {
        return q + mix.name + q;
    }
    switch (type) {
    case uutype.FUNCTION:   // Class -> "ClassName"
                            if (mix in uu.Class) { // #ref uuclass[Class].toString
                                return mix + "";
                            }
                            // Function -> "FunctionName():": { ... }
                            w = mix.name;
//{@mb
                            if (!w && (_ie || _opera)) { // [IE][OPERA] IE or Opera9.6x~10.10
                                w = mix + ""; // Function.toString()
                                w = w.slice(9, w[_indexOf]("(")); // )
                            }
//}@mb
                            ary.push('"function"' + ":" + sp + q + w + q);
                            ++ai;
    case uutype.HASH:       break;
    case uutype.NULL:
    case uutype.BOOLEAN:    return mix + "";
    case uutype.NODE:       return q + uunodepath(mix) + q; // node path
    case uutype.DATE:       return mix.toJSON();
    case uutype.NUMBER:     return isFinite(mix) ? mix + "" : "null";
    case uutype.STRING:
        x = uujson.x;
        return q + mix.replace(x[2], function(m) {
                       return x[3][m] || m;
                   }).replace(x[4], function(s) {
                       return "\\u00" + _num2hh[s.charCodeAt(0)];
                   }) + q;
    case uutype.ARRAY:
    case uutype.FAKEARRAY:
        for (i = 0, iz = mix.length; i < iz; ++i) {
            ary[++ai] = uujsonencode(mix[i], esc, space);
        }
        return "[" + ary.join("," + sp) + "]";
    default: // UNDEFINED
        return "";
    }
    if (toString.call(type).slice(-3) === "on]") { // [object CSSStyleDeclaration]
        w = _webkit;
        for (i in mix) {
            if (typeof mix[i] === _string && (w || i != (+i + ""))) { // isFinite(i)
                w && (i = mix.item(i));
                ary[++ai] = q + i + q + ':' + sp + q + mix[i] + q;
            }
        }
    } else { // is Hash
        for (i in mix) {
            mix[_hasOwnProperty](i) &&
                (ary[++ai] = q + i + q + ":" + sp + uujsonencode(mix[i], esc, space));
        }
    }
    return "{" + sp + ary.join("," + sp) + sp + "}";
}

// --- date ---

// uu.date - date accessor
function uudate(source) { // @param DateHash/Date/Number/String(= void):
                          // @return DateHash:
    //  [1][get now]                 uu.date() -> DateHash
    //  [2][DateHash]                uu.date(DateHash) -> cloned DateHash
    //  [2][date to hash]            uu.date(Date) -> DateHash
    //  [3][time to hash]            uu.date(milliseconds) -> DateHash
    //  [4][DateString to hash]      uu.date("2000-01-01T00:00:00[.000]Z") -> DateHash
    //  [5][ISO8601String to hash]   uu.date("2000-01-01T00:00:00[.000]Z") -> DateHash
    //  [6][RFC1123String to hash]   uu.date("Wed, 16 Sep 2009 16:18:14 GMT") -> DateHash

    return source === void 0              ? _date2hash(new Date())       // [1] uu.date()
         : uutype(source) === uutype.DATE ? _date2hash(source)           // [3] uu.date(new Date())
         : isNumber(source)               ? _date2hash(new Date(source)) // [4] uu.date(1234567)
         : source.ISO                     ? uuclone(source)              // [2] uu.date(DateHash)
         : _date2hash(_str2date(source) || new Date(source));            // [5][6][7]
}
uudate.x = [
    /^(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)(?:\.(\d*))?Z$/, // x[0] PARSE
    /^([\w]+) (\w+) (\w+)/];                                     // x[1] DATE FORMAT

// inner - convert Date to DateHash
function _date2hash(date) { // @param Date:
                            // @return Hash: { Y: 2010, M: 1~12, D: 1~31,
                            //                 h: 0~23, m: 0~59, s: 0~59, ms: 0~999,
                            //                 time: unix_time, ISO: func(), GMT: func() }
    return {
        Y:      date.getUTCFullYear(),      M:      date.getUTCMonth() + 1,
        D:      date.getUTCDate(),          h:      date.getUTCHours(),
        m:      date.getUTCMinutes(),       s:      date.getUTCSeconds(),
        ms:     date.getUTCMilliseconds(),  time:   date.getTime(),
        ISO:    datehashiso,                GMT:    datehashgmt,
        valueOf: function() { // @return Number:
            return date.getTime();
        },
        toString: function() { // @return ISODateString:
            return this.ISO();
        }
    };
}

// "2000-01-01T00:00:00[.000]Z"    -> Date
// "Wed, 16 Sep 2009 16:18:14 GMT" -> Date

// inner - DateString to Date
function _str2date(str) { // @param ISO8601DateString/RFC1123DateString:
                          // @return Date:
    function _toDate(_, dayOfWeek, day, month) {
        return dayOfWeek + " " + month + " " + day;
    }

    var x = uudate.x, m = x[0].exec(str);

    if (m) {
        return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3],      // yyyy-mm-dd
                                 +m[4], +m[5], +m[6], +m[7])); // hh:mm:ss.ms
    }
//{@mb
    if (_ie && str[_indexOf]("GMT") > 0) { // [IE6][IE7][IE8][IE9]
        str = str[_replace](/GMT/, "UTC");
    }
//}@mb
    return new Date(str[_replace](",", "")
                       [_replace](x[1], _toDate));
}

// DateHash.ISO - encode DateHash To ISO8601String
function datehashiso() { // @return ISO8601DateString: "2000-01-01T00:00:00.000Z"
    var that = this;

    return uuf("@-@-@T@:@:@.@Z",
               that.Y, _num2dd[that.M], _num2dd[that.D],
               _num2dd[that.h], _num2dd[that.m],
               _num2dd[that.s], ("00" + that.ms).slice(-3) + that.ms);
}

// DateHash.GMT - encode DateHash To RFC1123String
function datehashgmt() { // @return RFC1123DateString: "Wed, 16 Sep 2009 16:18:14 GMT"
    var rv = (new Date(this.time)).toUTCString();

//{@mb
    if (_ie && rv[_indexOf]("UTC") > 0) { // [IE6][IE7][IE8][IE9]
        // http://d.hatena.ne.jp/uupaa/20080515
        //
        // (new Date).toString() -> "Thu Sep 16 16:26:32 UTC+0900 2010"
        //                       -> "Thu Sep 16 16:26:32 GMT+0900 2010"
        rv = rv[_replace](/UTC/, "GMT");
        (rv.length < 29) && (rv = rv[_replace](/, /, ", 0")); // [IE] fix format
    }
//}@mb
    return rv;
}

// --- COLOR ---
//{@color
// uu.Class.Color - constructor
function Color(r,   // @param Number: red   (0 ~ 255)
               g,   // @param Number: green (0 ~ 255)
               b,   // @param Number: blue  (0 ~ 255)
               a) { // @param Number: alpha (0.0 ~ 1.0)
                    // @return this:
    this.r = r = (r < 0 ? 0 : r > 255 ? 255 : r) | 0;
    this.g = g = (g < 0 ? 0 : g > 255 ? 255 : g) | 0;
    this.b = b = (b < 0 ? 0 : b > 255 ? 255 : b) | 0;
    this.a = a =  a < 0 ? 0 : a >   1 ?   1 : a;
    this.hex = "#" + _num2hh[r] + _num2hh[g] + _num2hh[b];
    this.num = (r << 16) + (g << 8) + b;
    this.rgba = "rgba(" + r + "," + g + "," + b + "," + a + ")";
}
Color[_prototype] = {
    toString:   function() { // @return String: "#000000" or "rgba(0,0,0,0)"
                    return uuready.color.rgba ? this.rgba : this.hex;
                },
    argb:       function() { // @return String: "#ffffffff"
                    return "#" + _num2hh[(this.a * 255) & 0xff] +
                           _num2hh[this.r] + _num2hh[this.g] + _num2hh[this.b];
                },
    hsla:       function() { // @return Hash: { h, s, l, a }
                    return rgba2hsla(this.r, this.g, this.b, this.a);
                },
    gray:       function() { // @return Color:
                    return new Color(this.g, this.g, this.g, this.a);
                },
    sepia:      function() { // @return Color:
                    var y = 0.2990 * this.r + 0.5870 * this.g + 0.1140 * this.b,
                        u = -0.091, v = 0.056;

                    return new Color((y + 1.4026 * v) * 1.2,
                                      y - 0.3444 * u - 0.7114 * v,
                                     (y + 1.7330 * u) * 0.8, this.a);
                },
    comple:     function() { // @return Color:
                    return new Color(this.r ^ 255, this.g ^ 255,
                                     this.b ^ 255, this.a);
                },
    arrange:    // Color.arrange - arrangemented color(Hue, Saturation and Lightness)
                //    Hue is absolure value,
                //    Saturation and Lightness is relative value.
                function(h,   // @param Number(= 0): Hue        (-360 ~ 360)
                         s,   // @param Number(= 0): Saturation (-100 ~ 100)
                         l) { // @param Number(= 0): Lightness  (-100 ~ 100)
                              // @return Color:
                    var rv = rgba2hsla(this.r, this.g, this.b, this.a);

                    rv.h += h;
                    rv.h = (rv.h > 360) ? rv.h - 360 : (rv.h < 0) ? rv.h + 360 : rv.h;
                    rv.s += s;
                    rv.s = (rv.s > 100) ? 100 : (rv.s < 0) ? 0 : rv.s;
                    rv.l += l;
                    rv.l = (rv.l > 100) ? 100 : (rv.l < 0) ? 0 : rv.l;
                    return hsla2color(rv.h, rv.s, rv.l, rv.a);
                }
};
uuclass.Color = Color; // uu.Class.Color

// uu.color - parse color
function uucolor(expr) { // @parem Color/HSLAHash/RGBAHash/String: "black", "#fff", "rgba(0,0,0,0)"
                         // @return Color:
    //  [1][Color]                     uu.color(Color)               -> Color
    //  [2][RGBAHash/HSLAHash to hash] uu.color({ h:0,s:0,l:0,a:1 }) -> Color
    //  [3][W3CNamedColor to hash]     uu.color("black")             -> Color
    //  [4]["#000..." to hash]         uu.color("#000")              -> Color
    //  [5]["rgba(,,,,)" to hash]      uu.color("rgba(0,0,0,1)")     -> Color
    //  [6]["hsla(,,,,) to hash]       uu.color("hsla(360,1%,1%,1)") -> Color

    var rv, m, n, r, g, b, a = 1;

    if (expr instanceof Color) { // [1] through
        return expr;
    }
    if (typeof expr !== _string) { // [2] convert HSLAHash / RGBAHash to Color
        return "l" in expr ? hsla2color(expr.h, expr.s, expr.l, expr.a) // HSLAHash
                           : new Color(expr.r, expr.g, expr.b, expr.a); // RGBAHash
    }
    // "Red" -> "red"
    expr = expr[_toLowerCase]();

    // [3] W3CNamedColor or cached Color?
    rv = uucolor.db[expr] || uucolor.cache[expr];
    if (rv) {
        return rv;
    }

    // parse
    if (expr.length < 8 && (m = uucolor.rex.hex.exec(expr)) ) { // [4] #fff or #ffffff
        n = expr.length > 4 ? parseInt(m[1], 16)
                            : (m = m[1].split(""),
                               parseInt(m[0]+m[0] + m[1]+m[1] + m[2]+m[2], 16));
        r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    } else {
        m = uucolor.rex.rgba.exec(uutrim(expr, "")); // [5][6]
        if (m) {
            n = m[1] === "rgb" ? 2.555 : 1;
            r = m[3] ? m[2] * n : m[2];
            g = m[5] ? m[4] * n : m[4];
            b = m[7] ? m[6] * n : m[6];
            a = m[8] ? parseFloat(m[8]) : 1;
            if (n === 1) {
                return hsla2color(r, g, b, a);
            }
        }
    }
    // add cache
    return uucolor.cache[expr] = new Color(r, g, b, a);
}
uucolor.db = { transparent: new Color(0, 0, 0, 0) };
uucolor.cache = {}; // { "#123": Color, ... }
uucolor.rex = {
//  hex: /^#([\da-f]{3}(?:[\da-f]{3})?)$/, // #fff or #ffffff
    hex: /^#([\da-f]{3}([\da-f]{3})?)$/, // #fff or #ffffff [OPERA10+] bugfix
    rgba: /^(rgb|hsl)a?\(([\d\.]+)(%)?,([\d\.]+)(%)?,([\d\.]+)(%)?(?:,([\d\.]+))?\)$/,
    trim: /\s+/g
};

// uu.color.random - create random color
function uucolorrandom(a) { // @param Number(= 1): alpha
                            // @return Color:
    var n = (Math.random() * 0xffffff) | 0;

    return new Color(n >> 16, (n >> 8) & 255, n & 255, a === 0 ? 0 : (a || 1));
}

// uu.color.add
function uucoloradd(src) { // @param String: "000000black,..."
    var ary = src.split(","), i = 0, iz = ary.length, v, n;

    for (; i < iz; ++i) {
        v = ary[i];
        n = parseInt(v.slice(0, 6), 16);
        uucolor.db[v.slice(6)] = new Color(n >> 16, (n >> 8) & 255, n & 255, 1);
    }
}

// inner - RGBA to HSLAHash
function rgba2hsla(r, g, b, a) { // @return Hash: { h, s, l, a }
    r = r / 255, g = g / 255, b = b / 255;

    var max = (r > g && r > b) ? r : g > b ? g : b,
        min = (r < g && r < b) ? r : g < b ? g : b,
        diff = max - min,
        h = 0, s = 0, l = (min + max) * 0.5;

    if (l > 0 && l < 1) {
        s = diff / (l < 0.5 ? l * 2 : 2 - (l * 2));
    }
    if (diff > 0) {
        if (max === r && max !== g) {
            h += (g - b) / diff;
        } else if (max === g && max !== b) {
            h += (b - r) / diff + 2;
        } else if (max === b && max !== r) {
            h += (r - g) / diff + 4;
        }
        h *= 60;
    }
    return { h: h, s: (s * 100 + 0.5) | 0, l: (l * 100 + 0.5) | 0, a: a };
}

// inner - HSLA to Color - ( h: 0-360, s: 0-100, l: 0-100, a: alpha )
function hsla2color(h, s, l, a) { // @return Color:
    h = (h === 360) ? 0 : h, s = s / 100, l = l / 100;

    var r = 0, g = 0, b = 0, s1, s2, l1, l2;

    if (h < 120) {
        r = (120 - h) / 60, g = h / 60;
    } else if (h < 240) {
        g = (240 - h) / 60, b = (h - 120) / 60;
    } else {
        r = (h - 240) / 60, b = (360 - h) / 60;
    }
    s1 = 1 - s;
    s2 = s * 2;

    r = s2 * (r > 1 ? 1 : r) + s1;
    g = s2 * (g > 1 ? 1 : g) + s1;
    b = s2 * (b > 1 ? 1 : b) + s1;

    if (l < 0.5) {
        r *= l, g *= l, b *= l;
    } else {
        l1 = 1 - l;
        l2 = l * 2 - 1;
        r = l1 * r + l2;
        g = l1 * g + l2;
        b = l1 * b + l2;
    }
    return new Color(r * 255 + 0.5, g * 255 + 0.5, b * 255 + 0.5, a);
}

// --- initialize ---
//{@colordict
// add W3C Named Color
uucoloradd("000000black,888888gray,ccccccsilver,ffffffwhite,ff0000red,ffff00" +
"yellow,00ff00lime,00ffffaqua,00ffffcyan,0000ffblue,ff00fffuchsia,ff00ffmage" +
"nta,880000maroon,888800olive,008800green,008888teal,000088navy,880088purple" +
",696969dimgray,808080gray,a9a9a9darkgray,c0c0c0silver,d3d3d3lightgrey,dcdcd" +
"cgainsboro,f5f5f5whitesmoke,fffafasnow,708090slategray,778899lightslategray" +
",b0c4delightsteelblue,4682b4steelblue,5f9ea0cadetblue,4b0082indigo,483d8bda" +
"rkslateblue,6a5acdslateblue,7b68eemediumslateblue,9370dbmediumpurple,f8f8ff" +
"ghostwhite,00008bdarkblue,0000cdmediumblue,4169e1royalblue,1e90ffdodgerblue" +
",6495edcornflowerblue,87cefalightskyblue,add8e6lightblue,f0f8ffaliceblue,19" +
"1970midnightblue,00bfffdeepskyblue,87ceebskyblue,b0e0e6powderblue,2f4f4fdar" +
"kslategray,00ced1darkturquoise,afeeeepaleturquoise,f0ffffazure,008b8bdarkcy" +
"an,20b2aalightseagreen,48d1ccmediumturquoise,40e0d0turquoise,7fffd4aquamari" +
"ne,e0fffflightcyan,00fa9amediumspringgreen,7cfc00lawngreen,00ff7fspringgree" +
"n,7fff00chartreuse,adff2fgreenyellow,2e8b57seagreen,3cb371mediumseagreen,66" +
"cdaamediumaquamarine,98fb98palegreen,f5fffamintcream,006400darkgreen,228b22" +
"forestgreen,32cd32limegreen,90ee90lightgreen,f0fff0honeydew,556b2fdarkolive" +
"green,6b8e23olivedrab,9acd32yellowgreen,8fbc8fdarkseagreen,9400d3darkviolet" +
",8a2be2blueviolet,dda0ddplum,d8bfd8thistle,8b008bdarkmagenta,9932ccdarkorch" +
"id,ba55d3mediumorchid,da70d6orchid,ee82eeviolet,e6e6falavender,c71585medium" +
"violetred,bc8f8frosybrown,ff69b4hotpink,ffc0cbpink,ffe4e1mistyrose,ff1493de" +
"eppink,db7093palevioletred,e9967adarksalmon,ffb6c1lightpink,fff0f5lavenderb" +
"lush,cd5c5cindianred,f08080lightcoral,f4a460sandybrown,fff5eeseashell,dc143" +
"ccrimson,ff6347tomato,ff7f50coral,fa8072salmon,ffa07alightsalmon,ffdab9peac" +
"hpuff,ffffe0lightyellow,b22222firebrick,ff4500orangered,ff8c00darkorange,ff" +
"a500orange,ffd700gold,fafad2lightgoldenrodyellow,8b0000darkred,a52a2abrown," +
"a0522dsienna,b8860bdarkgoldenrod,daa520goldenrod,deb887burlywood,f0e68ckhak" +
"i,fffacdlemonchiffon,d2691echocolate,cd853fperu,bdb76bdarkkhaki,bdb76btan,e" +
"ee8aapalegoldenrod,f5f5dcbeige,ffdeadnavajowhite,ffe4b5moccasin,ffe4c4bisqu" +
"e,ffebcdblanchedalmond,ffefd5papayawhip,fff8dccornsilk,f5deb3wheat,faebd7an" +
"tiquewhite,faf0e6linen,fdf5e6oldlace,fffaf0floralwhite,fffff0ivory,a9a9a9da" +
"rkgrey,2f4f4fdarkslategrey,696969dimgrey,808080grey,d3d3d3lightgrey,778899l" +
"ightslategrey,708090slategrey,8b4513saddlebrown");
//}@colordict
//}@color

// --- IMAGE ---
// uu.image - image loader
//{@image
function uuimage(url,        // @param String:
                 callback) { // @param Function: callback(img, ok)
                             //     img - Node: <img>
                             //     ok  - Boolean: true is success
    function after(ok, fn) {
        while ( (fn = uuimage.fn[url].shift()) ) {
            fn(img, ok);
        }
    }

    var img = uuimage.db[url];

    if (img) { // cached or scheduled
        uuimage.fn[url].push(callback);
        img.ok && after(_true);
    } else {
        uuimage.db[url] = img = new Image();
        uuimage.fn[url] = [callback]; // init
        img.ok = _false;
        img.onerror = function() {
            img[_width] = img[_height] = 0;
            after(img.ok = _false);
            img.onerror = img.onload = null;
        };
        img.onload = function() {
            // [IE8+] readyState === "complete"
            (img.complete || img.readyState === "complete") && after(img.ok = _true);
            img.onerror = img.onload = null;
        };
        img[_setAttribute]("src", url);
    }
}
uuimage.db = {}; // { url: Image, ... }
uuimage.fn = {}; // { url: [callback, ...] }

// uu.image.size - get image natural dimension
function uuimagesize(node) { // @param HTMLImageElement:
                             // @return Hash: { w, h }
//{@mb
    if ("naturalWidth" in node) { // [HTML5][GECKO][WEBKIT]
//}@mb
        return { w: node.naturalWidth, h: node.naturalHeight };
//{@mb
    }
    // http://d.hatena.ne.jp/uupaa/20090602
    var rs, rw, rh, w, h, hide, meta = nodeData + "image";

    if (node.src) { // HTMLImageElement
        if (node[meta] && node[meta].src === node.src) {
            return node[meta];
        }
        if (_ie) { // [IE]
            if (node.currentStyle) {
                hide = node.currentStyle[_display] === "none";
                hide && (node.style[_display] = "block");
            }
            rs = node.runtimeStyle;
            // keep runtimeStyle
            w = rs[_width];
            h = rs[_height];
            // override
            rs[_width] = rs[_height] = "auto";
            rw = node[_width];
            rh = node[_height];
            // restore
            rs[_width]  = w;
            rs[_height] = h;

            hide && (node.style[_display] = "none");
        } else { // [OPERA]
            // keep current style
            w = node[_width];
            h = node[_height];

            node.removeAttribute(_width);
            node.removeAttribute(_height);

            rw = node[_width];
            rh = node[_height];
            // restore
            node[_width]  = w;
            node[_height] = h;
        }
        return node[meta] = { w: rw, h: rh, src: node.src }; // bond
    }
    return { w: node[_width], h: node[_height] };
//}@mb
}
//}@image

// --- FONT ---
//{@font

// uu.font - parse CSS::font style
function uufont(font,     // @param String: font string, eg: "12pt Arial"
                embase) { // @param Node: The em base node
                          // @return Hash: { style, weight, variant, rawfamily,
                          //                 family, formal }
                          //    style     - String: "normal", "italic", "oblique"
                          //    weight    - String: "normal", "bold", "bolder",
                          //                        "lighter", "100" ~ "900"
                          //    variant   - String: "normal", "small-caps"
                          //    rawfamily - String: "Times New Roman,Arial"
                          //    family    - String: "'Times New Roman','Arial'"
                          //    formal    - String: "{style} {variant} {weight} {size}px {family}"
                          // @throws Error("UNKNOWN_FONT_UNIT")
    // inner - measure em unit
    function _em(node) {
        var rv, div = node[_appendChild](newNode());

        div.style.cssText = uufont.BASE_STYLE + "width:12em";
        rv = div.clientWidth / 12;
        node.removeChild(div);
        return rv;
    }

    var rv = {}, fontSize, style,
        cache = embase.uucanvascache ||
                (embase.uucanvascache = { font: {}, em: _em(embase) });

    if (!cache.font[font]) {
        // --- parse font string ---
        style = newNode().style; // dummy(div) node
        try {
            style.font = font; // parse
        } catch (err) {
            throw err;
        }
        fontSize = style.fontSize; // get font-size

        rv.size = uufont.SIZES[fontSize];
        if (rv.size) { // "small", "large" ...
            rv.size *= 16;
        } else if (fontSize.lastIndexOf("px") > 0) { // "12px"
            rv.size = parseFloat(fontSize);
        } else if (fontSize.lastIndexOf("pt") > 0) { // "12.3pt"
            rv.size = parseFloat(fontSize) * 1.33;
        } else if (fontSize.lastIndexOf("em") > 0) { // "10.5em"
            rv.size = parseFloat(fontSize) * cache.em;
        } else {
            throw new Error("UNKNOWN_FONT_UNIT");
        }
        rv.style = style.fontStyle; // normal, italic, oblique
        rv.weight = style.fontWeight; // normal, bold, bolder, lighter, 100~900
        rv.variant = style.fontVariant; // normal, small-caps
        rv.rawfamily = style.fontFamily.replace(/[\"\']/g, "");
        rv.family = "'" + rv.rawfamily.replace(/\s*,\s*/g, "','") + "'";
        rv.formal = [rv.style,
                     rv.variant,
                     rv.weight,
                     rv.size.toFixed(2) + "px",
                     rv.family].join(" ");
        cache.font[font] = rv; // add cache
    }
    return cache.font[font];
}
uufont.BASE_STYLE = "position:absolute;border:0 none;margin:0;padding:0;";
uufont.SCALE = {
//{@mb
    ARIAL: 1.55, "ARIAL BLACK": 1.07, "COMIC SANS MS": 1.15,
    "COURIER NEW": 1.6, GEORGIA: 1.6, "LUCIDA GRANDE": 1,
    "LUCIDA SANS UNICODE": 1, "TIMES NEW ROMAN": 1.65,
    "TREBUCHET MS": 1.55, VERDANA: 1.4,
    "MS UI GOTHIC": 2, "MS PGOTHIC": 2, MEIRYO: 1,
//}@mb
    "SANS-SERIF": 1, SERIF: 1, MONOSPACE: 1, FANTASY: 1, CURSIVE: 1
};
uufont.SIZES = {
    "xx-small": 0.512,
    "x-small":  0.64,
    smaller:    0.8,
    small:      0.8,
    medium:     1,
    large:      1.2,
    larger:     1.2,
    "x-large":  1.44,
    "xx-large": 1.728
};

// uu.font.list - enum usable font lists
function uufontlist(fonts) { // @param FontNameArray: ["Arial", "Times New Roman",
                             //                        "DeviceDependencyFont",
                             //                        "UnknownUserFont"]
                             // @return Array: [UsableFontArray, UnusableFontArray]
                             //                eg: [["Arial", "Times New Roman"],
                             //                     ["DeviceDependencyFont", "UnknownUserFont"]]
    var usable = [], unusable = [], i = 0, iz = fonts.length, a, b;

    for (; i < iz; ++i) {
        a = uufontmetric("72pt dummy");
        b = uufontmetric("72pt " + fonts[i]);

        if (a.w !== b.w || a.h !== b.h) {
            usable.push(fonts[i]);
        } else {
            unusable.push(fonts[i]);
        }
    }
    return [usable, unusable];
}

// uu.font.detect - detect the rendering font
function uufontdetect(node) { // @param Node:
                              // @return String: detected font, eg: "serif"
    var fam = uucss(node, "px").fontFamily,
        ary = fam.trim().split(","), v, i = 0,
        a, b = uufontmetric("72pt " + fam);

    for (; v = ary[i++]; ) {
        a = uufontmetric("72pt " + v);
        if (a.w === b.w && a.h === b.h) {
            return v; // match
        }
    }
    return "";
}

// uu.font.metric - measure text rect(width, height)
function uufontmetric(font,   // @param CSSFronString: "12pt Arial"
                      text) { // @param String(= "aABCDEFGHIJKLMm"):
                              // @return Hash: { w, h }
    var node = uufontmetric.cache;

    if (!node) {
        uufontmetric.cache = node = uunodeadd();

        node.style.cssText = uufont.BASE_STYLE +
            "top:-10000px;left:-10000px;text-align:left;visibility:hidden";
    }
    node.style.font = font;
    node[ /*{@mb*/ _ie678 ? "innerText" : /*}@mb*/
         "textContent"] = text || "aABCDEFGHIJKLMm";
    return { w: node.offsetWidth,
             h: node.offsetHeight };
}
uufontmetric.cache = 0; // [lazy] measure node
//}@font

// --- SVG ---
// uu.svg - <svg:svg>
//{@svg
function uusvg(x,        // @param Number: Has no meaning or effect on outermost 'svg' elements
               y,        // @param Number: Has no meaning or effect on outermost 'svg' elements
               width,    // @param Number: For outermost 'svg' elements, the intrinsic
                         //                 width of the SVG document fragment.
                         //                For embedded 'svg' elements, the width of
                         //                 the rectangular region into which the 'svg' element is placed.
               height) { // @param Number: For outermost 'svg' elements, the intrinsic
                         //                 height of the SVG document fragment.
                         //                For embedded 'svg' elements, the height of
                         //                 the rectangular region into which the 'svg' element is placed.
                         // @return SVGNode: <svg:svg>
    return uunode("svg:svg", arguments, ["x", "y", "w", "h"], uuattr);
}
//}@svg

// --- CANVAS ---
//{@canvas

// uu.canvas - <canvas>
function uucanvas(width,         // @param Number(= 300):
                  height,        // @param Number(= 150):
                  order,         // @param String(= "svg sl fl vml"): backend order
                  placeHolder) { // @param Node(= <div>): placeholder Node
                                 // @return Node: <canvas>
    var canvas = newNode(
/*{@mb*/                 _ie678 ? "CANVAS" : /*}@mb*/ // [IE6][IE7][IE8][!] need upper case
                         "canvas");

    canvas[_width]  = width  == null ? 300 : width;
    canvas[_height] = height == null ? 150 : height;

    placeHolder || (placeHolder = doc.body[_appendChild](newNode()));
    placeHolder[_parentNode].replaceChild(canvas, placeHolder);

//{@mb
    if (_ie678) {
        return uucanvas.build(canvas, order || "svg sl fl vml");
    }
//}@mb
    return canvas;
}

// --- initialize ---
uuready("window", function() {
    uucanvas.init && uucanvas.init();
    uuready.window = uuready.canvas = _true;
    uuready.fire("canvas", uutag("canvas"));
});
//}@canvas

// --- AUDIO ---
//{@audio
// uu.audio
function uuaudio(src,        // @param URLString:
                 option,     // @param Hash: { auto, loop, start, parent, volume }
                             //     auto - Boolean(= true):
                             //     loop - Boolean(= false):
                             //     start - Number(= 0): start time
                             //     parent - Node: parent Node
                             //     volume - Number(= 0.5): 0.0 ~ 1.0
                 callback) { // @param Function:
    uu("Audio", src, uuarg(option, {
        auto:       _true,
        loop:       _false,
        start:      0,
        parent:     doc.body,
        volume:     0.5
    }), callback);
}

uu.Class("Audio", {
    init:           AudioInit,      // init(src:URLString, option:Hash, callback:Function)
    play:           AudioPlay,      // play():Boolean
    pause:          AudioPause,     // pause()
    stop:           AudioStop,      // stop(close:Boolean = false)
    attr:           AudioAttr,      // attr(key:String/Hash = void,
                                    //      value:Number/Boolean = void):String/Hash/Number/Boolean
                                    //  [1][get items] attr() -> { loop, start, volume, current,
                                    //                             duration, status, src, backend }
                                    //  [2][mix items] attr({ key: value, ... })
                                    //  [3][get item]  attr(key) -> value
                                    //  [4][set item]  attr(key, value)
                                    //      loop - Boolean: true is loop
                                    //      start - Nunber: 0 ~
                                    //      volume - Number: 0.0 ~ 1.0
                                    //      current - Nunber: 0 ~
    bind:           AudioBind,      // bind(eventTypes:String, evaluator:Function)
    unbind:         AudioUnbind,    // unbind(eventTypes:String, evaluator:Function)
    msgbox:         AudioMsgBox,    // msgbox(msg:String, param:Hash):Boolean/Hash/void
    toString:       function() {
        return this.ao.name;
    }
});

// Audio.init
function AudioInit(src,        // @param URLString: "http://.../music.mp3", "music.mp3"
                   option,     // @param Hash: { auto, loop, start, parent, volume }
                               //   option.auto - Boolean(= false): auto play
                               //   option.loop - Boolean(= false):
                               //   option.start - Number(= 0): start time
                               //   option.parent - Node(= <body>): <object> parent node
                               //   option.volume - Number(= 0.5): 0.0 ~ 1.0
                   callback) { // @param Function(= void): callback(this)
    var that = this, config = uu.config.audio,
        backends = {
            A: "HTML5Audio",
/*{@mb*/    S: "SilverlightAudio",
            F: "FlashAudio",        /*}@mb*/
            N: "NoAudio"
        };

    this.closed = _false;

    (config.order || "N").split("").some(function(klass) { // klass = "A"
        klass = backends[klass] || ""; // "HTML5Audio" <- "A"

        var backendClass = uuclass[klass];

        if (backendClass &&
            ifFunction(backendClass.ready) && backendClass.isSupport(src)) {

            uu(klass, src, option, function(ao) { // @param AudioObjectInstance:
                that.ao = ao;
                callback && callback(that);
            });
            return _true;
        }
        return _false;
    });
}

// Audio.attr
function AudioAttr(key,     // @param String/Hash(= void): key
                   value) { // @param String/Number/Boolean(= void): value
                            // @return Hash: { loop, start, volume, current,
                            //                 status, src, backend }
                            //   loop    - Boolean:
                            //   start   - Number: start time
                            //   volume  - Number/String: 0.0 ~ 1.0, "+0.1", "-0.1"
                            //   current - Number/String: current time, 0 ~, "+10", "-10"
                            //   status  - String: status text
                            //   src     - String:
                            //   backend - String: "HTML5Audio", "FlashAudio"
    var rv = this.ao.attr(), i, val, undef;

    switch (uucomplex(key, value)) { // 1: (), 2: (k), 3: (k,v), 4: ({})
    case 1:
    case 2: rv.closed = this.closed;
            rv.status = rv.closed ? "closed"
                      : rv.error  ? "error"
                      : rv.paused ? "paused"
                      : rv.ended  ? "ended" : "playing";
            rv.playing = (rv.status === "playing");
            break;
    case 3: key = uupair(key, value);
    case 4: for (i in key) {
                val = key[i];
                switch (i) {
                case "start":
                case "current":
                    val = uunumberexpand(rv[i], val); break;
                case "volume":
                    val = uunumberrange(0, uunumberexpand(rv[i], val), 1);
                }
                this.ao.attr(i, val); // set(key, value)
            }
    }
    return key === undef ? rv : rv[key];
}

// Audio.play - toggle play/pause
function AudioPlay() { // @return Boolean: true is playing
                       //                  false is paused
    switch (this.attr().status) {
    case "ended":   this.ao.attr("current", 0);
    case "paused":  this.ao.play();
                    return _true;
    case "playing": this.ao.pause();
    }
    return _false;
}

// Audio.pause - pause
function AudioPause() {
    if (this.attr().status === "playing") {
        this.ao.pause();
    }
}

// Audio.stop
function AudioStop(close) { // @param Boolean(= false):
    close && (this.closed = _true);
    this.ao.stop(close);
}

// Audio.bind
function AudioBind(eventTypes, // @param String:
                   callback) { // @param Function:
//  this.ao.bind(eventTypes, callback);
    uu.bind(this.ao.audio, eventTypes, callback);
}

// Audio.unbind
function AudioUnbind(eventTypes, // @param String:
                     callback) { // @param Function:
//  this.ao.unbind(eventTypes, callback);
    uu.unbind(this.ao.audio, eventTypes, callback);
}

// Audio.msgbox
function AudioMsgBox(msg,      // @param String: msg
                     param1,   // @param Mix(= void): param1
                     param2) { // @param Mix(= void): param2
                               // @return Boolean/Hash/void:

    //   [1][attr]  msgbox("attr", key:String/Hash = void,
    //                             value:Number/Boolean = void):Boolean/String/Number
    //   [2][play]  msgbox("play"):Boolean - true is playing, false is paused
    //   [3][stop]  msgbox("stop", close:Boolean = false)

    switch (msg) {
    case "attr": return this.attr(param1, param2);
    case "play": return this.play();
    case "stop": return this.stop(param1);
    }
    return;
}
// --- initialize ---
uuready("window", function() {
    uuready.window = uuready.audio = _true;
    uuready.fire("audio", uutag("audio"));
});
//}@audio

// --- FLASH ---
//  <object id="external..." width="..." height="..." data="*.swf" classid="...">
//      <param name="allowScriptAccess" value="always" />
//      <param name="movie" value="*.swf" />
//  </object>
//
//  <embed name="external..." src="*.swf" width="..." height="..."
//      type="application/x-shockwave-flash" allowScriptAccess="always">
//  </embed>
//
// uu.flash - create flash <object> node
//{@flash
//{@mb
function uuflash(url,        // @param String: url
                 id,         // @param String: unique id. eg: "external" + guid
                 option,     // @param Hash(= { allowScriptAccess: "always" }):
                             //   option.allowScriptAccess - String:
                             //   option.width - String/Number(= "100%"):
                             //   option.height - String/Number(= "100%"):
                             //   option.parent - Node(= <body>): <object> parent node
                 callback) { // @param Function: callback()
                             // @return Node: <object>
    // wait for response from flash initializer
    function flashCallback(id) { // @param String: ExternalInterface.objectID
        setTimeout(function() {
            uu.dmz[id] = null; // clear
            callback(id);
        }, 0); // lazy
    }

    var opt = uuarg(option, { width: "100%", height: "100%" }),
        param = opt.param || {},
        paramArray = [], i, div, fragment;

    uu.dmz[id] = flashCallback;

    // add <param name="allowScriptAccess" value="always" />
    param.allowScriptAccess || (param.allowScriptAccess = "always");

    // add <param name="movie" value="{{url}}" />
    param.movie = url;

    for (i in param) {
        paramArray.push(uuf(_ie ? '<param name="@" value="@" />'
                                : '@="@"', i, param[i]));
    }
    fragment = uuf(
        _ie ? '<object id="@" width="@" height="@" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"@>@</object>'
            : '<embed name="@" width="@" height="@" type="application/x-shockwave-flash" src="@" @ />',
        id,
        opt[_width],
        opt[_height],
        _ie ? "" : url,
        paramArray.join(_ie ? "" : " "));

    div = (opt.parent || doc.body)[_appendChild](newNode());
    div.innerHTML = fragment;
    return div[_firstChild]; // <object>
}
//}@mb
//}@flash

// --- COOKIE ---
//{@cookie
// uu.cookie - load and parse cookie
function uucookie(prefix) { // @param String: prefix, namespace
                            // @return Hash: { key: "value", ... }
    var rv = {}, i = 0, pairs, pair, kv, cut = prefix.length;

    if (doc.cookie) {

        // retrieve KeyValue pairs
        //      collect: "{{prefix}}key=value"
        //      ignore:  "key=value"
        //
        pairs = doc.cookie.split("; ");

        for (; pair = pairs[i++]; ) {
            kv = pair.split("="); // ["{{prefix}}key", "value"]

            if (!kv[0][_indexOf](prefix)) {
                rv[kv[0].slice(cut)] = decodeURIComponent(kv[1] || "");
            }
        }
    }
    return rv;
}

//  [1][exipre +3days]    uu.cookie.save("my", { key: value }, +(new Date) + 86400 * 3);
//  [2][temporary cookie] uu.cookie.save("my", { key: value }, +(new Date) + 86400 * 3);

// uu.cookie.save - save cookie
function uucookiesave(prefix, // @param String: prefix, namespace
                      data,   // @param Hash: { key: "value", ... }
                      date) { // @param UTCDateString/Date(= void):
                              // @return Number: last KeyValue pair length
    date = date ? "; expires=" + (isString(date) ? date
                                                 : new Date(+date).toUTCString())
                : "";
    var rv = "", i, secure = "";

//{@mb
    try {
        location.protocol === "https:" && (secure = "; secure"); // [IE][FIX] stand alone
    } catch(err) {}
//}@mb

    for (i in data) {
        rv = prefix + i + "=" + encodeURIComponent(data[i]);

        doc.cookie = rv + date + secure;
    }
    return rv.length;
}
//}@cookie

// --- STORAGE ---
// WebStorage spec: http://www.w3.org/TR/webstorage/#storage
// WebStorage IE spec: http://msdn.microsoft.com/en-us/library/cc197062(VS.85).aspx
// UserData spec: http://msdn.microsoft.com/en-us/library/ms531424(VS.85).aspx
// Storage Limit: http://d.hatena.ne.jp/uupaa/20100106

// +---------------+---------------------+----+--------+----+----+----+----+----+-----+
// | Storage Class | Storage Backend     | Min|    Max |Fx  |GC  |IE  |Sa  |iSa |Op   |
// +---------------+---------------------+----+--------+----+----+----+----+----+-----+
// | LocalStorage  | HTML5::WebStorage   |1.8M|     5M |  3+|3+  |8+  |  4+| 3.1|10.5+|
// | FlashStorage  | Flash::SharedObject |  0 |100k(1M)|   o|   o|   o|   o|  o |  o  |
// | IEStorage     | IE::userData        |    |    63k |   x|   x|  6+|   x|  x |  x  |
// | CookieStorage | Cookie              |  0 |   3.8k |   o|   o|   o|   o|  o |  o  |
// | MemStorage    | JavaScript::Object  |    |infinity|   o|   o|   o|   o|  o |  o  |
// +---------------+---------------------+----+--------+----+----+----+----+----+-----+

//{@storage
uu.Class.singleton("Storage", {
    init: function() {
        var that = this, config = uu.config.storage,
            backends = {
                L: "LocalStorage",
/*{@mb*/        F: "FlashStorage",
                I: "IEStorage",         /*}@mb*/
/*{@cookie*/    C: "CookieStorage",     /*}@cookie*/
                M: "MemStorage"
            };

        (config.order || "M").split("").some(function(klass) { // klass = "L"
            klass = backends[klass] || ""; // "LocalStorage" <- "L"

            if (uuclass[klass] && ifFunction(uuclass[klass].ready)) {
                try {
                    uu(klass, function(so) { // @param StorageObjectInstance:
                        that.so = config.space &&
                                  config.space > so.info().max ? uu("MemStorage")
                                                               : so;
                        setTimeout(function() {
                            uuready.storage = _true;
                            uuready.fire("storage", uu.storage = that);
                        }, 0);
                    });
                    return _true;
                } catch(err) {}
            }
            return _false;
        });
    },
    key: function(index) {
        return this.so.key(index) || "";
    },
    info: function() {
        return this.so.info();
    },
    item: function(key, value) {
        return this.so.item(key, value);
    },
    clear: function(key) {
        this.so.clear(key);
    }
});

uu.Class.singleton("LocalStorage", {
    init: function(callback) {
        this.so = win.localStorage;
        callback(this);
    },
    key: function(index) {
        return ( //{@mb
                 (index < 0 || index >= this.so.length) ? "" :
                 //}@mb
                 (this.so.key(index) || "") );
    },
    info: function() {
        var so = this.so, used = 0, i = 0, iz, remain,
            limit = _webkit ? 2.5   * 1024 * 1024 - 260 // WebKit      (2.5MB)
/*{@mb*/          : _gecko  ? 5     * 1024 * 1024 - 260 // Firefox3.5+ (5.0MB)
                  : _opera  ? 1.875 * 1024 * 1024 - 128 // Opera10.50  (1.875MB)
                  : _ie     ? 5     * 1000 * 1000       // IE8+        (4.768MB) /*}@mb*/
                  : 0;
/*{@mb*/
        if (_ie && "remainingSpace" in so) { // [IE8][IE9] storage.remainingSpace
            remain = so.remainingSpace;
            if (limit < remain) { // expand free space
                limit = 5 * 1000 * 1000; // 5MB
            }
            used = limit - remain;
        } else { /*}@mb*/
            for (iz = so.length; i < iz; ++i) {
                used += so.getItem(so.key(i)).length;
            }
/*{@mb*/}/*}@mb*/
        return _storage.info(used, limit, so.length, "LocalStorage");
    },
    item: function(key, value) {
        var so = this.so, rv, i, iz;

        switch (uucomplex(key, value)) { // 1: (), 2: (k), 3: (k,v), 4: ({})
        case 1: for (rv = {}, i = 0, iz = so.length; i < iz; ++i) {
                    key = so.key(i);
                    rv[key] = so.getItem(key + "") || "";
                }
                return rv;
        case 2: return so.getItem(key + "") || "";
        case 3: key = uupair(key, value);
        }
        for (i in key) { // [4]
            try {
                so[i] = ""; // [iPhone][FIX] pre clear. http://d.hatena.ne.jp/uupaa/20100106
                so[i] = key[i] + ""; // [IE][FIX] crash care
            } catch(err) { // catch Error("QUOTA_EXCEEDED_ERR")
                return _false;
            }
            if (so[i] !== key[i]) { // verify
                return _false;
            }
        }
        return _true;
    },
    clear: function(key) {
        key === void 0 ? this.so.clear()
                       : this.so.removeItem(key + ""); // [IE][FIX] crash care
    }
}, {
    ready: !!win.localStorage
});

//{@mb
uu.Class.singleton("FlashStorage", {
    init: function(callback, id) {
        var that = this;

        // wait for response from flash initializer
        function wait(id) { // @param String: ExternalInterface.objectID
            callback(that, id);
        }
        this.so = uuflash(uu.config.baseDir + "uu.storage.swf",
                          id || "externalflashstorage",
                          { width: 1, height: 1 }, wait);
    },
    key: function(index) {
        return this.so.key(index) || "";
    },
    info: function() {
        return this.so.info();
    },
    item: function(key, value) {
        switch (uucomplex(key, value)) { // 1: (), 2: (k), 3: (k,v), 4: ({})
        case 1: return this.so.allItem();
        case 2: return this.so.getItem(key) || "";
        case 3: key = uupair(key, value);
        }
        return this.so.setItem(key);
    },
    clear: function(key) {
        key === void 0 ? this.so.clear() : this.so.removeItem(key);
    }
},{ ready: function() {
        return _env.flash && uustat(uu.config.baseDir + "uu.storage.swf");
    }
});

uu.Class.singleton("IEStorage", {
    init: function(callback) {
        var so = uunodeadd("script", doc.head); // <script>

        so.id = "uuiestorage";
        so.addBehavior("#default#userData");
        so.expires = _storage.expire;

        this.so = so;
        callback(this);
    },
    key: function(index) {
        this.so.load(_storage.store);
        return (this.so[_getAttribute](_storage.index) || "").split("\t")[index] || "";
    },
    info: function() {
        this.so.load(_storage.store);

        var so = this.so, idx = (so[_getAttribute](_storage.index) || ""),
            ary = idx.split("\t"),
            used = idx.length, key, i = 0;

        for (; key = ary[i++]; ) {
            used += (so[_getAttribute](key) || "").length;
        }
        return _storage.info(used, 63 * 1024, i - 1, "IEStorage");
    },
    item: function(key, value) {
        var rv = _true, so = this.so, i = 0, idx;

        so.load(_storage.store);

        switch (uucomplex(key, value)) { // 1: (), 2: (k), 3: (k,v), 4: ({})
        case 1: idx = (so[_getAttribute](_storage.index) || "").split("\t");
                for (rv = {}; key = idx[i++]; ) {
                    rv[key] = so[_getAttribute](key) || "";
                }
                return rv;
        case 2: return so[_getAttribute](key) || "";
        case 3: key = uupair(key, value);
        }
        for (i in key) {
            try {
                idx = so[_getAttribute](_storage.index);
                value = key[i];

                // add index
                if (!idx) {
                    so[_setAttribute](_storage.index, i); // first time
                } else if (("\t" + idx + "\t").indexOf("\t" + i + "\t") < 0) {
                    so[_setAttribute](_storage.index, idx + "\t" + i);
                }
                so[_setAttribute](i, value);
                so.save(_storage.store);
            } catch(err) {
                return _false;
            }
            if (so[_getAttribute](i) !== value) { // verify
                return _false;
            }
        }
        return _true;
    },
    clear: function(key) {
        this.so.load(_storage.store);

        var so = this.so, idx = (so[_getAttribute](_storage.index) || ""),
            tab, i = 0;

        if (key === void 0) { // clear all
            idx = idx.split("\t");
            for (; key = idx[i++]; ) {
                so.removeAttribute(key);
            }
            so[_setAttribute](_storage.index, "");
            so.save(_storage.store);
        } else if (key) { // clear(item)
            i   = "\t" + idx + "\t";
            tab = "\t" + key + "\t";

            if (i.indexOf(tab) >= 0) {
                so[_setAttribute](_storage.index,
                                  i.replace(new RegExp(tab), "").trim());
                so.removeAttribute(key);
                so.save(_storage.store);
            }
        }
    }
},{ ready: _ie });
//}@mb

//{@cookie
uu.Class.singleton("CookieStorage", {
    init: function(callback) {
        this.so = uucookie(_storage.store); // shadow cookie
        callback(this);
    },
    key: function(index) {
        return uunth(this.so, index)[0] || "";
    },
    info: function() {
        return _storage.info(doc.cookie.length, 3800,
                             uusize(this.so), "CookieStorage");
    },
    item: function(key, value) {
        var i, so = this.so, before;

        switch (uucomplex(key, value)) { // 1: (), 2: (k), 3: (k,v), 4: ({})
        case 1: return uuclone(so);
        case 2: return so[key] || "";
        case 3: key = uupair(key, value);
        }
        for (i in key) {
            before = doc.cookie.length;
            if (before > 3800) { // 3.8kB
                return _false;
            }
            before && (before += 2); // 2: "; ".length
            before += uucookie.save(_storage.store, uupair(i, key[i]),
                                    _storage.expire);

            if (before !== doc.cookie.length) { // before !== after
                return _false;
            }
            so[i] = key[i];
        }
        return _true;
    },
    clear: function(key) {
        uucookie.save(_storage.store, key === void 0 ? this.so : uupair(key, ""),
                      (new Date(0)).toUTCString());
        key === void 0 ? (this.so = {}) : delete this.so[key];
    }
},{ ready: !!navigator.cookieEnabled });
//}@cookie

uu.Class.singleton("MemStorage", {
    init: function(callback) {
        this.so = {};
        callback(this);
    },
    key: function(index) {
        return uunth(this.so, index)[0] || "";
    },
    info: function() {
        return _storage.info(0, Number.MAX_VALUE, uusize(this.so), "MemStorage");
    },
    item: function(key, value) {
        switch (uucomplex(key, value)) { // 1: (), 2: (k), 3: (k,v), 4: ({})
        case 1: return uuclone(this.so);
        case 2: return this.so[key] || "";
        case 3: this.so[key] = value; break;
        case 4: uumix(this.so, key);
        }
        return _true;
    },
    clear: function(key) {
        key === void 0 ? (this.so = {}) : delete this.so[key];
    }
},{ ready: _true });

uuready("window", function() {
    uu.config.storage.disable || uu("Storage"); // -> uu.Class.Storage.Init()
});
//}@storage

// --- NUMBER ---
// uu.number - get unique number
function uunumber() { // @return Number: unique number, from 1
    return ++_guidCounter;
}

// uu.number.range - clipping value
function uunumberrange(min,   // @param Number: min
                       value, // @param Number: value
                       max) { // @param Number: max
                              // @return Number:
    return value < min ? min :
           value > max ? max : value;
}

// uu.number.expand - number expand(normalize)
function uunumberexpand(base,  // @param Number: base / current value
                        value, // @param String/Number: value or "{{operator}}value"
                               //     operator - String: "+" or "-" or "*" or "/"
                        fn) {  // @param Function(= parseFloat):
                               // @return Number:
    //  [1][through]       uu.number.expand(10, 20)    -> 20
    //  [2][base + value]  uu.number.expand(10, "+10") ->  20
    //  [3][base - value]  uu.number.expand(10, "-10") ->   0
    //  [4][base * value]  uu.number.expand(10, "*10") -> 100
    //  [5][base / value]  uu.number.expand(10, "/10") ->   1
    //  [6][parseInt]      uu.number.expand(0, 1.234, parseInt) -> 1

    fn = fn || parseFloat;
    var op, rv = value, n;

    if (typeof value !== _number) {
        n  = parseFloat(value.slice(1)); // "+10.1" -> 10.1
        op = value.charCodeAt(0) - 42;
        rv = !op    ? base * n :     // 0 is "*"
             op < 2 ? base + n :     // 1 is "+"
             op < 4 ? base - n :     // 3 is "-"
             op < 6 ? base / n : rv; // 5 is "/"
    }
    return fn(rv);
}

// --- UI ---
//{@ui

// uu.ui - query ui instance
function uuui(expr,      // @param CSSSelectorExpressionString/StringArray/String(= ""): UI name
              context) { // @param Node(= <body>): context
                         // @return InstanceArray: [instance, ...]

    //  [1][query all UI]         uu.ui() -> [instance, ...]
    //  [2][query Slider]         uu.ui("Slider", <body>) -> [instance, ...]
    //  [3][query Slider and Tab] uu.ui(["Slider", "Tab"], <body>) -> [instance, ...]
    //  [4][query expression]     uu.ui("#ui>div[ui=Slider]", <body>) -> [instance, ...]

    var rv = [], ary, v, i = 0, r;

    if (!expr) {
        expr = "*[ui]";
    } else if (!/\W/.test(expr)) {
        for (r = [], ary = uuarray(expr); v = ary[i++]; ) {
            r.push("div[ui=" + v + "]");
        }
        expr = r.join(",");
    }
    ary = uuquery(expr, context || doc.body);

    for (i = 0; v = ary[i++]; ) {
        rv.push(v.instance);
    }
    return rv;
}

// uu.ui.bind - bind UI
function uuuibind(uiname,     // @param String: UI name
                  callback) { // @param Hash: { method: callback, ...}
                              //  method   - String: "build", "transform", "isTransform"
                              //  callback - Function: callback function
    for (var i in callback) {
        uuuibind.db[uiname + i] = callback[i];
    }
}
uuuibind.db = {}; // { name+method: callback, ... }

// uu.ui.build - build / transform UI component
function uuuibuild(uiname                  // @param String(= "")
                   /*, var_args, ... */) { // @param Mix(= void):
                                           // @return Node/NodeArray: <div> or [<div>, ...]

    //  [1][build]      uu.ui("Slider", { step: 2 }) -> [<div ui="Slider" />]
    //  [2][transform]  uu.ui() -> [<div ui="Slider"><input type="range"/></div>, ...]

    // [1] build
    if (uiname) {
        uiname = uiname + "build";
        if (uiname in uuuibind.db) {
            return uuuibind.db[uiname].apply(null, uuarray(arguments, 1));
        }
        return null;
    }

    // [2] transform
    var rv = [], ary = uutag(), i = 0, iz = ary.length,
        fn, ctrl, method,
        db = uuuibind.db;

    for (; i < iz; ++i) {
        ctrl = uuattr(ary[i], "ui");
        if (ctrl) {
            method = ctrl + "isTransform";

            if (db[method] && db[method](ary[i])) {
                method = ctrl + "transform";

                if (db[method]) {
                    fn = db[method];
                    rv.push(fn(ary[i]));
                }
            }
        }
    }
    return rv;
}
//}@ui

// --- ECMAScript-262 5th ---
//{@mb

// Array.prototype.indexOf
function ArrayIndexOf(search,      // @param Mix: search element
                      fromIndex) { // @param Number(= 0): from index
                                   // @return Number: found index or -1
    var iz = this.length, i = fromIndex || 0;

    i = (i < 0) ? i + iz : i;
    for (; i < iz; ++i) {
        if (i in this && this[i] === search) {
            return i;
        }
    }
    return -1;
}

// Array.prototype.lastIndexOf
function ArrayLastIndexOf(search,      // @param Mix: search element
                          fromIndex) { // @param Number(= this.length): from index
                                       // @return Number: found index or -1
    var iz = this.length, i = fromIndex;

    i = (i < 0) ? i + iz + 1 : iz;
    while (--i >= 0) {
        if (i in this && this[i] === search) {
            return i;
        }
    }
    return -1;
}

// Array.prototype.every
function ArrayEvery(evaluator, // @param Function: evaluator
                    that) {    // @param this(= void): evaluator this
                               // @return Boolean:
    for (var i = 0, iz = this.length; i < iz; ++i) {
        if (i in this && !evaluator.call(that, this[i], i, this)) {
            return _false;
        }
    }
    return _true;
}

// Array.prototype.some
function ArraySome(evaluator, // @param Function: evaluator
                   that) {    // @param this(= void): evaluator this
                              // @return Boolean:
    for (var i = 0, iz = this.length; i < iz; ++i) {
        if (i in this && evaluator.call(that, this[i], i, this)) {
            return _true;
        }
    }
    return _false;
}

// Array.prototype.forEach
function ArrayForEach(evaluator, // @param Function: evaluator
                      that) {    // @param this(= void): evaluator this
    var i = 0, iz = this.length;

    if (that) {
        for (; i < iz; ++i) {
            i in this && evaluator.call(that, this[i], i, this);
        }
    } else {
        for (; i < iz; ++i) {
            i in this && evaluator(this[i], i, this);
        }
    }
}

// Array.prototype.map
function ArrayMap(evaluator, // @param Function: evaluator
                  that) {    // @param this(= void): evaluator this
                             // @return Array: [element, ... ]
    for (var iz = this.length, rv = Array(iz), i = 0; i < iz; ++i) {
        i in this && (rv[i] = evaluator.call(that, this[i], i, this));
    }
    return rv;
}

// Array.prototype.filter
function ArrayFilter(evaluator, // @param Function: evaluator
                     that) {    // @param this(= void): evaluator this
                                // @return Array: [element, ... ]
    for (var rv = [], ri = -1, v, i = 0, iz = this.length; i < iz; ++i) {
        i in this && evaluator.call(that, v = this[i], i, this)
                  && (rv[++ri] = v);
    }
    return rv;
}
//}@mb

// Array.prototype.reduce
function ArrayReduce(evaluator,    // @param Function: evaluator
                     initialValue, // @param Mix(= void): initial value
                     __right__) {  // @hidden Number(= 0): 1 is right
                                   // @return Mix:
    var that = this, r = !!__right__, undef, f = 0,
        rv = initialValue === undef ? undef : (++f, initialValue),
        iz = that.length, i = r ? --iz : 0;

    for (; r ? i >= 0 : i < iz; r ? --i : ++i) {
        i in that && (rv = f ? evaluator(rv, that[i], i, that)
                             : (++f, that[i]));
    }
    if (!f) {
        throw new Error("BAD_PARAM");
    }
    return rv;
}

// Array.prototype.reduceRight
function ArrayReduceRight(evaluator,      // @param Function: evaluator
                          initialValue) { // @param Mix(= void): initial value
                                          // @return Mix:
    return ArrayReduce.call(this, evaluator, initialValue, 1);
}

// Date.prototype.toISOString - to ISO8601 string
function DateToISOString() { // @return String:
    return this.toJSON ? this.toJSON() : uudate(this).ISO();
}

// Date.prototype.toJSON
function DateToJSON() { // @return String:
    return uudate(this).ISO();
}

// Boolean.prototype.toJSON
// Number.prototype.toJSON
// String.prototype.toJSON
function ObjectToJson() { // @return Mix:
    return this.valueOf();
}

// String.prototype.trim
function StringTrim() { // @return String: "has  space"
    return this[_replace](trimSpace, "");
}

// --- HTMLElement.prototype ---
//{@mb

// HTMLElement.prototype.innerText getter
function innerTextGetter() {
    return this.textContent;
}

// HTMLElement.prototype.innerText setter
function innerTextSetter(text) {
    while (this.hasChildNodes()) {
        this[_removeChild](this[_lastChild]);
    }
    this[_appendChild](newText(text));
}

// HTMLElement.prototype.outerHTML getter
function outerHTMLGetter() {
    var rv, that = this, p = that[_parentNode],
        r = doc.createRange(), div = newNode();

    p || doc.body[_appendChild](that); // orphan
    r.selectNode(that);
    div[_appendChild](r.cloneContents());
    rv = div.innerHTML;
    p || that[_parentNode][_removeChild](that);
    return rv;
}

// HTMLElement.prototype.outerHTML setter
function outerHTMLSetter(html) {
    var r = doc.createRange();

    r.setStartBefore(this);
    this[_parentNode].replaceChild(r.createContextualFragment(html), this);
}
//}@mb

// --- NodeSet ---
// NodeSet class
//{@nodeset
function NodeSet(expr,      // @param NodeSet/Node/NodeArray/String/window:
                 context) { // @param NodeSet/Node(= void): context
    this.stack = [[]]; // [NodeSet, ...]

    var ary, ctx;

    if (expr) {
        if (typeof expr === _string) {
            if (expr.charAt(0) === "<") { // <div> -> fragment
                ary = [uunodebulk(expr)];
            } else {
                ctx = context;
                ary = uuquery(expr,
                              ctx && ctx[nodeSet] ? ctx[nodeSet][_concat]()
                                                  : ctx);
            }
        } else {
            ary = (expr === win || expr[_nodeType]) ? [expr] // window / document / Node
                : isArray(expr) ? expr[_concat]() // NodeArray.clone
                : expr instanceof NodeSet ? expr[nodeSet][_concat]() : []; // copy constructor
        }
    }
    this[nodeSet] = ary || [];
}

// NodeSet.push - push stack
function NodeSetPush() { // @return NodeSet:
    this.stack.push(this[nodeSet]); // push stack
    return this;
}

// NodeSet.pop - pop stack
function NodeSetPop() { // @return NodeSet:
    this[nodeSet] = this.stack.pop() || [];
    return this;
}

// NodeSet.find
function NodeSetFind(expr) { // @param String: expression, "css > expr"
                             // @return NodeSet:
    var rv = [], ary = this[nodeSet], i = 0, iz = ary.length;

    for (; i < iz; ++i) {
        rv = rv[_concat](uuquery(expr, ary[i]));
    }
    this[nodeSet] = rv;
    return this;
}

// NodeSet.nth - NodeSet[indexer]
function NodeSetNth(index,       // @param Number(= 0): index,
                                 //                   :  0 is first element
                                 //                   : -1 is last element
                                 //                   : index < 0 is negative index
                    evaluator) { // @param Function(= void): callback function
                                 //                          evaluator(node, index)
                                 // @return Node/NodeSet: evaluator == void is return Node
    var rv = this[nodeSet][index < 0 ? index + this[nodeSet].length
                                     : (index || 0)];

    return evaluator ? (evaluator(rv, index), this) : rv;
}

// NodeSet.each
function NodeSetEach(evaluator, // @param Function: evaluator
                     loopout) { // @param Boolean(= false): loop-out of "return false"
                                // @return NodeSet:
    if (loopout) {
        var ary = this[nodeSet], i = 0, iz = ary.length, r;

        for (; i < iz; ++i) {
            if (i in ary) {
                r = evaluator(ary[i], i); // evaluator(value, index)
                if (r === false) {
                    break;
                }
            }
        }
    } else {
        this[nodeSet].forEach(evaluator); // evaluator(value, index)
    }
    return this;
}

// NodeSet.size - get NodeSet.length
function NodeSetSize() { // @return Number:
    return this[nodeSet].length;
}

// NodeSet.array - clone NodeSet Array
function NodeSetArray() { // @return Array: NodeSet
    return this[nodeSet][_concat]();
}

// NodeSet.indexOf - NodeSet.indexOf(node)
function NodeSetIndexOf(node) { // @param Node:
                                // @return Number: found index or -1
    return this[nodeSet][_indexOf](node);
}

// NodeSet.add - add child node
function NodeSetAdd(source,     // @param Node/DocumentFragment/HTMLFragment/TagName(= "div"):
                    position) { // @param Boolean(= "./last"): insert position
                                // @return NodeSet:
    var ary = this[nodeSet], context, i = 0;

    if (ary.length === 1) {
        uunodeadd(source, ary[0], position);
    } else {
        for (; context = ary[i++]; ) {
            uunodeadd(uunodebulk(source), context, position); // clone node
        }
    }
    return this;
}

// NodeSet.klass
function NodeSetKlass(className) { // @param String:
                                   // @return NodeSet:
    return NodeSetIter(1, this, uuklass, [className]);
}

// NodeSet.iter - NodeSet iterator
function NodeSetIter(map,       // @param Number: iter type. 0 is forEach, 1 is map
                     that,      // @param NodeSet:
                     evaluator, // @param Function: evaluator
                     args) {    // @param Arguments/MixArray: arguments
                                // @return NodeSet:
    var node, ary = that[nodeSet], i = 0, iz = ary.length,
        rv = [], r, arrayResult = 0, argz = args.length;

    for (; i < iz; ++i) {
        node = ary[i];
        if (node && node[_nodeType] === 11) { // 11: DocumentFragment
            node = node[_firstChild] || node;
        }
        switch (argz) {
        case 0: r = evaluator(node); break;
        case 1: r = evaluator(node, args[0]); break;
        case 2: r = evaluator(node, args[0], args[1]); break;
        case 3: r = evaluator(node, args[0], args[1], args[2]); break;
        case 4: r = evaluator(node, args[0], args[1], args[2], args[3]);
        }
        i || !map || r === node || ++arrayResult;
        arrayResult && (rv[i] = r);
    }
    return (map && arrayResult) ? rv : that;
}
//}@nodeset

// --- initialize ---

// inner - build DOM Lv2 event handler - uu.click(), ...
uueach(uuevent._.as, function(eventType) {
    uu[eventType] = function(node, fn) { // uu.click(node, fn) -> node
        return uuevent(node, eventType, fn);
    };
//{@nodeset
    NodeSet[_prototype][eventType] = function(fn) { // uu("li").click(fn) -> NodeSet
        return NodeSetIter(0, this, uuevent, [eventType, fn]);
    };
//}@nodeset
});

//{@mb
_ie678 && uueach(uutag.html5.split(","), newNode); // [IE6][IE7][IE8]

try {
    // [IE6] flicker fix
    _env.ie6 && doc.execCommand("BackgroundImageCache", _false, _true);
} catch(err) {} // ignore error(IETester / stand alone IE too)
//}@mb

// --- window.onload handler ---
function _windowonload() {
    uuready.window = _true;
    _DOMContentLoaded();
    uureadyfire("window");
}
doc.readyState === "complete" ? _windowonload()
                              : uueventattach(win, "load", _windowonload);

// --- DOMContentLoaded handler ---
function _DOMContentLoaded() {
    if (!uuready.reload && !uuready.dom) {
        uuready.dom = _true;
        uureadyfire("dom");
    }
}
//{@mb
// inner - hook DOMContentLoaded for [IE6][IE7][IE8]
function _IEDOMContentLoaded() {
    try {
        // trick -> http://d.hatena.ne.jp/uupaa/20100410/1270882150
        (new Image).doScroll();
        doc.body && _DOMContentLoaded(); // doc.body for <iframe>
    } catch(err) {
        setTimeout(_IEDOMContentLoaded, 32);
    }
}
_ie678 ? _IEDOMContentLoaded() : // [IE6][IE7][IE8]
//}@mb
    uueventattach(doc, "DOMContentLoaded", _DOMContentLoaded);

// --- finalize ---
//{@mb

// inner - [IE] fix mem leak
function _windowonunload() {
    var nodeid, node, ary, i, v;

    for (nodeid in _nodeiddb) {
        try {
            node = _nodeiddb[nodeid];
            ary = node.attributes;
            for (i = 0; v = ary[i++]; ) {
                !v.name[_indexOf]("data-") && (node[v.name] = null);
            }
        } catch (err) {}
    }
    doc.html = doc.head = null;
    uueventdetach(win, "onload",   _windowonload);
    uueventdetach(win, "onunload", _windowonunload);
}
_ie678 && uueventdetach(win, "onunload", _windowonunload);
//}@mb

// inner - init
// 1. prebuild camelized hash - http://handsout.jp/slide/1894
// 2. prebuild nodeid
uuready("dom:2", function() {
    var nodeList = uutag("", root), v, i = 0,
        attrFix = "float,cssFloat",
        fxAlias = ",w,width,h,height,x,left,y,top,l,left,t,top," +
                  "c,color,bgc,backgroundColor,bgcolor,backgroundColor," +
                  "bgx,backgroundPositionX,bgy,backgroundPositionY," +
                  "o,opacity,fs,fontSize,m,margin,b,border,p,padding";

//{@mb
    if (!uuready[_getAttribute]) {
        attrFix = "float,styleFloat,cssFloat,styleFloat";
    }
//}@mb
    uumix(createCamelizedHash(uufix._, _webkit ? getComputedStyle(root, 0)
                                               : root.style),
          uuhash(attrFix + fxAlias), uuattr._);
    uunodeid(root);
    for (; v = nodeList[i++]; ) {
        uunodeid(v);
    }
});

// inner - create camelized hash( { "text-align": "TextAlign", ...}) from getComputedStyle
function createCamelizedHash(rv, props) {
    var
//{@mb
        DECAMELIZE = /([a-z])([A-Z])/g,
//}@mb
        k, v;

    for (k in props) {
        if (typeof props[k] === _string) {
//{@mb
            if (_webkit) {
//}@mb
                v = k = props.item(k); // k = "-webkit-...", "z-index"
                k[_indexOf]("-") >= 0 && (v = k[_replace](/-[a-z]/g, function(m) {
                    return m[1].toUpperCase();
                }));
                (k !== v) && (rv[k] = v);
//{@mb
            } else {
                v = ((_gecko && !k[_indexOf]("Moz")) ? "-moz" + k.slice(3) :
                     (_ie    && !k[_indexOf]("ms"))  ? "-ms"  + k.slice(2) :
                     (_opera && !k[_indexOf]("O"))   ? "-o"   + k.slice(1) : k)
                    [_replace](DECAMELIZE, function(m, c, C) {
                        return c + "-" + C[_toLowerCase]();
                    });
                (k !== v) && (rv[v] = k);
            }
//}@mb
        }
    }
    return rv;
}

// inner - detect environment and meta informations
function detectEnvironment(libraryVersion) { // @param Number: Library version
                                             // @return VersionHash:
//{@mb
    // detect FlashPlayer version
    function detectFlashPlayerVersion(ie, minimumVersion) {
        var rv = 0, ver, m;

        try {
            ver = ie ? (new ActiveXObject("ShockwaveFlash.ShockwaveFlash")).
                            GetVariable("$version")[_replace](/,/g, ".")
                     : navigator.plugins["Shockwave Flash"].description;
            m = /\d+\.\d+/.exec(ver);
            rv = m ? parseFloat(m[0]) : 0;
        } catch(err) {}
        return rv < minimumVersion ? 0 : rv;
    }

    // detect Silverlight version
    function detectSilverlightVersion(ie, minimumVersion) {
        var rv = 0, obj, check = minimumVersion;

        try {
            obj = ie ? new ActiveXObject("AgControl.AgControl")
                     : navigator.plugins["Silverlight Plug-In"];
            if (ie) {
                while (obj.IsVersionSupported(check + ".0")) { // "3.0" -> "4.0" -> ...
                    rv = check++;
                }
            } else {
                rv = parseInt(/\d+\.\d+/.exec(obj.description)[0]);
            }
        } catch(err) {}
        return rv < minimumVersion ? 0 : rv;
    }

//}@mb
    function test(rex) {
        return rex.test(ua);
    }

    var rv = { library: libraryVersion,
               ie: _false, ie6: _false, ie7: _false, ie8: _false, ie9: _false,
               ie678: _false,
               opera: _false, gecko: _false, webkit: _true,
               chrome: _false, safari: _true, mobile: _true, jit: _true,
               touch: _true, flash: 0, silverlight: 0 },
        ua = navigator.userAgent,
//{@mb
        ie = !!doc.uniqueID, documentMode = doc.documentMode,
//}@mb
        opera = !!win.opera,
        gecko = (!!win.netscape || !!win.Components) && /Gecko\//.test(ua),
        webkit = !ie && !opera && !gecko && /WebKit/.test(ua),
        // http://d.hatena.ne.jp/uupaa/20090603
        rennum = ((/(?:rv\:|Kit\/|sto\/)(\d+\.\d+(\.\d+)?)/.exec(ua)
                   || [,0])[1]).toString(),
        render = parseFloat(rennum[_replace](/[^\d\.]/g, "")
                            [_replace](/^(\d+\.\d+)(\.(\d+))?$/,"$1$3")),
        browser = opera ? +(win.opera.version()[_replace](/\d$/, ""))
                        : parseFloat((/(?:IE |fox\/|ome\/|ion\/)(\d+\.\d)/.
                                     exec(ua) || [,0])[1]);

    rv.render       = render;
    rv.browser      = browser;
    rv.valueOf      = uupao(browser);
//{@mb
    rv.ie           = ie;
    rv.ie6          = ie && browser === 6 && !XMLHttpRequest;
    rv.ie7          = ie && browser === 7 &&  XMLHttpRequest;
    rv.ie8          = ie && documentMode === 8;
    rv.ie9          = ie && documentMode === 9;
    rv.ie678        = rv.ie6 || rv.ie7 || rv.ie8;
    rv.opera        = opera;
    rv.gecko        = gecko;
    rv.webkit       = webkit;
    rv.chrome       = webkit && test(/Chrome/);
    rv.safari       = webkit && test(/Safari/) && !rv.chrome;
    rv.mobile       = test(/Mobile/) || test(/Opera Mini/);
//}@mb
    rv.iphone       = webkit && test(/iPad|iPod|iPhone/);
    rv.retina       = win.devicePixelRatio > 1;
    rv.android      = webkit && test(/Android/);
    rv.os           = rv.iphone         ? "ios"     // iPhone OS    -> "ios"
                    : rv.android        ? "android" // Android OS   -> "android"
//{@mb
                    : test(/CrOS/)      ? "chrome"  // Chrome OS    -> "chrome"
                    : test(/Win/)       ? "windows" // Windows OS   -> "windows"
                    : test(/Mac/)       ? "mac"     // Mac OS       -> "mac"
                    : test(/X11|Linux/) ? "unix"    // Unix Base OS -> "unix"
//}@mb
                    : "";                           // Unknown OS   -> ""
//{@mb
    rv.touch        = rv.iphone || rv.android;
    rv.jit          = (ie     && browser >= 9)   ||    // IE 9+
                      (gecko  && render  >  1.9) ||    // Firefox 3.5+(1.91)
                      (webkit && render  >= 528) ||    // Safari 4+, Google Chrome(2+)
                      (opera  && browser >= 10.5);     // Opera10.50+
    rv.flash        = detectFlashPlayerVersion(ie, 9); // FlashPlayer 9+
    rv.silverlight  = detectSilverlightVersion(ie, 3); // Silverlight 3+
//}@mb
    return rv;
}

//{@mb
function fakeToArray(fakeArray) { // @param FakeArray: NodeList, Arguments
                                  // @return Array:
    if (uuready.ArraySlice) {
        return toArray.call(fakeArray);
    }

    var rv = [], i = 0, iz = fakeArray.length;

    for (; i < iz; ++i) {
        rv[i] = fakeArray[i];
    }
    return rv;
}
//}@mb

function detectFeatures() {
    var undef, hash = { rgba: _true, hsla: _true, transparent: _true },
//{@mb
        transparent = "transparent",
        node = newNode(), child, style = node.style,
//}@mb
        rv = {
            opacity: _true,         // opacity ready
            filter: _false,         // node.filters ready [IE]
            color: uuarg(hash),     // color: rgba, hsla, transparent ready
            border: uuarg(hash),    // border: rgba, hsla, transparent ready
            background: uuarg(hash),// background: rgba, hsla, transparent ready
            ArraySlice: _true,      // Array.prototype.slice.call(FakeArray) ready
            getAttribute: _true,    // getAttribute("href"), getAttribute("class") ready
            StringIndexer: _true,   // String[indexer] ready
            style: {                // style
                inlineBlock: _true  //  style.inlineBlock ready
            },
            innerHTML: {            // node.innerHTML
                style: _true,       //  node.innerHTML = "<style></style>" ready
                padStyle: _true     //  node.innerHTML = "<dummyNode/><style></style>" ready
            },
            cloneNode: {            // cloneNode:
                attr: _false,       //  ref attribute [GECKO][WEBKIT][OPERA][IE] is false
                data: _false,       //  ref node["data-*"] [IE6-IE8][IE9pp3] is true
                event: _false       //  ref DOM Event      [IE6-IE8][IE9pp3] is true
            }
        };

//{@mb
    uueach({ rgba: ["rgba(255,0,0,0.5)", /rgba.2/],
             hsla: ["hsla(100,100%,100%,0.5)", /rgba.2|hsla.1/],
             transparent: [transparent, /tran|rgba/] }, function(v, i) {
        style.cssText = 'color:' + v[0] + ';background:' + v[0] +
                        ';border:0 none ' + v[0];
        rv.color[i] = v[1].test(style.color);
        rv.border[i] = v[1].test(style.borderTopColor);
        rv.background[i] = v[1].test(style.backgroundColor);
    });
    // detect opacity - http://d.hatena.ne.jp/uupaa/20100513
    rv.opacity = style.opacity != undef;

    // detect innerHTML = "<style>" bug
    node.innerHTML = '<style></style>';
    rv.innerHTML.style = !!node.childNodes.length;

    // detect innerHTML = "<style>" bug + getAttribute bug
    node.innerHTML = '<a href="/a" class="a"></a><br/><style>*{color:red}</style>';
    rv.innerHTML.padStyle = node.childNodes.length === 3;

    child = node[_firstChild];
    try {
        toArray.call(doc.getElementsByTagName("head"));
    } catch(err) { rv.ArraySlice = _false; }
    rv[_getAttribute] = child[_getAttribute]("class") === "a" &&
                        child[_getAttribute]("href") === "/a";
    rv.StringIndexer = !!"0"[0];

    // revise
    if (_ie) {
        _env < 9 && (rv.color[transparent]  = _false);
        _env < 8 && (rv.style.inlineBlock   = _false);
        _env < 7 && (rv.border[transparent] = _false);
    }
//}@mb
    return rv;
}

//{@mb
// --- detect uu.ready.cloneNode.* features ---
uuready("dom:2", function() {
    var cloned, evt, fired = 0, attr = "uuz", data = nodeData + "z",
        body = doc.body, cloneNode = uuready.cloneNode, div = newNode(),
        onfire = function() {
            fired += 1;
        };

    div[_setAttribute](attr, "1");  // node.setAttribute("uuz", "1")
    div[data] = { ref: 1 };         // node["data-uuz"] = { ref: 1 }
    if (div[_addEventListener]) {   // [GECKO][WEBKIT][OPERA][IE9]
        div[_addEventListener]("click", onfire, _false);
        cloned = div.cloneNode(_false);
        (evt = doc.createEvent("MouseEvents")).initEvent("click", _false, _true);
        cloned.dispatchEvent(evt);  // fire
    } else if (div.attachEvent) {   // [IE]
        body[_appendChild](div).attachEvent("onclick", onfire);
        body[_appendChild](cloned = div.cloneNode(_false)).fireEvent("onclick");
        body[_removeChild](cloned);
        body[_removeChild](div);
    }
    cloned[_setAttribute](attr, "2"); // clonedNode.setAttribute("uuz", "2")
    cloned[data] && (cloned[data].ref = 2); // clonedNode["data-uuz"].ref = 2

    cloneNode.attr  = div[_getAttribute](attr) === cloned[_getAttribute](attr);
    cloneNode.data  = (!!cloned[data] && (div[data].ref === cloned[data].ref));
    cloneNode.event = !!fired;
}, function() {
    // detect uu.ready.filter
    if (_ie) {
        var div = doc.body[_appendChild](newNode()), dummy;

        try {
            dummy = div.filters;
            uuready.filter = _true;
        } catch(err) {}
        uunoderemove(div);
    }
});
//}@mb

})(this, document, document.documentElement,
   Object.prototype.toString, Array.isArray, Array.prototype.slice,
   /^\s+|\s+$/g, "data-uu", "nodeSet",
   setTimeout, setInterval, this.XMLHttpRequest,
   parseInt, parseFloat, this.getComputedStyle, this.JSON);

// === query.tokenizer, query.selector ===
// - query.selector() function limits
// -- unsupported Impossible rules ( :root:first-child, etc ) in W3C Test Suite - css3_id27a
// -- unsupported Impossible rules ( * html, * :root )        in W3C Test Suite - css3_id27b
// -- unsupported Case sensitivity '.cs P'                    in W3C Test Suite - css3_id181
// -- unsupported :not(), :not(*)                             in WebKit querySelectorAll()

//{@mb
uu.query.tokenizer || (function(doc, uu, _ie) {

uu.query.tokenizer = tokenizer;
uu.query.selector  = selector;

var _A_TAG          = 1,  // E               [_A_TAG,         "DIV"]
    _A_COMBINATOR   = 2,  // E > F           [_A_COMBINATOR,  ">", _A_TAG, "DIV"]
    _A_ID           = 3,  // #ID             [_A_ID,          "ID"]
    _A_CLASS        = 4,  // .CLASS          [_A_CLASS,       "CLASS"]
    _A_ATTR         = 5,  // [ATTR]          [_A_ATTR,        "ATTR"]
    _A_ATTR_VALUE   = 6,  // [ATTR="VALUE"]  [_A_ATTR_VALUE,  "ATTR", 1~6, "VALUE"]
    _A_PSEUDO       = 7,  // :target         [_A_PSEUDO,      1~29]
    _A_PSEUDO_NTH   = 8,  // :nth-child(...) [_A_PSEUDO_FUNC, 31~34, { a,b,k }]
    _A_PSEUDO_FUNC  = 9,  // :lang(...)      [_A_PSEUDO_FUNC, 35~99, arg]
    _A_PSEUDO_NOT   = 10, // :not(...)       [_A_PSEUDO_NOT,  _A_ID/_A_CLASS/_ATTR/_A_PSEUDO/_A_PSEUDO_FUNC, ...]
    _A_GROUP        = 11, // E,F             [_A_GROUP]
    _A_QUICK_ID     = 12, // #ID             [_A_QUICK_ID,    true or false, "ID" or "CLASS"]
    _A_QUICK_EFG    = 13, // E,F or E,F,G    [_A_QUICK_EFG,   ["E", "F"] or ["E", "F", "G"]]
    _TOKEN_COMB     = /^\s*(?:([>+~])\s*)?(\*|\w*)/, // "E > F"  "E + F"  "E ~ F"  "E"  "E F" "*"
    _TOKEN_ATTR     = /^\[\s*(?:([^~\^$*|=!\s]+)\s*([~\^$*|!]?\=)\s*((["'])?.*?\4)|([^\]\s]+))\s*\]/,
    _TOKEN_NTH      = /^(?:(even|odd)|(1n\+0|n\+0|n)|(\d+)|(?:(-?\d*)n([+\-]?\d*)))$/,
    _TOKEN_OPERATOR = { "=": 1, "*=": 2, "^=": 3, "$=": 4, "~=": 5, "|=": 6, "!=": 7 },
    _TOKEN_KIND     = { "#": 1, ".": 2, "[": 3, ":": 4 }, // ]
    _TOKEN_NTH_1    = { a: 0, b: 1, k: 1 }, // nth-child(1)
    _TOKEN_GROUP    = /^\s*,\s*/, // (((
    _TOKEN_ERROR    = /^[>+~]|[>+~*]{2}|[>+~]$/,
    _TOKEN_IDENT    = /^[#\.]([a-z_\u00C0-\uFFEE\-][\w\u00C0-\uFFEE\-]*)/i, // #ID or .CLASS
    _TOKEN_PSEUDO   = { E: /^(\w+|\*)\s*\)/, END: /^\s*\)/, FUNC: /^\s*([\+\-\w]+)\s*\)/,
                        FIND: /^:([\w\-]+\(?)/, STR: /^\s*(["'])?(.*?)\1\)/ },
    _TOKEN_PSEUDO_LIST = {
        // pseudo
        "first-child":      1, "last-child":       2, "only-child":       3, // childFilter
        "first-of-type":    4, "last-of-type":     5, "only-of-type":     6, // nthTypeFilter
        hover:              7, focus:              8, active:             0, // actionFilter
        enabled:           10, disabled:          11, checked:           12, // formFilter
        link:              13, visited:           14,                        // otherFilter
        empty:             15, root:              16, target:            17, // otherFilter
        // pseudo functions
        "not(":            30,
        "nth-child(":      31, "nth-last-child(": 32,                        // nthFilter
        "nth-of-type(":    33, "nth-last-of-type(": 34,                      // nthTypeFilter
        "lang(":           35, "contains(":       36                         // otherFunctionFilter )))))))
    },
    _QUICK          = { E: /^\w+$/, ID: /^([#\.])([a-z_\-][\w\-]*)$/i, // #ID or .CLASS
                        EFG: /^(\w+)\s*,\s*(\w+)(?:\s*,\s*(\w+))?$/ }, // E,F[,G]
    _QUERY_COMB     = { ">": 1, "+": 2, "~": 3 },
    _QUERY_FORM     = /^(input|button|select|option|textarea)$/i,
    _QUERY_CASESENS = { title: 0, id: 0, name: 0, "class": 0, "for": 0 },
    _uuqid          = "data-uuqueryid",
    _uudoctype      = "data-uudoctype", // 1: XMLDocument, 2: HTMLDocument
    _nodeCount      = 0,
    _textContent    = uu.ie678 ? "innerText" : "textContent";

// uu.query.tokenizer
function tokenizer(expr) { // @param CSSSelectorExpressionString: "E > F"
                           // @return QueryTokenHash: { data, group, err, msg, expr }
                           //   data  - Array:   [_A_TOKEN, data, ...]
                           //   group - Number:  groups from 1
                           //   err   - Boolean: true is error
                           //   msg   - String:  error message
                           //   expr  - String:  expression
    var rv = { data: [], group: 1, err: false, msg: "", expr: expr = expr.trim() },
        data = rv.data, m, outer, inner;

    // --- QUICK PHASE ---
    (m = _QUICK.E.exec(expr))  ? (data.push(_A_TAG, m[0])) :
    (m = _QUICK.ID.exec(expr)) ? (data.push(_A_QUICK_ID, m[1] === "#", m[2])) :
    ((m = _QUICK.EFG.exec(expr)) && m[1] !== m[2] && m[1] !== m[3] && m[2] !== m[3])
                               ? (data.push(_A_QUICK_EFG, m[3] ? [m[1], m[2], m[3]]
                                                               : [m[1], m[2]])) :
    _TOKEN_ERROR.test(expr)    ? (rv.msg = expr) : 0;

    // --- GENERIC PHASE ---
    if (!data.length) {
        while (!rv.msg && expr && outer !== expr) { // outer loop
            m = _TOKEN_COMB.exec(outer = expr);
            if (m) {
                m[1] && data.push(_A_COMBINATOR, m[1]); // >+~
                        data.push(_A_TAG, m[2] || "*"); // "DIV" or "*"
                expr = expr.slice(m[0].length);
            }
            while (!rv.msg && expr && inner !== expr) { // inner loop
                expr = innerLoop(inner = expr, rv);
            }
            m = _TOKEN_GROUP.exec(expr);
            if (m) {
                ++rv.group;
                data.push(_A_GROUP);
                expr = expr.slice(m[0].length);
            }
        }
        expr && (rv.msg = expr); // remain
    }
    rv.msg && (rv.err = true);
    return rv;
}

// inner -
function innerLoop(expr, rv, not) {
    var data = rv.data, m, num, mm, anb, a, b, c;

    switch (_TOKEN_KIND[expr.charAt(0)] || 0) {
    case 1: (m = _TOKEN_IDENT.exec(expr)) && data.push(_A_ID,    m[1]); break;
    case 2: (m = _TOKEN_IDENT.exec(expr)) && data.push(_A_CLASS, m[1]); break;
    case 3: m = _TOKEN_ATTR.exec(expr); // [1]ATTR, [2]OPERATOR, [3]"VALUE" [5]ATTR
            if (m) {
                m[5] ? data.push(_A_ATTR, m[5])
                     : data.push(_A_ATTR_VALUE,
                                    m[1], num = _TOKEN_OPERATOR[m[2]], m[3]);
                m[5] || num || (rv.msg = m[0]);
                // [FIX] Attribute multivalue selector. css3_id7b.html
                //  <p title="hello world"></p> -> query('[title~="hello world"]') -> unmatch
                num === 5 && m[3].indexOf(" ") >= 0 && (rv.msg = m[0]);
            }
            break;
    case 4: m = _TOKEN_PSEUDO.FIND.exec(expr);
            if (m) {
                num = _TOKEN_PSEUDO_LIST[m[1]] || 0;
                if (!num) {
                    rv.msg || (rv.msg = m[0]);
                } else if (num < 30) {   // pseudo (30 is magic number)
                    // 4:first-of-type -> 33:nth-of-type(1)
                    // 5:last-of-type  -> 34:nth-last-of-type(1)
                    // 6:only-of-type  -> 33:nth-of-type(1) + 34:nth-last-of-type(1)
                    num === 4 ? data.push(_A_PSEUDO_NTH, 33, _TOKEN_NTH_1) :
                    num === 5 ? data.push(_A_PSEUDO_NTH, 34, _TOKEN_NTH_1) :
                    num === 6 ? data.push(_A_PSEUDO_NTH, 33, _TOKEN_NTH_1,
                                          _A_PSEUDO_NTH, 34, _TOKEN_NTH_1) :
                                data.push(_A_PSEUDO, num);
                } else if (num === 30) { // :not   (30 is magic number)
                    (not || expr === ":not()"
                         || expr === ":not(*)") && (rv.msg = ":not()");

                    if (!rv.msg) {
                        data.push(_A_PSEUDO_NOT);
                        expr = expr.slice(m[0].length);
                        m = _TOKEN_PSEUDO.E.exec(expr);
                        if (m) {
                            data.push(_A_TAG, m[1].toUpperCase()); // "DIV"
                        } else {
                            expr = innerLoop(expr, rv, 1); // :not(simple selector)
                            m = _TOKEN_PSEUDO.END.exec(expr);
                            m || rv.msg || (rv.msg = ":not()");
                        }
                    }
                } else { // pseudo nth-functions
                    data.push(num < 35 ? _A_PSEUDO_NTH : _A_PSEUDO_FUNC, num);
                    expr = expr.slice(m[0].length);
                    m = _TOKEN_PSEUDO.FUNC.exec(expr);
                    if (m) {
                        if (num < 35) {
                            mm = _TOKEN_NTH.exec(m[1]);
                            if (mm) {
                                if (mm[1]) { // :nth(even) or :nth(odd)
                                    anb = { a: 2, b: mm[1] === "odd" ? 1 : 0, k: 3 };
                                } else if (mm[2]) {
                                    anb = { a: 0, b: 0, k: 2, all: 1 }; // nth(1n+0), nth(n+0), nth(n)
                                } else if (mm[3]) {
                                    anb = { a: 0, b: parseInt(mm[3], 10), k: 1 }; // nth(1)
                                } else {
                                    a = (mm[4] === "-" ? -1 : mm[4] || 1) - 0;
                                    b = (mm[5] || 0) - 0;
                                    c = a < 2;
                                    anb = { a: c ? 0 : a, b: b, k: c ? a + 1 : 3 };
                                }
                            }
                            anb ? data.push(anb)  // pseudo function arg
                                : rv.msg ? 0 : (rv.msg = m[0]);
                        } else { // :lang
                            m ? data.push(m[1]) // pseudo function arg
                              : rv.msg ? 0 : (rv.msg = m[0]);
                        }
                    } else { // :contains
                        m = _TOKEN_PSEUDO.STR.exec(expr);
                        m ? data.push(m[2]) // pseudo function arg
                          : rv.msg ? 0 : (rv.msg = m[0]);
                    }
                }
            }
    }
    m && (expr = expr.slice(m[0].length));
    return expr;
}

// uu.query.selector
function selector(token,     // @param Hash: QueryTokenHash
                  context) { // @param Node: context
                             // @return NodeArray: [node, ...]
    var node = context.ownerDocument || doc, // owner node
        xmldoc = !((node[_uudoctype] ||
                   (node[_uudoctype] = (node.createElement("a").tagName ===
                                        node.createElement("A").tagName) ? 2 : 1)) - 1),
        ctx = [context], result = [], ary,
        lock, word, match, negate = 0, data = token.data,
        i = 0, iz = data.length, j, jz = 1, k, kz, r, ri,
        ident, nid, type, attr, ope, val, rex;

    for (; i < iz && jz; jz = ctx.length, ++i) {
        r = [], ri = -1, j = type = 0;

        switch (data[i]) {
        case _A_QUICK_ID:       // [_A_QUICK_ID, true or false, "ID" or "CLASS"]
            if (data[++i]) { // ID
                node = doc.getElementById(data[++i]);
                return node ? [node] : [];
            } // CLASS
            ary = context.getElementsByTagName("*");
            ident = " " + data[++i] + " ";
            for (jz = ary.length; j < jz; ++j) {
                node = ary[j];
                ((word = node.className) && ((" " + word + " ").indexOf(ident) >= 0))
                                         && (r[++ri] = node);
            }
            return r;
        case _A_QUICK_EFG:      // [_A_QUICK_EFG, ["E", "F"] or ["E", "F", "G"]]
            ary = data[++i];
            return uu.node.sort(
                        uu.tag(ary[0], context).concat(
                            uu.tag(ary[1], context),
                            ary[2] ? uu.tag(ary[2], context) : []))[0];
        case _A_COMBINATOR:     // [_A_COMBINATOR, ">", _A_TAG, "DIV"]
            type = _QUERY_COMB[data[++i]];
            ++i;
        case _A_TAG:            // [_A_TAG, "DIV"]
            ident = data[++i]; // "DIV" or "*"
            match = ident === "*";
            xmldoc || (ident = ident.toUpperCase());

            if (!type) { // TAG
                if (negate) {
                    for (; j < jz; ++j) {
                        node = ctx[j];
                        (node.tagName !== ident) && (r[++ri] = node);
                    }
                    ctx = r;
                    break;
                }
                for (lock = {}; j < jz; ++j) {
                    ary = ctx[j].getElementsByTagName(ident); // NodeList

                    for (k = 0, kz = ary.length; k < kz; ++k) {
                        node = ary[k];
                        if ((match && node.nodeType === 1) || node.tagName === ident) {
                            nid = node[_uuqid] || (node[_uuqid] = ++_nodeCount);
                            lock[nid] || (r[++ri] = node, lock[nid] = 1);
                        }
                    }
                }
            } else { // >+~
                for (lock = {}; j < jz; ++j) {
                    node = ctx[j][type < 2 ? "firstChild" : "nextSibling"];
                    for (; node; node = node.nextSibling) {
                        if (node.nodeType === 1) {
                            if (_ie && !node.tagName.indexOf("/")) { // fix #25
                                continue;
                            }
                            if (match || node.tagName === ident) {
                                if (type > 2) {
                                    nid = node[_uuqid] || (node[_uuqid] = ++_nodeCount);
                                    if (lock[nid]) { break; }
                                    lock[nid] = 1;
                                }
                                r[++ri] = node;
                            }
                            if (type === 2) { break; }
                        }
                    }
                }
            }
            ctx = r;
            break;
        case _A_ID:             // [_A_ID, "ID"]
            type = 1;
        case _A_CLASS:          // [_A_CLASS, "CLASS"]
            ident = type ? data[++i] : (" " + data[++i] + " "); // "ID" or " CLASS "
            for (; j < jz; ++j) {
                node = ctx[j];
                if (type) { // ID
                    word  = xmldoc ? node.id : (node.id || node.name); // XHTML is id only
                    match = word && word === ident;
                } else {    // CLASS
                    word  = node.className;
                    match = word && ((" " + word + " ").indexOf(ident) >= 0);
                }
                (match ^ negate) && (r[++ri] = node);
            }
            ctx = r;
            break;
        case _A_ATTR:           // [_A_ATTR, "ATTR"]
            for (attr = data[++i]; j < jz; ++j) {
                node = ctx[j];
                match = _ie ? ((word = node.getAttributeNode(attr)) && word.specified)
                            : node.hasAttribute(attr);
                (match ^ negate) && (r[++ri] = node);
            }
            ctx = r;
            break;
        case _A_ATTR_VALUE:     // [_A_ATTR_VALUE, "ATTR", "OPERATOR", "VALUE"]
            attr = data[++i];
            ope  = data[++i];
            val  = uu.trim.quote(data[++i]);
            uu.ready.getAttribute || (attr = uu.attr._[attr] || attr);
            switch (ope) {
            case 1: val = "^" + val + "$"; break;                 // [attr  = value]
            case 3: val = "^" + val;       break;                 // [attr ^= value]
            case 4: val =       val + "$"; break;                 // [attr $= value]
            case 5: val = "(?:^| )" + val + "(?:$| )"; break;     // [attr ~= value]
            case 6: val = "^" + val + "\\-|^" + val + "$"; break; // [attr |= value]
            case 7: negate = +!negate;                            // [attr != value]
            }
            rex = RegExp(val, attr in _QUERY_CASESENS ? "" : "i"); // ignore case
            for (; j < jz; ++j) {
                node = ctx[j];
                word = node.getAttribute(attr, 2);
                ((word && rex.test(word)) ^ negate) && (r[++ri] = node);
            }
            ope === 7 && (negate = +!negate); // restore
            ctx = r;
            break;
        case _A_PSEUDO:         // [_A_PSEUDO, 1~29]
            type = data[++i];
            ctx = (type < 4  ? childFilter
                 : type < 10 ? actionFilter
                 : type < 13 ? formFilter
                             : otherFilter)(ctx, j, jz, negate, type, xmldoc);
            break;
        case _A_PSEUDO_NTH:     // [_A_PSEUDO_FUNC, 31~34, { a,b,k }]
            type = data[++i];
            ctx = (type < 33 ? nthFilter
                             : nthTypeFilter)(ctx, j, jz, negate, type, data[++i], xmldoc);
            break;
        case _A_PSEUDO_FUNC:    // [_A_PSEUDO_FUNC, 31~99, arg]
            type = data[++i];
            ctx = otherFunctionFilter(ctx, j, jz, negate, type, data[++i]);
            break;
        case _A_PSEUDO_NOT:     // [_A_PSEUDO_NOT, _A_ID/_A_CLASS/_ATTR/_A_PSEUDO/_A_PSEUDO_FUNC, ...]
            negate = 2;
            break;
        case _A_GROUP:
            result.push(ctx);
            ctx = [context];
        }
        negate && --negate;
    }
    // --- mixin group ---
    iz = result.length;
    if (iz) {
        result.push(ctx);
        for (r = [], ri = -1, lock = {}, i = 0, ++iz; i < iz; ++i) {
            ctx = result[i];
            for (j = 0, jz = ctx.length; j < jz; ++j) {
                node = ctx[j];
                nid = node[_uuqid] || (node[_uuqid] = ++_nodeCount);
                lock[nid] || (r[++ri] = node, lock[nid] = 1);
            }
        }
        return uu.node.sort(r)[0]; // to document order
    }
    return ctx;
}

// inner - 1:first-child  2:last-child  3:only-child
function childFilter(ctx, j, jz, negate, ps) {
    var rv = [], ri = -1, node, cn, found = 0;

    for (; j < jz; found = 0, ++j) {
        cn = node = ctx[j];
        if (ps & 1) { // first-child and only-child
            while (!found && (cn = cn.previousSibling)) {
                cn.nodeType === 1 && ++found;
            }
        }
        if (ps & 2) { // last-child and only-child
            cn = node;
            while (!found && (cn = cn.nextSibling)) {
                cn.nodeType === 1 && ++found;
            }
        }
        ((!found) ^ negate) && (rv[++ri] = node);
    }
    return rv;
}

// inner - 7:hover  8:focus  x:active
function actionFilter(ctx, j, jz, negate, ps) {
    var rv = [], ri = -1, node, ok, cs,
        decl = _ie ? "ruby-align:center" : "outline:0 solid #000",
        ss = uu.ss("uuquery2"); // StyleSheetObject

    // http://d.hatena.ne.jp/uupaa/20080928
    ss.add(ps < 8 ? ":hover" : ":focus", decl);

    for (; j < jz; ++j) {
        node = ctx[j];
        ok = _ie ? node.currentStyle.rubyAlign === "center" :
                   (cs = uu.css(node),
                    (cs.outlineWidth + cs.outlineStyle) === "0pxsolid");
        (ok ^ negate) && (rv[++ri] = node);
    }
    ss.clear();
    return rv;
}

// inner - 10:enabled  11:disabled  12:checked
function formFilter(ctx, j, jz, negate, ps) {
    var rv = [], ri = -1, node, ok;

    for (; j < jz; ++j) {
        node = ctx[j];
        ok = (ps === 10) ? !node.disabled
           : (ps === 11) ? !!node.disabled : !!node.checked;
        _QUERY_FORM.test(node.tagName) ? ((ok ^ negate) && (rv[++ri] = node))
                                       : (negate && (rv[++ri] = node));
    }
    return rv;
}

// inner - 13:link  14:visited  15:empty  16:root  17:target
function otherFilter(ctx, j, jz, negate, ps, xmldoc) {
    var rv = [], ri = -1, node, cn, ok = 0, found, word, rex;

    switch (ps) {
    case 13: rex = /^(?:a|area)$/i; break;
    case 14: jz = 0; break;
    case 16: negate || (jz = 0, rv = [doc.html]); break;
    case 17: (word = location.hash.slice(1)) || (jz = 0);
    }

    for (; j < jz; ok = 0, ++j) {
        node = ctx[j];
        switch (ps) {
        case 13: ok = rex.test(node.tagName) && !!node.href; break;
        case 15: found = 0;
                 for (cn = node.firstChild; !found && cn; cn = cn.nextSibling) {
                    cn.nodeType === 1 && ++found;
                 }
                 ok = !found && !node[_textContent]; break;
        case 16: ok = node !== doc.html; break;
        case 17: ok = xmldoc ? (node.id === word)
                             : ((node.id || node.name) === word);
        }
        (ok ^ negate) && (rv[++ri] = node);
    }
    return rv;
}

// inner - 31:nth-child  32:nth-last-child
function nthFilter(ctx, j, jz, negate, ps, anb, xmldoc) {
    if (anb.all) {
        return negate ? [] : ctx;
    }

    var rv = [], ri = -1, nid, lock = {},
        parent, cn, idx, ok, a = anb.a, b = anb.b, k = anb.k,
        iter1 = (ps === 32) ? "lastChild" : "firstChild",
        iter2 = (ps === 32) ? "previousSibling" : "nextSibling",
        tag = ctx[0].tagName;

    xmldoc || (tag = tag.toUpperCase());

    for (; j < jz; ++j) {
        parent = ctx[j].parentNode;
        nid = parent[_uuqid] || (parent[_uuqid] = ++_nodeCount);
        if (!lock[nid]) {
            lock[nid] = 1;
            for (idx = 0, cn = parent[iter1]; cn; cn = cn[iter2]) {
                if (cn.nodeType === 1) {
                    ++idx;
                    ok = k === 1 ? (idx === b)
                       : k === 2 ? (idx >=  b)
                       : k === 3 ? (!((idx - b) % a) && (idx - b) / a >= 0)
                                 : (idx <=  b);
                    (ok ^ negate) && cn.tagName === tag && (rv[++ri] = cn);
                }
            }
        }
    }
    return rv;
}

// inner - 33:nth-of-type  34:nth-last-of-type
function nthTypeFilter(ctx, j, jz, negate, ps, anb) {
    (ps === 34) && ctx.reverse();

    var rv = [], ri = -1, node, tag, parent, parentnid, nid,
        idx, ok = 0, a = anb.a, b = anb.b, k = anb.k,
        tagdb = createTagDB(ctx, 0, jz, ps === 34);

    for (; j < jz; ok = 0, ++j) {
        node = ctx[j];
        tag = node.tagName;
        parent = node.parentNode;
        parentnid = parent[_uuqid] || (parent[_uuqid] = ++_nodeCount);
              nid =   node[_uuqid] || (  node[_uuqid] = ++_nodeCount);

        if (tagdb[parentnid][nid].tag === tag) {
            idx = tagdb[parentnid][nid].pos;
            ok = k === 1 ? (idx === b)
               : k === 2 ? (idx >=  b)
               : k === 3 ? (!((idx - b) % a) && (idx - b) / a >= 0)
                         : (idx <=  b);
        }
        (ok ^ negate) && (rv[++ri] = node);
    }
    (ps === 34) && rv.reverse(); // to document order
    return rv;
}

// tagdb = { parent-nodeid: { child-nodeid: { tag: "DIV", pos: 1 }, ... },
//           parent-nodeid: { child-nodeid: { tag: "DIV", pos: 1 }, ... }, ... }
// inner -
function createTagDB(ctx, j, jz, reverse) { // @param NodeArray:
                                            // @return Hash: tagdb
    var rv = {}, node, parent, parentnid, cn, nid, tagcount, tag, pos,
        iter1 = reverse ? "lastChild" : "firstChild",
        iter2 = reverse ? "previousSibling" : "nextSibling";

    for (; j < jz; ++j) {
        node = ctx[j];
        parent = ctx[j].parentNode;
        parentnid = parent[_uuqid] || (parent[_uuqid] = ++_nodeCount);

        if (!rv[parentnid]) {
            rv[parentnid] = {};
            tagcount = {}; // { "DIV": count }
            for (cn = parent[iter1]; cn; cn = cn[iter2]) {
                if (cn.nodeType === 1) {
                    tag = cn.tagName;
                    pos = tagcount[tag] ? ++tagcount[tag] : (tagcount[tag] = 1);

                    nid = cn[_uuqid] || (cn[_uuqid] = ++_nodeCount);
                    rv[parentnid][nid] = { tag: tag, pos: pos };
                }
            }
        }
    }
    return rv;
}

// inner - 35:lang  36:contains
function otherFunctionFilter(ctx, j, jz, negate, ps, arg) {
    var rv = [], ri = -1, ok = 0, node,
        rex = ps === 35 ? RegExp("^(" + arg + "$|" + arg + "-)", "i") : 0;

    for (; j < jz; ok = 0, ++j) {
        node = ctx[j];
        switch (ps) {
        case 35: while (!node.getAttribute("lang") && (node = node.parentNode)) {}
                 ok = node && rex.test(node.getAttribute("lang")); break;
        case 36: ok = node[_textContent].indexOf(arg) >= 0;
        }
        (ok ^ negate) && (rv[++ri] = node);
    }
    return rv;
}

})(document, uu, uu.ie);
//}@mb

//{@ui
//{@uislider
(function(doc, uu) {

// uu.Class.Slider - generic Slider Widget manage class
uu.Class("Slider", {
    init:           SliderInit,         // init(rail:Node, grip:Node, param:Hash = {})
    attr:           SliderAttr,         // attr(key:String/Hash = void, value:String/Number/Boolean = void):Mix/void
    msgbox:         SliderMsgBox,       // msgbox(msg:String, param:Hash = void):Hash
                                        //  [1][get value] uu.msg.send(*, "getValue") -> { value: 50 }
                                        //  [2][set value] uu.msg.post(*, "setValue", { value: 50, fx: false })
                                        //  [3][get param] uu.msg.send(*, "getParam") -> { ... }
    handleEvent:    SliderHandleEvent   // handleEvent(evt:Event)
}, {
    build:          SliderBuild,        // build(param:Hash, backyard:Node = doc.body):Array
    transform:      SliderTransform,    // transform(node:Node):Array
    isTransform:    SliderIsTransform   // isTransform(node:Node)
});

// uu.Class.Slider.init
function SliderInit(rail,    // @param Node: rail node. <div class="Slider*">
                    grip,    // @param Node: grip node. <div><div class="Slider*Grip" /></div>
                    param) { // @param Hash(= {}): { caption, vertical, toggle, min, max, size,
                             //                      step, value, change, mouseup,
                             //                      mousedown, gripWidth, gripHeight }
                             //    caption    - Boolean(= false):
                             //    vertical   - Boolean(= false): true is vertical
                             //    toggle     - Boolean(= false):
                             //    node       - Node(= null): original node
                             //    min        - Number(= 0);
                             //    max        - Number(= 100):
                             //    size       - Number(= 100): width or height
                             //    step       - Number(= 1):
                             //    value      - Number(= 0):
                             //    change     - Function(= null):
                             //    mouseup    - Function(= null):
                             //    mousedown  - Function(= null):
                             //    gripWidth  - Number(= 13):
                             //    gripHeight - Number(= 18):
    var that = this;

    this.param = param = uu.arg(param, {
        name: "Slider",
        rail: rail,
        grip: grip,
        toggle: false,
        caption: 0,
        vertical: 0,
        min: 0,
        max: 100,
        size: 100,
        step: 1,
        value: 0,
        change: null,
        mouseup: null,
        mousedown: null,
        gripWidth: 13,
        gripHeight: 18
    });
    rail.instance = that;

    param.step < 1 && (param.step = 1);
    param.keyCode = param.vertical ? { 38: -1, 40: 1 } : { 37: -1, 39: 1 };
    param.ox =  param.vertical ? 0 : -parseInt((param.gripWidth  + 1) / 2) + 2;
    param.oy = !param.vertical ? 0 : -parseInt((param.gripHeight + 1) / 2) + 2;

    SliderValue(this, param.value);

    // rail drag events
    uu.bind(rail, uu.env.touch ? "touchstart"
                               : "mousedown,mousewheel", this);

    // key events
    uu.keydown(doc, function(evt) {
        if (rail === doc.activeElement) {
            var key = param.keyCode[uu.event.key(evt).code],
                shift = evt.shiftKey ? 10 : 1; // x10

            key && SliderValue(that, param.value + key * param.step * shift);
        }
    });
}

// uu.Class.Slider.attr
function SliderAttr(key,     // @param String/Hash(= void):
                    value) { // @param Mix(= void):
                             // @return Hash/void:
    var i, v, mem = {};

    switch (uu.complex(key, value)) { // 1: (), 2: (k), 3: (k,v), 4: ({})
    case 1: return this.param;
    case 2: return this.param[key];
    case 3: key = uu.pair(key, value);
    case 4: for (i in key) {
                v = key[i];
                switch (i) {
                case "fx":      mem.fx = v; break;
                case "value":   mem.value = v; break;
                default:        this.param[i] = v;
                }
            }
            if (mem.value !== void 0) {
                SliderValue(this, mem.value, mem.fx || 0);
            }
    }
    return;
}

// uu.Class.Slider.msgbox
function SliderMsgBox(msg,      // @param String:
                      param1,   // @param Mix(= void):
                      param2) { // @param Mix(= void):
                                // @return Hash/void:
    //  [1][get attr]     uu.msg.post(instance, "attr") -> Hash
    //  [2][bind/unbind]  uu.msg.post(instance, "event", { bind, node, type, callback })
    //  [3][set value]    uu.msg.post(instance, "value", 100)
    //  [4][set value fx] uu.msg.post(instance, "value", 100, 100)
    //  [5][get value]    uu.msg.post(instance, "value") -> 100

    switch (msg) {
    case "attr":    return this.attr(param1, param2);
    case "event":   (param1.type === "change") && (this.param.change = +param1.bind);
                    break;
    case "value":   if (param1 !== void 0) {
                        SliderValue(this, param1 || 0, param2 || 0);
                    } else {
                        return this.param.value;
                    }
    }
    return;
}

// uu.Class.Slider.handleEvent
function SliderHandleEvent(evt) {
    var code  = evt.code, rect, threshold,
        param = this.param,
        rail  = param.rail,
        pageX = evt.pageX,
        pageY = evt.pageY,
        dragInfo = rail["data-uuuidrag"],
        dragEvent = uu.env.touch ? "touchmove+,touchend+"
                                 : "mousemove+,mouseup+",
        touches, finger, identifier, i; // for iPhone

    // init drag information
    if (!dragInfo) {
        rail["data-uuuidrag"] = dragInfo = {
            ox: 0, oy: 0, dragging: 0, startValue: 0,
            id: 0, tap: 0 // for iPhone
        };
    }

    if (code === uu.event.codes.mousedown && !dragInfo.dragging) {
        if (uu.env.touch) {
            if (evt.touches) {
                finger = evt.touches[evt.touches.length - 1];
                pageX = finger.pageX;
                pageY = finger.pageY;
                identifier = finger.identifier;
            }
        }
        rect = uu.css.rect(rail, doc.html); // offset from <html>
        threshold = param.value >= (param.max - param.min) * 0.5;
        dragInfo.ox = rect.x + 3; // 3: magic word
        dragInfo.oy = rect.y + 3;
        dragInfo.id = identifier; // touch.identifier
        dragInfo.dragging = 1;
        dragInfo.startValue = threshold ? 1 : 0;
        ++dragInfo.tap;

        uu.bind(uu.ie ? rail : doc, dragEvent, this);

        if (rail !== doc.activeElement) {
            rail.focus();
        }
        SliderMove(this, pageX + param.ox - dragInfo.ox,
                         pageY + param.oy - dragInfo.oy, 1); // 1: fx

        param.mousedown && param.mousedown(evt, rail, param, dragInfo);
    } else if (code === uu.event.codes.mouseup && dragInfo.dragging) {
        if (param.toggle) {
            threshold = param.value >= (param.max - param.min) * 0.5;
            // tap   -> toggle value
            // slide -> magnetic value (1~10 -> 0), (90~99 -> 100)
            SliderValue(this,
                        dragInfo.tap ? (dragInfo.startValue ? param.min : param.max)
                                     : (threshold ? param.max : param.min), 1);
        }
        dragInfo.dragging = 0;
        param.mouseup && param.mouseup(evt, rail, param, dragInfo);

        uu.unbind(uu.ie ? rail : doc, dragEvent, this);
    } else if (code === uu.event.codes.mousemove && dragInfo.dragging) {
        if (uu.env.touch) {
            touches = evt.touches;
            if (touches) {
                i = touches.length;
                while (i--) {
                    finger = touches[i];
                    if (dragInfo.id === finger.identifier) {
                        pageX = finger.pageX;
                        pageY = finger.pageY;
                        break;
                    }
                }
            }
        }
        SliderMove(this, (pageX + param.ox - dragInfo.ox),
                         (pageY + param.oy - dragInfo.oy));

        param.mousemove && param.mousemove(evt, rail, param, dragInfo);
        dragInfo.tap = 0;
    } else if (code === uu.event.codes.mousewheel) {
        if (rail !== doc.activeElement) {
            rail.focus();
        }
        SliderValue(this, param.value + evt.wheel * 10);
    } else if (code >= uu.event.codes.keydown && code <= uu.event.codes.keyup) {
        // keydown, keypress, keyup
        return;
    }
    return false; // uu.event.stop(evt)
}

// inner - get value / set value
function SliderValue(that,  // @param this:
                     value, // @param Number(= void 0):
                     fx) {  // @param Boolean(= false):
                            // @return Number: current value
    if (value !== void 0) {
        var param = that.param, pp = 100 / (param.max - param.min);

        value = (value - param.min) * pp * (param.size * 0.01);
        SliderMove(that, value, value, fx);
    }
    return that.param.value;
}

// inner - move grip
function SliderMove(that, // @param this:
                    px,   // @param Number: pixel value
                    py,   // @param Number: pixel value
                    fx) { // @param Boolean: true is fx
    var param = that.param, x = 0, y = 0, w = param.max - param.min,
        tm = param.size * 0.01, pp = 100 / w,
        round = param.step * pp * tm, threshold = pp * tm / 2;

    if (param.vertical) {
        y = parseInt((py + threshold) / round) * round;
        y = uu.number.range(0, y, tm * 100);
        param.value = Math.round(y / tm / pp + param.min);
        y |= 0;
    } else {
        x = parseInt((px + threshold) / round) * round;
        x = uu.number.range(0, x, tm * 100);
        param.value = Math.round(x / tm / pp + param.min);
        x |= 0;
    }

//{@fx
    if (fx) {
        if (param.toggle) {
            x = uu.number.range(0, x, tm * 71); // magic number

            uu.fx(param.rail, 150, { stop: 1, bgx: x - 36, bgy: y - 80 }); // magic number
        } else {
            uu.fx(param.grip, 150, { stop: 1, x: x, y: y });
        }
    } else {
//}@fx
        if (param.toggle) {
            param.rail.style.backgroundPositionX = (x - 36) + "px";
            param.rail.style.backgroundPositionY = (y - 80) + "px";
        } else {
            param.grip.style.left = x + "px";
            param.grip.style.top  = y + "px";
        }
//{@fx
    }
//}@fx
    // update caption
    param.caption && (param.rail.title = parseInt(param.value));

    // sync
    if (param.node) {
        // update original node.value
        param.node.value = param.value;

        if (param.change) {
            // fire original node.onchange event
            uu.event.fire(param.node, "change");
        }
    }
}

// uu.Class.Slider.build
function SliderBuild(param,      // @param Hash(= {}):
                     backyard) { // @param Node(= doc.body): backyard Node
                                 // @return Array: [SliderClassInstance, RailNode]
    param = uu.arg(param, { min: 0, max: 100, size: 100, step: 1, value: 0,
                            vertical: 0, toggle: 0,
                            gripWidth: 13, gripHeight: 18,
                            change: null, mouseup: null, mousedown: null });
    if (!param.toggle) {
        param.gripWidth  = param.vertical ? param.gripHeight : param.gripWidth;
        param.gripHeight = param.vertical ? param.gripWidth  : param.gripHeight;
    }

    // <div class="Slider**" ui="Slider" tabindex="0" instance={uu.Class.Slider}>
    //      <div class="Slider*Grip" />
    // </div>

    var rail = uu.div("ui,Slider,tabindex,0",
/*{@mb*/              !uu.ready.style.inlineBlock ? "display,inline,zoom,1" : /*}@mb*/ // [IE6][IE7] hasLayout
                      "display,inline-block,top,6px",
                      uu.div()),
        grip = rail.firstChild;

    // add to backyard
    uu.add(rail, backyard || doc.body);

    if (param.toggle) {
        param.min  = 0;
        param.max  = 30;
        param.size = 50;
        param.step = 1;
        rail.className = "SliderT50";
    } else {
        rail.className = param.vertical ? ("SliderV" + param.size)
                                        : ("SliderH" + param.size);
        grip.className = param.vertical ? "SliderVGrip" : "SliderHGrip";
    }

    uu("Slider", rail, grip, param);
    return rail;
}

// uu.Class.Slider.transform
function SliderTransform(node) { // @param Node:
                                 // @return Array: [SliderClassInstance, RailNode, InputRangeNode]
    //
    // <input type="range" value="50" min="0" max="100" ui="Slider" />
    //                                                  ~~~~~~~~~~~
    //          |
    //          |  transform
    //          v
    //
    // <div class="Slider**" ui="Slider" tabindex="0" instance={uu.Class.Slider} />  <- add
    //      <div class="Slider*Grip" />                                              <- add
    // </div>
    // <input type="range" value="50" min="0" max="100"                              <- modify
    //        instance={uu.Class.Slider} style="display:none" />
    //        ~~~~~~~~~~~~~~~~~~~~~~~~~~ ~~~~~~~~~~~~~~~~~~~~
    //

    // pick slider param
    var attrs = uu.attr(node), rail,
        size = parseInt(attrs.size  || 100);

    size = uu.number.range(50, size, 200);

    rail = SliderBuild({
        min:    parseInt(attrs.min  || 0),
        max:    parseInt(attrs.max  || 100),
        size:   size,
        node:   node, // original node. <input type="range" />
        step:   parseInt(attrs.step || 1),
        value:  parseInt(node.value || 0),
        change: uu.event.evaluator(node, "change").length
    });
    node.style.display = "none";
    node.removeAttribute("ui");
    node.instance = rail;
    uu.add(rail, node, "prev");

    return rail;
}

// uu.Class.Slider.isTransform
function SliderIsTransform(node) { // @param Node
    return node.tagName.toLowerCase() === "input" &&
           uu.attr(node, "ui") === "Slider";
}

// --- init ---
uu.ui.bind("Slider", { build:       SliderBuild,
                       transform:   SliderTransform,
                       isTransform: SliderIsTransform });

})(document, uu);
//}@uislider

// UI Styles
uu.image && uu.image(uu.config.img + "ui.png"); // pre-load

uu.ready(function(uu) {
    var ss = uu.ss("ui"),
        img = uu.config.img + "ui.png",
        fmt,
        relative = "relative",
        absolute = "absolute";

//{@uislider
    // Slider
    fmt = 'background:url(@) no-repeat @px @px;position:@;width:@px;height:@px';
    ss.add({ ".SliderH200":  uu.f(fmt, img,  -15,   0, relative, 214,  20),
             ".SliderH150":  uu.f(fmt, img,  -15, -20, relative, 164,  20),
             ".SliderH100":  uu.f(fmt, img,  -15, -40, relative, 114,  20),
             ".SliderH50":   uu.f(fmt, img,  -15, -60, relative,  64,  20),
             ".SliderHGrip": uu.f(fmt, img,    0,   0, absolute,  13,  18),
             ".SliderV200":  uu.f(fmt, img, -230, -15, relative,  20, 214),
             ".SliderV150":  uu.f(fmt, img, -250, -15, relative,  20, 164),
             ".SliderV100":  uu.f(fmt, img, -270, -15, relative,  20, 114),
             ".SliderV50":   uu.f(fmt, img, -290, -15, relative,  20,  64),
             ".SliderVGrip": uu.f(fmt, img, -250,   0, absolute,  18,  13),
             ".SliderHGrip": uu.f(fmt, img,    0,   0, absolute,  13,  18),

             ".SliderT50":   uu.f(fmt, img,  -36, -80, relative,  64,  20) +
                             ";border:1px solid gray;-webkit-border-radius:5px"
              });
//}@uislider
});

//}@ui
