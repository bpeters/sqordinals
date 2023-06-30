/**
 * Minified by jsDelivr using Terser v5.15.1.
 * Original file: /npm/fflate-unzip@0.7.0/lib/index.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
"use strict";var __importDefault=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(exports,"__esModule",{value:!0});const fs_1=__importDefault(require("fs")),path_1=__importDefault(require("path")),mkdirp_1=__importDefault(require("mkdirp")),fflate_1=require("fflate");async function unzip(t,e){var{to:{directory:r,fs:f}}=options(e),i=fflate_1.unzipSync(await open(t));for(let[t,e]of Object.entries(i)){var a=path_1.default.join(r,t);mkdirp_1.default.sync(path_1.default.dirname(a),{fs:f}),f.writeFileSync(a,e)}}async function open(t){return"string"==typeof t?fs_1.default.readFileSync?fs_1.default.readFileSync(t):new Uint8Array(await(await fetch(t)).arrayBuffer()):t instanceof ArrayBuffer?new Uint8Array(t):t}function options(t){if(t){if("string"==typeof t)return{to:{directory:t,fs:fs_1.default}};if(t.to)return"string"==typeof t.to?{to:{directory:t.to,fs:fs_1.default}}:{to:{directory:t.to.directory||"",fs:t.to.fs||fs_1.default}}}return{to:{directory:"",fs:fs_1.default}}}exports.default=unzip;
//# sourceMappingURL=/sm/d966801903b12788313229128e1dbf1b201c225604228488157f4c1711f2bfe8.map
