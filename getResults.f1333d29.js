parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"JZPE":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.createEndpoint=void 0,exports.expose=c,exports.proxy=h,exports.releaseProxy=exports.proxyMarker=void 0,exports.transfer=y,exports.transferHandlers=void 0,exports.windowEndpoint=v,exports.wrap=l;const e=Symbol("Comlink.proxy");exports.proxyMarker=e;const t=Symbol("Comlink.endpoint");exports.createEndpoint=t;const n=Symbol("Comlink.releaseProxy");exports.releaseProxy=n;const r=Symbol("Comlink.thrown"),a=e=>"object"==typeof e&&null!==e||"function"==typeof e,s={canHandle:t=>a(t)&&t[e],serialize(e){const{port1:t,port2:n}=new MessageChannel;return c(e,t),[n,[n]]},deserialize:e=>(e.start(),l(e))},o={canHandle:e=>a(e)&&r in e,serialize({value:e}){let t;return[t=e instanceof Error?{isError:!0,value:{message:e.message,name:e.name,stack:e.stack}}:{isError:!1,value:e},[]]},deserialize(e){if(e.isError)throw Object.assign(new Error(e.value.message),e.value);throw e.value}},i=new Map([["proxy",s],["throw",o]]);function c(e,t=self){t.addEventListener("message",function n(a){if(!a||!a.data)return;const{id:s,type:o,path:i}=Object.assign({path:[]},a.data),u=(a.data.argumentList||[]).map(x);let l;try{const t=i.slice(0,-1).reduce((e,t)=>e[t],e),n=i.reduce((e,t)=>e[t],e);switch(o){case"GET":l=n;break;case"SET":t[i.slice(-1)[0]]=x(a.data.value),l=!0;break;case"APPLY":l=n.apply(t,u);break;case"CONSTRUCT":l=h(new n(...u));break;case"ENDPOINT":{const{port1:t,port2:n}=new MessageChannel;c(e,n),l=y(t,[t])}break;case"RELEASE":l=void 0;break;default:return}}catch(d){l={value:d,[r]:0}}Promise.resolve(l).catch(e=>({value:e,[r]:0})).then(e=>{const[r,a]=b(e);t.postMessage(Object.assign(Object.assign({},r),{id:s}),a),"RELEASE"===o&&(t.removeEventListener("message",n),p(t))})}),t.start&&t.start()}function u(e){return"MessagePort"===e.constructor.name}function p(e){u(e)&&e.close()}function l(e,t){return f(e,[],t)}function d(e){if(e)throw new Error("Proxy has been released and is not useable")}function f(e,r=[],a=function(){}){let s=!1;const o=new Proxy(a,{get(t,a){if(d(s),a===n)return()=>w(e,{type:"RELEASE",path:r.map(e=>e.toString())}).then(()=>{p(e),s=!0});if("then"===a){if(0===r.length)return{then:()=>o};const t=w(e,{type:"GET",path:r.map(e=>e.toString())}).then(x);return t.then.bind(t)}return f(e,[...r,a])},set(t,n,a){d(s);const[o,i]=b(a);return w(e,{type:"SET",path:[...r,n].map(e=>e.toString()),value:o},i).then(x)},apply(n,a,o){d(s);const i=r[r.length-1];if(i===t)return w(e,{type:"ENDPOINT"}).then(x);if("bind"===i)return f(e,r.slice(0,-1));const[c,u]=E(o);return w(e,{type:"APPLY",path:r.map(e=>e.toString()),argumentList:c},u).then(x)},construct(t,n){d(s);const[a,o]=E(n);return w(e,{type:"CONSTRUCT",path:r.map(e=>e.toString()),argumentList:a},o).then(x)}});return o}function m(e){return Array.prototype.concat.apply([],e)}function E(e){const t=e.map(b);return[t.map(e=>e[0]),m(t.map(e=>e[1]))]}exports.transferHandlers=i;const g=new WeakMap;function y(e,t){return g.set(e,t),e}function h(t){return Object.assign(t,{[e]:!0})}function v(e,t=self,n="*"){return{postMessage:(t,r)=>e.postMessage(t,n,r),addEventListener:t.addEventListener.bind(t),removeEventListener:t.removeEventListener.bind(t)}}function b(e){for(const[t,n]of i)if(n.canHandle(e)){const[r,a]=n.serialize(e);return[{type:"HANDLER",name:t,value:r},a]}return[{type:"RAW",value:e},g.get(e)||[]]}function x(e){switch(e.type){case"HANDLER":return i.get(e.name).deserialize(e.value);case"RAW":return e.value}}function w(e,t,n){return new Promise(r=>{const a=L();e.addEventListener("message",function t(n){n.data&&n.data.id&&n.data.id===a&&(e.removeEventListener("message",t),r(n.data))}),e.start&&e.start(),e.postMessage(Object.assign({id:a},t),n)})}function L(){return new Array(4).fill(0).map(()=>Math.floor(Math.random()*Number.MAX_SAFE_INTEGER).toString(16)).join("-")}
},{}],"x0cg":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.init_panic_hook=exports.get_transporter=exports.get_gen3_wild=exports.get_bdsp_wild=exports.get_bdsp_tid=exports.get_bdsp_stationary=exports.default=exports.calculate_pokemon_bdsp_underground=exports.calculate_pokemon=exports.__wbindgen_throw=exports.__wbindgen_object_drop_ref=exports.__wbindgen_json_serialize=exports.__wbindgen_json_parse=exports.__wbg_stack_0ddaca5d1abfb52f=exports.__wbg_shinyresult_new=exports.__wbg_push_284486ca27c6aa8b=exports.__wbg_new_949bbc1147195c4e=exports.__wbg_new_693216e109162396=exports.__wbg_error_09919627ac0992f5=exports.Xorshift=exports.Xoroshiro=exports.ShinyResult=exports.ShinyFilter=exports.Shiny=exports.Result=exports.Pokemon=exports.NatureFilter=exports.Nature=exports.MethodFilter=exports.MT=exports.LeadFilter=exports.Lcrng=exports.HiddenPower=exports.GenderRatio=exports.GenderFilter=exports.Gender=exports.EncounterSlotFilter=exports.EncounterSlot=exports.EncounterFilter=exports.AbilityFilter=exports.Ability=void 0;var e=t(require("./pkg/wasm_bg.wasm"));function t(e){return e&&e.__esModule?e:{default:e}}var r=e.default;exports.default=r;var o=e.default.init_panic_hook;exports.init_panic_hook=o;var _=e.default.get_gen3_wild;exports.get_gen3_wild=_;var a=e.default.get_transporter;exports.get_transporter=a;var s=e.default.get_bdsp_wild;exports.get_bdsp_wild=s;var d=e.default.get_bdsp_tid;exports.get_bdsp_tid=d;var n=e.default.get_bdsp_stationary;exports.get_bdsp_stationary=n;var p=e.default.calculate_pokemon;exports.calculate_pokemon=p;var l=e.default.calculate_pokemon_bdsp_underground;exports.calculate_pokemon_bdsp_underground=l;var i=e.default.__wbg_new_693216e109162396;exports.__wbg_new_693216e109162396=i;var u=e.default.__wbg_stack_0ddaca5d1abfb52f;exports.__wbg_stack_0ddaca5d1abfb52f=u;var x=e.default.__wbg_error_09919627ac0992f5;exports.__wbg_error_09919627ac0992f5=x;var b=e.default.__wbindgen_object_drop_ref;exports.__wbindgen_object_drop_ref=b;var f=e.default.__wbindgen_json_serialize;exports.__wbindgen_json_serialize=f;var g=e.default.__wbindgen_json_parse;exports.__wbindgen_json_parse=g;var c=e.default.__wbg_new_949bbc1147195c4e;exports.__wbg_new_949bbc1147195c4e=c;var w=e.default.__wbg_shinyresult_new;exports.__wbg_shinyresult_new=w;var v=e.default.__wbg_push_284486ca27c6aa8b;exports.__wbg_push_284486ca27c6aa8b=v;var h=e.default.__wbindgen_throw;exports.__wbindgen_throw=h;var F=e.default.HiddenPower;exports.HiddenPower=F;var y=e.default.LeadFilter;exports.LeadFilter=y;var k=e.default.MethodFilter;exports.MethodFilter=k;var S=e.default.AbilityFilter;exports.AbilityFilter=S;var m=e.default.Ability;exports.Ability=m;var j=e.default.NatureFilter;exports.NatureFilter=j;var E=e.default.Nature;exports.Nature=E;var G=e.default.ShinyFilter;exports.ShinyFilter=G;var R=e.default.EncounterFilter;exports.EncounterFilter=R;var M=e.default.Shiny;exports.Shiny=M;var P=e.default.EncounterSlotFilter;exports.EncounterSlotFilter=P;var A=e.default.EncounterSlot;exports.EncounterSlot=A;var L=e.default.GenderRatio;exports.GenderRatio=L;var N=e.default.Gender;exports.Gender=N;var X=e.default.GenderFilter;exports.GenderFilter=X;var z=e.default.Lcrng;exports.Lcrng=z;var H=e.default.MT;exports.MT=H;var T=e.default.Pokemon;exports.Pokemon=T;var q=e.default.Result;exports.Result=q;var O=e.default.ShinyResult;exports.ShinyResult=O;var B=e.default.Xoroshiro;exports.Xoroshiro=B;var C=e.default.Xorshift;exports.Xorshift=C;
},{"./pkg/wasm_bg.wasm":"lGJG"}],"MTfO":[function(require,module,exports) {
"use strict";var e=require("comlink"),r=require("../../../../wasm/Cargo.toml");(0,e.expose)(r.calculate_pokemon_bdsp_underground);
},{"comlink":"JZPE","../../../../wasm/Cargo.toml":"x0cg"}],"FheM":[function(require,module,exports) {
var t=null;function e(){return t||(t=n()),t}function n(){try{throw new Error}catch(e){var t=(""+e.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);if(t)return r(t[0])}return"/"}function r(t){return(""+t).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)?\/[^/]+(?:\?.*)?$/,"$1")+"/"}exports.getBundleURL=e,exports.getBaseURL=r;
},{}],"TUK3":[function(require,module,exports) {
var r=require("./bundle-url").getBundleURL;function e(r){Array.isArray(r)||(r=[r]);var e=r[r.length-1];try{return Promise.resolve(require(e))}catch(n){if("MODULE_NOT_FOUND"===n.code)return new s(function(n,i){t(r.slice(0,-1)).then(function(){return require(e)}).then(n,i)});throw n}}function t(r){return Promise.all(r.map(u))}var n={};function i(r,e){n[r]=e}module.exports=exports=e,exports.load=t,exports.register=i;var o={};function u(e){var t;if(Array.isArray(e)&&(t=e[1],e=e[0]),o[e])return o[e];var i=(e.substring(e.lastIndexOf(".")+1,e.length)||e).toLowerCase(),u=n[i];return u?o[e]=u(r()+e).then(function(r){return r&&module.bundle.register(t,r),r}).catch(function(r){throw delete o[e],r}):void 0}function s(r){this.executor=r,this.promise=null}s.prototype.then=function(r,e){return null===this.promise&&(this.promise=new Promise(this.executor)),this.promise.then(r,e)},s.prototype.catch=function(r){return null===this.promise&&(this.promise=new Promise(this.executor)),this.promise.catch(r)};
},{"./bundle-url":"FheM"}],"rDCW":[function(require,module,exports) {

},{}],"fISM":[function(require,module,exports) {
var __dirname = "/home/runner/work/PokemonRNGTools/PokemonRNGTools/node_modules/parcel-plugin-wasm.rs";
var t,e="/home/runner/work/PokemonRNGTools/PokemonRNGTools/node_modules/parcel-plugin-wasm.rs";const _={},r=new Array(32).fill(void 0);function n(t){return r[t]}r.push(void 0,null,!0,!1);let s=r.length;function i(t){t<36||(r[t]=s,s=t)}function o(t){const e=n(t);return i(t),e}let a=0,l=null;function u(){return null!==l&&l.buffer===t.memory.buffer||(l=new Uint8Array(t.memory.buffer)),l}const c="undefined"==typeof TextEncoder?(0,module.require)("util").TextEncoder:TextEncoder;let g=new c("utf-8");const d="function"==typeof g.encodeInto?function(t,e){return g.encodeInto(t,e)}:function(t,e){const _=g.encode(t);return e.set(_),{read:t.length,written:_.length}};function h(t,e,_){if(void 0===_){const _=g.encode(t),r=e(_.length);return u().subarray(r,r+_.length).set(_),a=_.length,r}let r=t.length,n=e(r);const s=u();let i=0;for(;i<r;i++){const e=t.charCodeAt(i);if(e>127)break;s[n+i]=e}if(i!==r){0!==i&&(t=t.slice(i)),n=_(n,r,r=i+3*t.length);const e=u().subarray(n+i,n+r);i+=d(t,e).written}return a=i,n}let b=null;function y(){return null!==b&&b.buffer===t.memory.buffer||(b=new Int32Array(t.memory.buffer)),b}const p="undefined"==typeof TextDecoder?(0,module.require)("util").TextDecoder:TextDecoder;let w=new p("utf-8",{ignoreBOM:!0,fatal:!0});function f(t,e){return w.decode(u().subarray(t,t+e))}function m(t){s===r.length&&r.push(r.length+1);const e=s;return s=r[e],r[e]=t,e}w.decode();let S=null;function v(){return null!==S&&S.buffer===t.memory.buffer||(S=new Uint32Array(t.memory.buffer)),S}function k(t,e){return v().subarray(t/4,t/4+e)}function A(t,e){const _=e(4*t.length);return v().set(t,_/4),a=t.length,_}_.init_panic_hook=function(){t.init_panic_hook()};let M=32;function F(t){if(1==M)throw new Error("out of js stack");return r[--M]=t,M}_.get_gen3_wild=function(e){try{return o(t.get_gen3_wild(F(e)))}finally{r[M++]=void 0}},_.get_transporter=function(e){try{return o(t.get_transporter(F(e)))}finally{r[M++]=void 0}},_.get_bdsp_wild=function(e){try{return o(t.get_bdsp_wild(F(e)))}finally{r[M++]=void 0}},_.get_bdsp_tid=function(e){try{return o(t.get_bdsp_tid(F(e)))}finally{r[M++]=void 0}},_.get_bdsp_stationary=function(e){try{return o(t.get_bdsp_stationary(F(e)))}finally{r[M++]=void 0}};const j=new Uint32Array(2),N=new BigUint64Array(j.buffer);_.calculate_pokemon=function(e,_,r,n,s,i,a,l,u,c,g){N[0]=e;const d=j[0],h=j[1];N[0]=_;const b=j[0],y=j[1];return o(t.calculate_pokemon(d,h,b,y,r,n,s,i,a,l,u,c,g))},_.calculate_pokemon_bdsp_underground=function(e,_,r,n,s,i,l,u,c,g,d,h,b,y,p,w,f,m){var S=A(c,t.__wbindgen_malloc),v=a,k=A(f,t.__wbindgen_malloc),M=a,F=A(m,t.__wbindgen_malloc),j=a;return o(t.calculate_pokemon_bdsp_underground(e,_,r,n,s,i,l,u,S,v,g,d,h,b,y,p,w,k,M,F,j))},_.HiddenPower=Object.freeze({Fighting:0,0:"Fighting",Flying:1,1:"Flying",Poison:2,2:"Poison",Ground:3,3:"Ground",Rock:4,4:"Rock",Bug:5,5:"Bug",Ghost:6,6:"Ghost",Steel:7,7:"Steel",Fire:8,8:"Fire",Water:9,9:"Water",Grass:10,10:"Grass",Electric:11,11:"Electric",Psychic:12,12:"Psychic",Ice:13,13:"Ice",Dragon:14,14:"Dragon",Dark:15,15:"Dark",Invalid:16,16:"Invalid"}),_.LeadFilter=Object.freeze({None:0,0:"None",Synchronize:1,1:"Synchronize"}),_.MethodFilter=Object.freeze({MethodH1:1,1:"MethodH1",MethodH2:2,2:"MethodH2",MethodH4:4,4:"MethodH4"}),_.AbilityFilter=Object.freeze({Any:3,3:"Any",Ability0:0,0:"Ability0",Ability1:1,1:"Ability1"}),_.Ability=Object.freeze({Ability0:0,0:"Ability0",Ability1:1,1:"Ability1"}),_.NatureFilter=Object.freeze({Hardy:0,0:"Hardy",Lonely:1,1:"Lonely",Brave:2,2:"Brave",Adamant:3,3:"Adamant",Naughty:4,4:"Naughty",Bold:5,5:"Bold",Docile:6,6:"Docile",Relaxed:7,7:"Relaxed",Impish:8,8:"Impish",Lax:9,9:"Lax",Timid:10,10:"Timid",Hasty:11,11:"Hasty",Serious:12,12:"Serious",Jolly:13,13:"Jolly",Naive:14,14:"Naive",Modest:15,15:"Modest",Mild:16,16:"Mild",Quiet:17,17:"Quiet",Bashful:18,18:"Bashful",Rash:19,19:"Rash",Calm:20,20:"Calm",Gentle:21,21:"Gentle",Sassy:22,22:"Sassy",Careful:23,23:"Careful",Quirky:24,24:"Quirky",Any:25,25:"Any"}),_.Nature=Object.freeze({Hardy:0,0:"Hardy",Lonely:1,1:"Lonely",Brave:2,2:"Brave",Adamant:3,3:"Adamant",Naughty:4,4:"Naughty",Bold:5,5:"Bold",Docile:6,6:"Docile",Relaxed:7,7:"Relaxed",Impish:8,8:"Impish",Lax:9,9:"Lax",Timid:10,10:"Timid",Hasty:11,11:"Hasty",Serious:12,12:"Serious",Jolly:13,13:"Jolly",Naive:14,14:"Naive",Modest:15,15:"Modest",Mild:16,16:"Mild",Quiet:17,17:"Quiet",Bashful:18,18:"Bashful",Rash:19,19:"Rash",Calm:20,20:"Calm",Gentle:21,21:"Gentle",Sassy:22,22:"Sassy",Careful:23,23:"Careful",Quirky:24,24:"Quirky",Synchronize:25,25:"Synchronize"}),_.ShinyFilter=Object.freeze({None:0,0:"None",Star:1,1:"Star",Square:2,2:"Square",Both:3,3:"Both",Any:4,4:"Any"}),_.EncounterFilter=Object.freeze({Static:0,0:"Static",Dynamic:1,1:"Dynamic"}),_.Shiny=Object.freeze({None:0,0:"None",Star:1,1:"Star",Square:2,2:"Square",Both:3,3:"Both",All:4,4:"All"}),_.EncounterSlotFilter=Object.freeze({Any:12,12:"Any",Slot0:0,0:"Slot0",Slot1:1,1:"Slot1",Slot2:2,2:"Slot2",Slot3:3,3:"Slot3",Slot4:4,4:"Slot4",Slot5:5,5:"Slot5",Slot6:6,6:"Slot6",Slot7:7,7:"Slot7",Slot8:8,8:"Slot8",Slot9:9,9:"Slot9",Slot10:10,10:"Slot10",Slot11:11,11:"Slot11"}),_.EncounterSlot=Object.freeze({Slot0:0,0:"Slot0",Slot1:1,1:"Slot1",Slot2:2,2:"Slot2",Slot3:3,3:"Slot3",Slot4:4,4:"Slot4",Slot5:5,5:"Slot5",Slot6:6,6:"Slot6",Slot7:7,7:"Slot7",Slot8:8,8:"Slot8",Slot9:9,9:"Slot9",Slot10:10,10:"Slot10",Slot11:11,11:"Slot11"}),_.GenderRatio=Object.freeze({NoSetGender:256,256:"NoSetGender",Genderless:255,255:"Genderless",Male50Female50:127,127:"Male50Female50",Male25Female75:191,191:"Male25Female75",Male75Female25:63,63:"Male75Female25",Male875Female125:31,31:"Male875Female125",Male:0,0:"Male",Female:254,254:"Female"}),_.Gender=Object.freeze({Genderless:255,255:"Genderless",Male:0,0:"Male",Female:254,254:"Female"}),_.GenderFilter=Object.freeze({Any:256,256:"Any",Male:0,0:"Male",Female:254,254:"Female"});class B{__destroy_into_raw(){const t=this.ptr;return this.ptr=0,t}free(){const e=this.__destroy_into_raw();t.__wbg_lcrng_free(e)}}class G{__destroy_into_raw(){const t=this.ptr;return this.ptr=0,t}free(){const e=this.__destroy_into_raw();t.__wbg_mt_free(e)}}class z{__destroy_into_raw(){const t=this.ptr;return this.ptr=0,t}free(){const e=this.__destroy_into_raw();t.__wbg_pokemon_free(e)}get shiny_value(){return t.__wbg_get_pokemon_shiny_value(this.ptr)>>>0}set shiny_value(e){t.__wbg_set_pokemon_shiny_value(this.ptr,e)}get pid(){return t.__wbg_get_pokemon_pid(this.ptr)>>>0}set pid(e){t.__wbg_set_pokemon_pid(this.ptr,e)}get ec(){return t.__wbg_get_pokemon_ec(this.ptr)>>>0}set ec(e){t.__wbg_set_pokemon_ec(this.ptr,e)}get nature(){return t.__wbg_get_pokemon_nature(this.ptr)>>>0}set nature(e){t.__wbg_set_pokemon_nature(this.ptr,e)}get ivs(){try{const n=t.__wbindgen_add_to_stack_pointer(-16);t.__wbg_get_pokemon_ivs(n,this.ptr);var e=y()[n/4+0],_=y()[n/4+1],r=k(e,_).slice();return t.__wbindgen_free(e,4*_),r}finally{t.__wbindgen_add_to_stack_pointer(16)}}set ivs(e){var _=A(e,t.__wbindgen_malloc),r=a;t.__wbg_set_pokemon_ivs(this.ptr,_,r)}get ability(){return t.__wbg_get_pokemon_ability(this.ptr)>>>0}set ability(e){t.__wbg_set_pokemon_ability(this.ptr,e)}get gender(){return t.__wbg_get_pokemon_gender(this.ptr)>>>0}set gender(e){t.__wbg_set_pokemon_gender(this.ptr,e)}get encounter(){return t.__wbg_get_pokemon_encounter(this.ptr)>>>0}set encounter(e){t.__wbg_set_pokemon_encounter(this.ptr,e)}get advances(){return t.__wbg_get_pokemon_advances(this.ptr)>>>0}set advances(e){t.__wbg_set_pokemon_advances(this.ptr,e)}get is_rare(){return 0!==t.__wbg_get_pokemon_is_rare(this.ptr)}set is_rare(e){t.__wbg_set_pokemon_is_rare(this.ptr,e)}}class O{__destroy_into_raw(){const t=this.ptr;return this.ptr=0,t}free(){const e=this.__destroy_into_raw();t.__wbg_result_free(e)}get state0(){return t.__wbg_get_pokemon_pid(this.ptr)>>>0}set state0(e){t.__wbg_set_pokemon_pid(this.ptr,e)}get state1(){return t.__wbg_get_pokemon_ec(this.ptr)>>>0}set state1(e){t.__wbg_set_pokemon_ec(this.ptr,e)}get state2(){return t.__wbg_get_pokemon_encounter(this.ptr)>>>0}set state2(e){t.__wbg_set_pokemon_encounter(this.ptr,e)}get state3(){return t.__wbg_get_pokemon_advances(this.ptr)>>>0}set state3(e){t.__wbg_set_pokemon_advances(this.ptr,e)}get advances(){return t.__wbg_get_result_advances(this.ptr)>>>0}set advances(e){t.__wbg_set_result_advances(this.ptr,e)}get shiny_value(){return t.__wbg_get_result_shiny_value(this.ptr)>>>0}set shiny_value(e){t.__wbg_set_result_shiny_value(this.ptr,e)}get pid(){return t.__wbg_get_result_pid(this.ptr)>>>0}set pid(e){t.__wbg_set_result_pid(this.ptr,e)}get ec(){return t.__wbg_get_result_ec(this.ptr)>>>0}set ec(e){t.__wbg_set_result_ec(this.ptr,e)}get nature(){return t.__wbg_get_result_nature(this.ptr)>>>0}set nature(e){t.__wbg_set_result_nature(this.ptr,e)}get ivs(){try{const n=t.__wbindgen_add_to_stack_pointer(-16);t.__wbg_get_result_ivs(n,this.ptr);var e=y()[n/4+0],_=y()[n/4+1],r=k(e,_).slice();return t.__wbindgen_free(e,4*_),r}finally{t.__wbindgen_add_to_stack_pointer(16)}}set ivs(e){var _=A(e,t.__wbindgen_malloc),r=a;t.__wbg_set_result_ivs(this.ptr,_,r)}get ability(){return t.__wbg_get_result_ability(this.ptr)>>>0}set ability(e){t.__wbg_set_result_ability(this.ptr,e)}get gender(){return t.__wbg_get_result_gender(this.ptr)>>>0}set gender(e){t.__wbg_set_result_gender(this.ptr,e)}}class x{static __wrap(t){const e=Object.create(x.prototype);return e.ptr=t,e}__destroy_into_raw(){const t=this.ptr;return this.ptr=0,t}free(){const e=this.__destroy_into_raw();t.__wbg_shinyresult_free(e)}get state0(){try{const r=t.__wbindgen_add_to_stack_pointer(-16);t.__wbg_get_shinyresult_state0(r,this.ptr);var e=y()[r/4+0],_=y()[r/4+1];return j[0]=e,j[1]=_,N[0]}finally{t.__wbindgen_add_to_stack_pointer(16)}}set state0(e){N[0]=e;const _=j[0],r=j[1];t.__wbg_set_shinyresult_state0(this.ptr,_,r)}get state1(){try{const r=t.__wbindgen_add_to_stack_pointer(-16);t.__wbg_get_shinyresult_state1(r,this.ptr);var e=y()[r/4+0],_=y()[r/4+1];return j[0]=e,j[1]=_,N[0]}finally{t.__wbindgen_add_to_stack_pointer(16)}}set state1(e){N[0]=e;const _=j[0],r=j[1];t.__wbg_set_shinyresult_state1(this.ptr,_,r)}get advances(){return t.__wbg_get_shinyresult_advances(this.ptr)>>>0}set advances(e){t.__wbg_set_shinyresult_advances(this.ptr,e)}get shiny_value(){return t.__wbg_get_shinyresult_shiny_value(this.ptr)>>>0}set shiny_value(e){t.__wbg_set_shinyresult_shiny_value(this.ptr,e)}get ec(){return t.__wbg_get_shinyresult_ec(this.ptr)>>>0}set ec(e){t.__wbg_set_shinyresult_ec(this.ptr,e)}get pid(){return t.__wbg_get_shinyresult_pid(this.ptr)>>>0}set pid(e){t.__wbg_set_shinyresult_pid(this.ptr,e)}get nature(){return t.__wbg_get_shinyresult_nature(this.ptr)>>>0}set nature(e){t.__wbg_set_shinyresult_nature(this.ptr,e)}get ability(){return t.__wbg_get_shinyresult_ability(this.ptr)>>>0}set ability(e){t.__wbg_set_shinyresult_ability(this.ptr,e)}}class H{__destroy_into_raw(){const t=this.ptr;return this.ptr=0,t}free(){const e=this.__destroy_into_raw();t.__wbg_xoroshiro_free(e)}}class R{__destroy_into_raw(){const t=this.ptr;return this.ptr=0,t}free(){const e=this.__destroy_into_raw();t.__wbg_xorshift_free(e)}}function D(e){const r=fetch(e);let n;return(n="function"==typeof WebAssembly.instantiateStreaming?WebAssembly.instantiateStreaming(r,{"./wasm_bg.js":_}):r.then(t=>t.arrayBuffer()).then(t=>WebAssembly.instantiate(t,{"./wasm_bg.js":_}))).then(({instance:e})=>{t=D.wasm=e.exports,_.wasm=t})}function T(r){const n=require("fs");return new Promise(function(t,_){n.readFile(e+r,function(e,r){e?_(e):t(r.buffer)})}).then(t=>WebAssembly.instantiate(t,{"./wasm_bg":_})).then(({instance:e})=>{t=D.wasm=e.exports,_.wasm=t})}_.__wbg_new_693216e109162396=function(){return m(new Error)},_.__wbg_stack_0ddaca5d1abfb52f=function(e,_){var r=h(n(_).stack,t.__wbindgen_malloc,t.__wbindgen_realloc),s=a;y()[e/4+1]=s,y()[e/4+0]=r},_.__wbg_error_09919627ac0992f5=function(e,_){try{console.error(f(e,_))}finally{t.__wbindgen_free(e,_)}},_.__wbindgen_object_drop_ref=function(t){o(t)},_.__wbindgen_json_serialize=function(e,_){const r=n(_);var s=h(JSON.stringify(void 0===r?null:r),t.__wbindgen_malloc,t.__wbindgen_realloc),i=a;y()[e/4+1]=i,y()[e/4+0]=s},_.__wbindgen_json_parse=function(t,e){return m(JSON.parse(f(t,e)))},_.__wbg_new_949bbc1147195c4e=function(){return m(new Array)},_.__wbg_shinyresult_new=function(t){return m(x.__wrap(t))},_.__wbg_push_284486ca27c6aa8b=function(t,e){return n(t).push(n(e))},_.__wbindgen_throw=function(t,e){throw new Error(f(t,e))},_.Lcrng=B,_.MT=G,_.Pokemon=z,_.Result=O,_.ShinyResult=x,_.Xoroshiro=H,_.Xorshift=R;const E=Object.assign(D,_);module.exports=function(t){return E(t).then(()=>_)};
},{"fs":"rDCW"}],0:[function(require,module,exports) {
var b=require("TUK3");b.register("wasm",require("fISM"));b.load([["wasm_bg.cac38f6a.wasm","lGJG"]]).then(function(){require("MTfO");});
},{}]},{},[0], null)
//# sourceMappingURL=/getResults.f1333d29.js.map