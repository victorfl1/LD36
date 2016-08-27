// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/*!
    localForage -- Offline Storage, Improved
    Version 1.2.7
    https://mozilla.github.io/localForage
    (c) 2013-2015 Mozilla, Apache License 2.0
*/
(function(){var h,v,w;(function(){var g={},e={};h=function(b,a,f){g[b]={deps:a,callback:f}};w=v=function(b){function a(a){if("."!==a.charAt(0))return a;a=a.split("/");for(var d=b.split("/").slice(0,-1),c=0,q=a.length;c<q;c++){var f=a[c];".."===f?d.pop():"."!==f&&d.push(f)}return d.join("/")}w._eak_seen=g;if(e[b])return e[b];e[b]={};if(!g[b])throw Error("Could not find module "+b);for(var f=g[b],q=f.deps,f=f.callback,c=[],k,p=0,r=q.length;p<r;p++)"exports"===q[p]?c.push(k={}):c.push(v(a(q[p])));q=
f.apply(this,c);return e[b]=k||q}})();h("promise/all",["./utils","exports"],function(g,e){var b=g.isArray,a=g.isFunction;e.all=function(f){if(!b(f))throw new TypeError("You must pass an array to all.");return new this(function(b,c){function k(d){return function(a){e[d]=a;0===--g&&b(e)}}var e=[],g=f.length,u;0===g&&b([]);for(var d=0;d<f.length;d++)(u=f[d])&&a(u.then)?u.then(k(d),c):(e[d]=u,0===--g&&b(e))})}});h("promise/asap",["exports"],function(g){function e(){return function(){process.nextTick(f)}}
function b(){var a=0,d=new c(f),b=document.createTextNode("");d.observe(b,{characterData:!0});return function(){b.data=a=++a%2}}function a(){return function(){k.setTimeout(f,1)}}function f(){for(var a=0;a<p.length;a++){var d=p[a];(0,d[0])(d[1])}p=[]}var q="undefined"!==typeof window?window:{},c=q.MutationObserver||q.WebKitMutationObserver,k="undefined"!==typeof global?global:void 0===this?window:this,p=[],r;r="undefined"!==typeof process&&"[object process]"==={}.toString.call(process)?e():c?b():a();
g.asap=function(a,d){1===p.push([a,d])&&r()}});h("promise/config",["exports"],function(g){var e={instrument:!1};g.config=e;g.configure=function(b,a){if(2===arguments.length)e[b]=a;else return e[b]}});h("promise/polyfill",["./promise","./utils","exports"],function(g,e,b){var a=g.Promise,f=e.isFunction;b.polyfill=function(){var b;b="undefined"!==typeof global?global:"undefined"!==typeof window&&window.document?window:self;"Promise"in b&&"resolve"in b.Promise&&"reject"in b.Promise&&"all"in b.Promise&&
"race"in b.Promise&&function(){var a;new b.Promise(function(b){a=b});return f(a)}()||(b.Promise=a)}});h("promise/promise","./config ./utils ./all ./race ./resolve ./reject ./asap exports".split(" "),function(g,e,b,a,f,q,c,k){function p(a){if(!D(a))throw new TypeError("You must pass a resolver function as the first argument to the promise constructor");if(!(this instanceof p))throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
this._subscribers=[];r(a,this)}function r(a,d){function b(a){A(d,a)}function c(a){z(d,a)}try{a(b,c)}catch(n){c(n)}}function u(a,d,b,c){var n=D(b),x,y,B,f;if(n)try{x=b(c),B=!0}catch(C){f=!0,y=C}else x=c,B=!0;m(d,x)||(n&&B?A(d,x):f?z(d,y):a===E?A(d,x):a===F&&z(d,x))}function d(a,d,b,c){a=a._subscribers;var n=a.length;a[n]=d;a[n+E]=b;a[n+F]=c}function l(a,d){for(var b,c,n=a._subscribers,x=a._detail,y=0;y<n.length;y+=3)b=n[y],c=n[y+d],u(d,b,c,x);a._subscribers=null}function m(a,d){var b=null,c;try{if(a===
d)throw new TypeError("A promises callback cannot return that same promise.");if(y(d)&&(b=d.then,D(b)))return b.call(d,function(b){if(c)return!0;c=!0;d!==b?A(a,b):t(a,b)},function(d){if(c)return!0;c=!0;z(a,d)}),!0}catch(n){if(c)return!0;z(a,n);return!0}return!1}function A(a,d){a===d?t(a,d):m(a,d)||t(a,d)}function t(a,d){a._state===G&&(a._state=C,a._detail=d,n.async(x,a))}function z(a,d){a._state===G&&(a._state=C,a._detail=d,n.async(B,a))}function x(a){l(a,a._state=E)}function B(a){l(a,a._state=F)}
var n=g.config,y=e.objectOrFunction,D=e.isFunction;g=b.all;a=a.race;f=f.resolve;q=q.reject;n.async=c.asap;var G=void 0,C=0,E=1,F=2;p.prototype={constructor:p,_state:void 0,_detail:void 0,_subscribers:void 0,then:function(a,b){var c=this,x=new this.constructor(function(){});if(this._state){var y=arguments;n.async(function(){u(c._state,x,y[c._state-1],c._detail)})}else d(this,x,a,b);return x},"catch":function(a){return this.then(null,a)}};p.all=g;p.race=a;p.resolve=f;p.reject=q;k.Promise=p});h("promise/race",
["./utils","exports"],function(g,e){var b=g.isArray;e.race=function(a){if(!b(a))throw new TypeError("You must pass an array to race.");return new this(function(b,e){for(var c,k=0;k<a.length;k++)(c=a[k])&&"function"===typeof c.then?c.then(b,e):b(c)})}});h("promise/reject",["exports"],function(g){g.reject=function(e){return new this(function(b,a){a(e)})}});h("promise/resolve",["exports"],function(g){g.resolve=function(e){return e&&"object"===typeof e&&e.constructor===this?e:new this(function(b){b(e)})}});
h("promise/utils",["exports"],function(g){function e(a){return"function"===typeof a}var b=Date.now||function(){return(new Date).getTime()};g.objectOrFunction=function(a){return e(a)||"object"===typeof a&&null!==a};g.isFunction=e;g.isArray=function(a){return"[object Array]"===Object.prototype.toString.call(a)};g.now=b});v("promise/polyfill").polyfill()})();
(function(){function h(b){var a=.75*b.length,f=b.length,e=0,c,k,g,r;"="===b[b.length-1]&&(a--,"="===b[b.length-2]&&a--);for(var u=new ArrayBuffer(a),d=new Uint8Array(u),a=0;a<f;a+=4)c="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(b[a]),k="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(b[a+1]),g="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(b[a+2]),r="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(b[a+
3]),d[e++]=c<<2|k>>4,d[e++]=(k&15)<<4|g>>2,d[e++]=(g&3)<<6|r&63;return u}function v(b){b=new Uint8Array(b);var a="",f;for(f=0;f<b.length;f+=3)a+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[b[f]>>2],a+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[(b[f]&3)<<4|b[f+1]>>4],a+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[(b[f+1]&15)<<2|b[f+2]>>6],a+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[b[f+2]&63];2===b.length%
3?a=a.substring(0,a.length-1)+"=":1===b.length%3&&(a=a.substring(0,a.length-2)+"==");return a}var w=/^~~local_forage_type~([^~]+)~/,g=this,e={serialize:function(b,a){var f="";b&&(f=b.toString());if(b&&("[object ArrayBuffer]"===b.toString()||b.buffer&&"[object ArrayBuffer]"===b.buffer.toString())){var e,c="__lfsc__:";b instanceof ArrayBuffer?(e=b,c+="arbf"):(e=b.buffer,"[object Int8Array]"===f?c+="si08":"[object Uint8Array]"===f?c+="ui08":"[object Uint8ClampedArray]"===f?c+="uic8":"[object Int16Array]"===
f?c+="si16":"[object Uint16Array]"===f?c+="ur16":"[object Int32Array]"===f?c+="si32":"[object Uint32Array]"===f?c+="ui32":"[object Float32Array]"===f?c+="fl32":"[object Float64Array]"===f?c+="fl64":a(Error("Failed to get type for BinaryArray")));a(c+v(e))}else if("[object Blob]"===f)f=new FileReader,f.onload=function(){var c="~~local_forage_type~"+b.type+"~"+v(this.result);a("__lfsc__:blob"+c)},f.readAsArrayBuffer(b);else try{a(JSON.stringify(b))}catch(g){console.error("Couldn't convert value into a JSON string: ",
b),a(null,g)}},deserialize:function(b){if("__lfsc__:"!==b.substring(0,9))return JSON.parse(b);var a=b.substring(13);b=b.substring(9,13);var e;if("blob"===b&&w.test(a)){var q=a.match(w);e=q[1];a=a.substring(q[0].length)}a=h(a);switch(b){case "arbf":return a;case "blob":var c;a=[a];e={type:e};a=a||[];e=e||{};try{c=new Blob(a,e)}catch(k){if("TypeError"!==k.name)throw k;c=new (g.BlobBuilder||g.MSBlobBuilder||g.MozBlobBuilder||g.WebKitBlobBuilder);for(b=0;b<a.length;b+=1)c.append(a[b]);c=c.getBlob(e.type)}return c;
case "si08":return new Int8Array(a);case "ui08":return new Uint8Array(a);case "uic8":return new Uint8ClampedArray(a);case "si16":return new Int16Array(a);case "ur16":return new Uint16Array(a);case "si32":return new Int32Array(a);case "ui32":return new Uint32Array(a);case "fl32":return new Float32Array(a);case "fl64":return new Float64Array(a);default:throw Error("Unkown type: "+b);}},stringToBuffer:h,bufferToString:v};"undefined"!==typeof module&&module.exports&&"undefined"!==typeof require?module.exports=
e:"function"===typeof define&&define.amd?define("localforageSerializer",function(){return e}):this.localforageSerializer=e}).call(window);
(function(){function h(a,d){a=a||[];d=d||{};try{return new Blob(a,d)}catch(b){if("TypeError"!==b.name)throw b;for(var c=new (window.BlobBuilder||window.MSBlobBuilder||window.MozBlobBuilder||window.WebKitBlobBuilder),e=0;e<a.length;e+=1)c.append(a[e]);return c.getBlob(d.type)}}function v(a){return new m(function(d,b){var c=new XMLHttpRequest;c.open("GET",a);c.withCredentials=!0;c.responseType="arraybuffer";c.onreadystatechange=function(){if(4===c.readyState){if(200===c.status)return d({response:c.response,
type:c.getResponseHeader("Content-Type")});b({status:c.status,response:c.response})}};c.send()})}function w(a){return(new m(function(d,c){var b=h([""],{type:"image/png"}),e=a.transaction(["local-forage-detect-blob-support"],"readwrite");e.objectStore("local-forage-detect-blob-support").put(b,"key");e.oncomplete=function(){var b=a.transaction(["local-forage-detect-blob-support"],"readwrite").objectStore("local-forage-detect-blob-support").get("key");b.onerror=c;b.onsuccess=function(a){var b=URL.createObjectURL(a.target.result);
v(b).then(function(a){d(!(!a||"image/png"!==a.type))},function(){d(!1)}).then(function(){URL.revokeObjectURL(b)})}}}))["catch"](function(){return!1})}function g(a){return"boolean"===typeof t?m.resolve(t):w(a).then(function(a){return t=a})}function e(a){return new m(function(d,b){var c=new FileReader;c.onerror=b;c.onloadend=function(b){b=btoa(b.target.result||"");d({__local_forage_encoded_blob:!0,data:b,type:a.type})};c.readAsBinaryString(a)})}function b(a){for(var d=atob(a.data),b=d.length,c=new ArrayBuffer(b),
e=new Uint8Array(c),g=0;g<b;g++)e[g]=d.charCodeAt(g);return h([c],{type:a.type})}function a(a){var d=this,b={db:null};if(a)for(var c in a)b[c]=a[c];return new m(function(a,c){var e=A.open(b.name,b.version);e.onerror=function(){c(e.error)};e.onupgradeneeded=function(a){e.result.createObjectStore(b.storeName);1>=a.oldVersion&&e.result.createObjectStore("local-forage-detect-blob-support")};e.onsuccess=function(){b.db=e.result;d._dbInfo=b;a()}})}function f(a,d){var c=this;"string"!==typeof a&&(window.console.warn(a+
" used as a key, but it is not a string."),a=String(a));var e=new m(function(d,e){c.ready().then(function(){var g=c._dbInfo,f=g.db.transaction(g.storeName,"readonly").objectStore(g.storeName).get(a);f.onsuccess=function(){var a=f.result;void 0===a&&(a=null);a&&a.__local_forage_encoded_blob&&(a=b(a));d(a)};f.onerror=function(){e(f.error)}})["catch"](e)});l(e,d);return e}function q(a,d){var c=this,e=new m(function(d,e){c.ready().then(function(){var g=c._dbInfo,f=g.db.transaction(g.storeName,"readonly").objectStore(g.storeName).openCursor(),
t=1;f.onsuccess=function(){var c=f.result;if(c){var e=c.value;e&&e.__local_forage_encoded_blob&&(e=b(e));e=a(e,c.key,t++);if(void 0!==e)d(e);else c["continue"]()}else d()};f.onerror=function(){e(f.error)}})["catch"](e)});l(e,d);return e}function c(a,d,c){var b=this;"string"!==typeof a&&(window.console.warn(a+" used as a key, but it is not a string."),a=String(a));var f=new m(function(c,f){var n;b.ready().then(function(){n=b._dbInfo;return g(n.db)}).then(function(a){return!a&&d instanceof Blob?e(d):
d}).then(function(d){var b=n.db.transaction(n.storeName,"readwrite"),e=b.objectStore(n.storeName);null===d&&(d=void 0);var g=e.put(d,a);b.oncomplete=function(){void 0===d&&(d=null);c(d)};b.onabort=b.onerror=function(){f(g.error?g.error:g.transaction.error)}})["catch"](f)});l(f,c);return f}function k(a,d){var b=this;"string"!==typeof a&&(window.console.warn(a+" used as a key, but it is not a string."),a=String(a));var c=new m(function(d,c){b.ready().then(function(){var e=b._dbInfo,g=e.db.transaction(e.storeName,
"readwrite"),f=g.objectStore(e.storeName)["delete"](a);g.oncomplete=function(){d()};g.onerror=function(){c(f.error)};g.onabort=function(){c(f.error?f.error:f.transaction.error)}})["catch"](c)});l(c,d);return c}function p(a){var d=this,c=new m(function(a,c){d.ready().then(function(){var b=d._dbInfo,e=b.db.transaction(b.storeName,"readwrite"),g=e.objectStore(b.storeName).clear();e.oncomplete=function(){a()};e.onabort=e.onerror=function(){c(g.error?g.error:g.transaction.error)}})["catch"](c)});l(c,a);
return c}function r(a){var d=this,c=new m(function(a,c){d.ready().then(function(){var b=d._dbInfo,e=b.db.transaction(b.storeName,"readonly").objectStore(b.storeName).count();e.onsuccess=function(){a(e.result)};e.onerror=function(){c(e.error)}})["catch"](c)});l(c,a);return c}function u(a,d){var c=this,b=new m(function(d,b){if(0>a)d(null);else c.ready().then(function(){var e=c._dbInfo,g=!1,f=e.db.transaction(e.storeName,"readonly").objectStore(e.storeName).openCursor();f.onsuccess=function(){var c=
f.result;c?0===a?d(c.key):g?d(c.key):(g=!0,c.advance(a)):d(null)};f.onerror=function(){b(f.error)}})["catch"](b)});l(b,d);return b}function d(a){var d=this,c=new m(function(a,c){d.ready().then(function(){var b=d._dbInfo,e=b.db.transaction(b.storeName,"readonly").objectStore(b.storeName).openCursor(),g=[];e.onsuccess=function(){var d=e.result;d?(g.push(d.key),d["continue"]()):a(g)};e.onerror=function(){c(e.error)}})["catch"](c)});l(c,a);return c}function l(a,d){d&&a.then(function(a){d(null,a)},function(a){d(a)})}
var m="undefined"!==typeof module&&module.exports&&"undefined"!==typeof require?require("promise"):this.Promise,A=A||this.indexedDB||this.webkitIndexedDB||this.mozIndexedDB||this.OIndexedDB||this.msIndexedDB;if(A){var t,z={_driver:"asyncStorage",_initStorage:a,iterate:q,getItem:f,setItem:c,removeItem:k,clear:p,length:r,key:u,keys:d};"undefined"!==typeof module&&module.exports&&"undefined"!==typeof require?module.exports=z:"function"===typeof define&&define.amd?define("asyncStorage",function(){return z}):
this.asyncStorage=z}}).call(window);
(function(){function h(a,c){c&&a.then(function(a){c(null,a)},function(a){c(a)})}var v="undefined"!==typeof module&&module.exports&&"undefined"!==typeof require?require("promise"):this.Promise,w=this,g=null,e=null;try{if(!(this.localStorage&&"setItem"in this.localStorage))return;e=this.localStorage}catch(b){return}var a=3;"undefined"!==typeof module&&module.exports&&"undefined"!==typeof require?a=2:"function"===typeof define&&define.amd&&(a=1);var f={_driver:"localStorageWrapper",_initStorage:function(b){var c=
{};if(b)for(var e in b)c[e]=b[e];c.keyPrefix=c.name+"/";this._dbInfo=c;return(new v(function(c){1===a?require(["localforageSerializer"],c):2===a?c(require("./../utils/serializer")):c(w.localforageSerializer)})).then(function(a){g=a;return v.resolve()})},iterate:function(a,c){var b=this,f=b.ready().then(function(){for(var c=b._dbInfo.keyPrefix.length,f=e.length,d=0;d<f;d++){var l=e.key(d),m=e.getItem(l);m&&(m=g.deserialize(m));m=a(m,l.substring(c),d+1);if(void 0!==m)return m}});h(f,c);return f},getItem:function(a,
c){var b=this;"string"!==typeof a&&(window.console.warn(a+" used as a key, but it is not a string."),a=String(a));var f=b.ready().then(function(){var c=e.getItem(b._dbInfo.keyPrefix+a);c&&(c=g.deserialize(c));return c});h(f,c);return f},setItem:function(a,c,b){var f=this;"string"!==typeof a&&(window.console.warn(a+" used as a key, but it is not a string."),a=String(a));var r=f.ready().then(function(){void 0===c&&(c=null);var b=c;return new v(function(d,l){g.serialize(c,function(c,g){if(g)l(g);else try{e.setItem(f._dbInfo.keyPrefix+
a,c),d(b)}catch(t){"QuotaExceededError"!==t.name&&"NS_ERROR_DOM_QUOTA_REACHED"!==t.name||l(t),l(t)}})})});h(r,b);return r},removeItem:function(a,c){var b=this;"string"!==typeof a&&(window.console.warn(a+" used as a key, but it is not a string."),a=String(a));var f=b.ready().then(function(){e.removeItem(b._dbInfo.keyPrefix+a)});h(f,c);return f},clear:function(a){var c=this,b=c.ready().then(function(){for(var a=c._dbInfo.keyPrefix,b=e.length-1;0<=b;b--){var f=e.key(b);0===f.indexOf(a)&&e.removeItem(f)}});
h(b,a);return b},length:function(a){var c=this.keys().then(function(a){return a.length});h(c,a);return c},key:function(a,c){var b=this,f=b.ready().then(function(){var c=b._dbInfo,f;try{f=e.key(a)}catch(d){f=null}f&&(f=f.substring(c.keyPrefix.length));return f});h(f,c);return f},keys:function(a){var b=this,f=b.ready().then(function(){for(var a=b._dbInfo,f=e.length,g=[],d=0;d<f;d++)0===e.key(d).indexOf(a.keyPrefix)&&g.push(e.key(d).substring(a.keyPrefix.length));return g});h(f,a);return f}};2===a?module.exports=
f:1===a?define("localStorageWrapper",function(){return f}):this.localStorageWrapper=f}).call(window);
(function(){function h(a){var b=this,c={db:null};if(a)for(var e in a)c[e]="string"!==typeof a[e]?a[e].toString():a[e];e=new k(function(a){l===d.DEFINE?require(["localforageSerializer"],a):l===d.EXPORT?a(require("./../utils/serializer")):a(p.localforageSerializer)});var f=new k(function(d,e){try{c.db=u(c.name,String(c.version),c.description,c.size)}catch(f){return b.setDriver(b.LOCALSTORAGE).then(function(){return b._initStorage(a)}).then(d)["catch"](e)}c.db.transaction(function(a){a.executeSql("CREATE TABLE IF NOT EXISTS "+c.storeName+
" (id INTEGER PRIMARY KEY, key unique, value)",[],function(){b._dbInfo=c;d()},function(a,b){e(b)})})});return e.then(function(a){r=a;return f})}function v(a,b){var d=this;"string"!==typeof a&&(window.console.warn(a+" used as a key, but it is not a string."),a=String(a));var e=new k(function(b,c){d.ready().then(function(){var e=d._dbInfo;e.db.transaction(function(d){d.executeSql("SELECT * FROM "+e.storeName+" WHERE key = ? LIMIT 1",[a],function(a,d){var c=d.rows.length?d.rows.item(0).value:null;c&&
(c=r.deserialize(c));b(c)},function(a,d){c(d)})})})["catch"](c)});c(e,b);return e}function w(a,d){var b=this,e=new k(function(d,c){b.ready().then(function(){var e=b._dbInfo;e.db.transaction(function(b){b.executeSql("SELECT * FROM "+e.storeName,[],function(b,c){for(var e=c.rows,f=e.length,g=0;g<f;g++){var l=e.item(g),t=l.value;t&&(t=r.deserialize(t));t=a(t,l.key,g+1);if(void 0!==t){d(t);return}}d()},function(a,d){c(d)})})})["catch"](c)});c(e,d);return e}function g(a,d,b){var e=this;"string"!==typeof a&&
(window.console.warn(a+" used as a key, but it is not a string."),a=String(a));var f=new k(function(b,c){e.ready().then(function(){void 0===d&&(d=null);var f=d;r.serialize(d,function(d,g){if(g)c(g);else{var l=e._dbInfo;l.db.transaction(function(e){e.executeSql("INSERT OR REPLACE INTO "+l.storeName+" (key, value) VALUES (?, ?)",[a,d],function(){b(f)},function(a,d){c(d)})},function(a){a.code===a.QUOTA_ERR&&c(a)})}})})["catch"](c)});c(f,b);return f}function e(a,d){var b=this;"string"!==typeof a&&(window.console.warn(a+
" used as a key, but it is not a string."),a=String(a));var e=new k(function(d,c){b.ready().then(function(){var e=b._dbInfo;e.db.transaction(function(b){b.executeSql("DELETE FROM "+e.storeName+" WHERE key = ?",[a],function(){d()},function(a,d){c(d)})})})["catch"](c)});c(e,d);return e}function b(a){var d=this,b=new k(function(a,b){d.ready().then(function(){var c=d._dbInfo;c.db.transaction(function(d){d.executeSql("DELETE FROM "+c.storeName,[],function(){a()},function(a,d){b(d)})})})["catch"](b)});
c(b,a);return b}function a(a){var d=this,b=new k(function(a,b){d.ready().then(function(){var c=d._dbInfo;c.db.transaction(function(d){d.executeSql("SELECT COUNT(key) as c FROM "+c.storeName,[],function(d,b){var c=b.rows.item(0).c;a(c)},function(a,d){b(d)})})})["catch"](b)});c(b,a);return b}function f(a,d){var b=this,e=new k(function(d,c){b.ready().then(function(){var e=b._dbInfo;e.db.transaction(function(b){b.executeSql("SELECT key FROM "+e.storeName+" WHERE id = ? LIMIT 1",[a+1],function(a,b){var c=
b.rows.length?b.rows.item(0).key:null;d(c)},function(a,d){c(d)})})})["catch"](c)});c(e,d);return e}function q(a){var d=this,b=new k(function(a,b){d.ready().then(function(){var c=d._dbInfo;c.db.transaction(function(d){d.executeSql("SELECT key FROM "+c.storeName,[],function(d,b){for(var c=[],e=0;e<b.rows.length;e++)c.push(b.rows.item(e).key);a(c)},function(a,d){b(d)})})})["catch"](b)});c(b,a);return b}function c(a,d){d&&a.then(function(a){d(null,a)},function(a){d(a)})}var k="undefined"!==typeof module&&
module.exports&&"undefined"!==typeof require?require("promise"):this.Promise,p=this,r=null,u=this.openDatabase;if(u){var d={DEFINE:1,EXPORT:2,WINDOW:3},l=d.WINDOW;"undefined"!==typeof module&&module.exports&&"undefined"!==typeof require?l=d.EXPORT:"function"===typeof define&&define.amd&&(l=d.DEFINE);var m={_driver:"webSQLStorage",_initStorage:h,iterate:w,getItem:v,setItem:g,removeItem:e,clear:b,length:a,key:f,keys:q};l===d.DEFINE?define("webSQLStorage",function(){return m}):l===d.EXPORT?module.exports=
m:this.webSQLStorage=m}}).call(window);
(function(){function h(a,b){a[b]=function(){var c=arguments;return a.ready().then(function(){return a[b].apply(a,c)})}}function v(){for(var a=1;a<arguments.length;a++){var b=arguments[a];if(b)for(var c in b)b.hasOwnProperty(c)&&(p(b[c])?arguments[0][c]=b[c].slice():arguments[0][c]=b[c])}return arguments[0]}function w(b){for(var c in a)if(a.hasOwnProperty(c)&&a[c]===b)return!0;return!1}function g(a){this._config=v({},q,a);this._driverSet=null;this._ready=!1;this._dbInfo=null;for(a=0;a<f.length;a++)h(this,
f[a]);this.setDriver(this._config.driver)}var e="undefined"!==typeof module&&module.exports&&"undefined"!==typeof require?require("promise"):this.Promise,b={},a={INDEXEDDB:"asyncStorage",LOCALSTORAGE:"localStorageWrapper",WEBSQL:"webSQLStorage"},f="clear getItem iterate key keys length removeItem setItem".split(" "),q={description:"",driver:[a.INDEXEDDB,a.WEBSQL,a.LOCALSTORAGE].slice(),name:"localforage",size:4980736,storeName:"keyvaluepairs",version:1},c=3;"undefined"!==typeof module&&module.exports&&
"undefined"!==typeof require?c=2:"function"===typeof define&&define.amd&&(c=1);var k=function(b){var c=c||b.indexedDB||b.webkitIndexedDB||b.mozIndexedDB||b.OIndexedDB||b.msIndexedDB,e={};e[a.WEBSQL]=!!b.openDatabase;e[a.INDEXEDDB]=!!function(){if("undefined"!==typeof b.openDatabase&&b.navigator&&b.navigator.userAgent&&/Safari/.test(b.navigator.userAgent)&&!/Chrome/.test(b.navigator.userAgent))return!1;try{return c&&"function"===typeof c.open&&"undefined"!==typeof b.IDBKeyRange}catch(a){return!1}}();
var f=a.LOCALSTORAGE,g;try{g=b.localStorage&&"setItem"in b.localStorage&&b.localStorage.setItem}catch(k){g=!1}e[f]=!!g;return e}(this),p=Array.isArray||function(a){return"[object Array]"===Object.prototype.toString.call(a)},r=this;g.prototype.INDEXEDDB=a.INDEXEDDB;g.prototype.LOCALSTORAGE=a.LOCALSTORAGE;g.prototype.WEBSQL=a.WEBSQL;g.prototype.config=function(a){if("object"===typeof a){if(this._ready)return Error("Can't call config() after localforage has been used.");for(var b in a)"storeName"===
b&&(a[b]=a[b].replace(/\W/g,"_")),this._config[b]=a[b];"driver"in a&&a.driver&&this.setDriver(this._config.driver);return!0}return"string"===typeof a?this._config[a]:this._config};g.prototype.defineDriver=function(a,c,g){var h=new e(function(c,g){try{var l=a._driver,m=Error("Custom driver not compliant; see https://mozilla.github.io/localForage/#definedriver"),n=Error("Custom driver name already in use: "+a._driver);if(a._driver)if(w(a._driver))g(n);else{for(var h=f.concat("_initStorage"),n=0;n<h.length;n++){var p=
h[n];if(!p||!a[p]||"function"!==typeof a[p]){g(m);return}}var q=e.resolve(!0);"_support"in a&&(q=a._support&&"function"===typeof a._support?a._support():e.resolve(!!a._support));q.then(function(e){k[l]=e;b[l]=a;c()},g)}else g(m)}catch(r){g(r)}});h.then(c,g);return h};g.prototype.driver=function(){return this._driver||null};g.prototype.ready=function(a){var b=this,c=new e(function(a,c){b._driverSet.then(function(){null===b._ready&&(b._ready=b._initStorage(b._config));b._ready.then(a,c)})["catch"](c)});
c.then(a,a);return c};g.prototype.setDriver=function(a,f,g){function k(){h._config.driver=h.driver()}var h=this;"string"===typeof a&&(a=[a]);this._driverSet=new e(function(f,g){var k=h._getFirstSupportedDriver(a),l=Error("No available storage method found.");k?(h._dbInfo=null,h._ready=null,w(k)?(new e(function(a){if(1===c)require([k],a);else if(2===c)switch(k){case h.INDEXEDDB:a(require("./drivers/indexeddb"));break;case h.LOCALSTORAGE:a(require("./drivers/localstorage"));break;case h.WEBSQL:a(require("./drivers/websql"))}else a(r[k])})).then(function(a){h._extend(a);
f()}):b[k]?(h._extend(b[k]),f()):(h._driverSet=e.reject(l),g(l))):(h._driverSet=e.reject(l),g(l))});this._driverSet.then(k,k);this._driverSet.then(f,g);return this._driverSet};g.prototype.supports=function(a){return!!k[a]};g.prototype._extend=function(a){v(this,a)};g.prototype._getFirstSupportedDriver=function(a){if(a&&p(a))for(var b=0;b<a.length;b++){var c=a[b];if(this.supports(c))return c}return null};g.prototype.createInstance=function(a){return new g(a)};var u=new g;1===c?define("localforage",
function(){return u}):2===c?module.exports=u:this.localforage=u}).call(window);
// End localforage code

/////////////////////////////////////
// Plugin class
cr.plugins_.LocalStorage = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var currentKey = "";
	var lastValue = "";
	var keyNamesList = [];
	var errorMessage = "";
	
	function getErrorString(err)
	{
		if (!err)
			return "unknown error";
		else if (typeof err === "string")
			return err;
		else if (typeof err.message === "string")
			return err.message;
		else if (typeof err.name === "string")
			return err.name;
		else if (typeof err.data === "string")
			return err.data;
		else
			return "unknown error";
	};
	
	// Scirra Arcade support
	var prefix = "";
	var is_arcade = (typeof window["is_scirra_arcade"] !== "undefined");
	
	if (is_arcade)
		prefix = "sa" + window["scirra_arcade_id"] + "_";
	
	function hasRequiredPrefix(key)
	{
		if (!prefix)
			return true;
		
		return key.substr(0, prefix.length) === prefix;
	};
	
	function removePrefix(key)
	{
		if (!prefix)
			return key;
		
		if (hasRequiredPrefix(key))
			return key.substr(prefix.length);
	};
	
	/////////////////////////////////////
	var pluginProto = cr.plugins_.LocalStorage.prototype;
		
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

	// called on startup for each object type
	typeProto.onCreate = function()
	{
	};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
	};
	
	var instanceProto = pluginProto.Instance.prototype;

	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
		this.pendingSets = 0;		// number of pending 'Set item' actions
		this.pendingGets = 0;		// number of pending 'Get item' actions
	};
	
	// called whenever an instance is destroyed
	// note the runtime may keep the object after this call for recycling; be sure
	// to release/recycle/reset any references to other objects in this function.
	instanceProto.onDestroy = function ()
	{
	};
	
	// called when saving the full state of the game
	instanceProto.saveToJSON = function ()
	{
		// return a Javascript object containing information about your object's state
		// note you MUST use double-quote syntax (e.g. "property": value) to prevent
		// Closure Compiler renaming and breaking the save format
		return {
			// e.g.
			//"myValue": this.myValue
		};
	};
	
	// called when loading the full state of the game
	instanceProto.loadFromJSON = function (o)
	{
		// load from the state previously saved by saveToJSON
		// 'o' provides the same object that you saved, e.g.
		// this.myValue = o["myValue"];
		// note you MUST use double-quote syntax (e.g. o["property"]) to prevent
		// Closure Compiler renaming and breaking the save format
	};
	
	// Prevent thrashing storage in the debugger view by setting a flag whenever storage is changed. Note this must be included
	// in exported code since the actions reference it.
	var debugDataChanged = true;
	
	/**BEGIN-PREVIEWONLY**/
	var debugValueCache = {};				// map of storage key to value
	var debugLoadingData = false;			// is async updating debugValueCache
	var debugLoadingCount = 0;				// keys pending load
	var debugFirstLoad = true;
	var debugHasAnyKeys = false;
	
	function sortPropertiesAZ(a, b)
	{
		var an = a["name"].toLowerCase();
		var bn = b["name"].toLowerCase();
		
		if (an < bn)
			return -1;
		else if (an > bn)
			return 1;
		else
			return 0;
	};
	
	instanceProto.getDebuggerValues = function (propsections)
	{
		var p, v;
		
		// Append to propsections any debugger sections you want to appear.
		// Each section is an object with two members: "title" and "properties".
		// "properties" is an array of individual debugger properties to display
		// with their name and value, and some other optional settings.
		if (debugFirstLoad)
		{
			debugFirstLoad = false;
			
			propsections.push({
				"title": "Local storage data",
				"properties": [{"name": "(loading...)", "value": "(loading...)"}]
			});
			
			this.debugCacheAllStorage();
		}
		else if (debugHasAnyKeys)
		{
			// Display all data in the cache so far. Note null values mean the value is still loading.
			var props = [];
			
			for (p in debugValueCache)
			{
				if (debugValueCache.hasOwnProperty(p))
				{
					v = debugValueCache[p];
					
					props.push({
						"name": p,
						"value": (v === null ? "(loading...)" : v.toString())
					});
				}
			}
			
			if (props.length)
			{
				// Ensure properties come in a predictable order
				props.sort(sortPropertiesAZ);
				
				propsections.push({
					"title": "Local storage data",
					"properties": props
				});
			}
			
			// If finished loading but data has changed, request data again to keep the cache up-to-date.
			if (!debugLoadingData && debugDataChanged)
			{
				this.debugCacheAllStorage();
			}
		}
		else
		{
			// Waiting for keys to be loaded: show that it is still loading
			propsections.push({
				"title": "Local storage data",
				"properties": [{"name": "(loading...)", "value": "(loading...)"}]
			});
		}
	};
	
	instanceProto.debugCacheAllStorage = function ()
	{
		// Unset the data changed flag immediately. This is so if any further changes happen
		// while debugCacheAllStorage is processing, we request all storage again immediately
		// afterwards, to ensure the view stays up to date.
		debugDataChanged = false;
		
		debugLoadingData = true;
		
		// Fetch complete key list
		localforage["keys"](function (err, keyList)
		{
			// Error: ignore results and return
			if (err)
			{
				debugLoadingData = false;
				return;
			}
			
			// For each key in the key list
			var i, len, k;
			var currentKeys = {};			// map of keys that currently exist
			debugLoadingCount = keyList.length;
			
			// If no keys to load (empty storage), unset the loading flag - no loads will
			// be started by the loop body
			if (debugLoadingCount === 0)
				debugLoadingData = false;
			
			for (i = 0, len = keyList.length; i < len; ++i)
			{
				k = keyList[i];
				
				// Store this key in the set of current keys so we know which still exist
				currentKeys[k] = true;
				
				// Initialise the cache value to null to indicate it is loading
				if (!debugValueCache.hasOwnProperty(k))
					debugValueCache[k] = null;
				
				// Fetch every key in the key list
				localforage["getItem"](k, (function (k_) {
					return function (err, value)
					{
						debugLoadingCount--;
						
						// If this is the last value waiting to be loaded, unset the loading flag
						if (debugLoadingCount === 0)
							debugLoadingData = false;
						
						if (err)
							return;
						
						// Store the key's value in the cache
						debugValueCache[k_] = value;
					};
				})(k));
			}
			
			// Make sure any keys that no longer exist are removed from the debugger value cache.
			// Iterate every key in the last cache, and if it is not a current key, delete it.
			for (k in debugValueCache)
			{
				if (debugValueCache.hasOwnProperty(k) && !currentKeys.hasOwnProperty(k))
					delete debugValueCache[k];
			}
			
			debugHasAnyKeys = true;
		});
	};
	
	instanceProto.onDebugValueEdited = function (header, name, enteredValue)
	{
		// Called when a non-readonly property has been edited in the debugger. Usually you only
		// will need 'name' (the property name) and 'value', but you can also use 'header' (the
		// header title for the section) to distinguish properties with the same name.
		
		// Note: the user can only enter strings, but we should preserve numbers vs. string types.
		// To ensure the type is preserved, first fetch the value to determine its type.
		localforage["getItem"](name, function (err, keyValue)
		{
			if (err)
				return;
			
			var valueToSet = enteredValue;
			
			if (typeof keyValue === "number")
				valueToSet = parseFloat(enteredValue);
			
			localforage["setItem"](name, valueToSet, function (err2, valueSet)
			{
				debugDataChanged = true;
			});
		});
	};
	/**END-PREVIEWONLY**/

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	Cnds.prototype.OnItemSet = function (key)
	{
		return currentKey === key;
	};
	
	Cnds.prototype.OnAnyItemSet = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnItemGet = function (key)
	{
		return currentKey === key;
	};
	
	Cnds.prototype.OnAnyItemGet = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnItemRemoved = function (key)
	{
		return currentKey === key;
	};
	
	Cnds.prototype.OnAnyItemRemoved = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnCleared = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnAllKeyNamesLoaded = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnError = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnItemExists = function (key)
	{
		return currentKey === key;
	};
	
	Cnds.prototype.OnItemMissing = function (key)
	{
		return currentKey === key;
	};
	
	Cnds.prototype.CompareKey = function (cmp, key)
	{
		return cr.do_cmp(currentKey, cmp, key);
	};
	
	Cnds.prototype.CompareValue = function (cmp, v)
	{
		return cr.do_cmp(lastValue, cmp, v);
	};
	
	Cnds.prototype.IsProcessingSets = function ()
	{
		return this.pendingSets > 0;
	};
	
	Cnds.prototype.IsProcessingGets = function ()
	{
		return this.pendingGets > 0;
	};
	
	Cnds.prototype.OnAllSetsComplete = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnAllGetsComplete = function ()
	{
		return true;
	};
	
	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};

	Acts.prototype.SetItem = function (keyNoPrefix, value)
	{
		var keyPrefix = prefix + keyNoPrefix;
		
		this.pendingSets++;
		
		var self = this;
		localforage["setItem"](keyPrefix, value, function (err, valueSet)
		{
			debugDataChanged = true;
			self.pendingSets--;
			
			if (err)
			{
				errorMessage = getErrorString(err);
				self.runtime.trigger(cr.plugins_.LocalStorage.prototype.cnds.OnError, self);
			}
			else
			{
				currentKey = keyNoPrefix;
				lastValue = valueSet;
				
				self.runtime.trigger(cr.plugins_.LocalStorage.prototype.cnds.OnAnyItemSet, self);
				self.runtime.trigger(cr.plugins_.LocalStorage.prototype.cnds.OnItemSet, self);
				
				currentKey = "";
				lastValue = "";
			}
			
			// Last outstanding set completed
			if (self.pendingSets === 0)
			{
				self.runtime.trigger(cr.plugins_.LocalStorage.prototype.cnds.OnAllSetsComplete, self);
			}
		});
	};
	
	Acts.prototype.GetItem = function (keyNoPrefix)
	{
		var keyPrefix = prefix + keyNoPrefix;
		
		this.pendingGets++;
		
		var self = this;
		localforage["getItem"](keyPrefix, function (err, value)
		{
			self.pendingGets--;
			
			if (err)
			{
				errorMessage = getErrorString(err);
				self.runtime.trigger(cr.plugins_.LocalStorage.prototype.cnds.OnError, self);
			}
			else
			{
				currentKey = keyNoPrefix;
				lastValue = value;
				
				// default undefined or null values to empty string (also converts to number as NaN)
				if (typeof lastValue === "undefined" || lastValue === null)
					lastValue = "";
				
				self.runtime.trigger(cr.plugins_.LocalStorage.prototype.cnds.OnAnyItemGet, self);
				self.runtime.trigger(cr.plugins_.LocalStorage.prototype.cnds.OnItemGet, self);
				
				currentKey = "";
				lastValue = "";
			}
			
			// Last outstanding get completed
			if (self.pendingGets === 0)
			{
				self.runtime.trigger(cr.plugins_.LocalStorage.prototype.cnds.OnAllGetsComplete, self);
			}
		});
	};
	
	Acts.prototype.CheckItemExists = function (keyNoPrefix)
	{
		var keyPrefix = prefix + keyNoPrefix;
		
		var self = this;
		localforage["getItem"](keyPrefix, function (err, value)
		{
			if (err)
			{
				errorMessage = getErrorString(err);
				self.runtime.trigger(cr.plugins_.LocalStorage.prototype.cnds.OnError, self);
			}
			else
			{
				currentKey = keyNoPrefix;
				
				if (value === null)		// null value indicates key missing
				{
					lastValue = "";		// prevent ItemValue meaning anything
					self.runtime.trigger(cr.plugins_.LocalStorage.prototype.cnds.OnItemMissing, self);
				}
				else
				{
					lastValue = value;	// make available to ItemValue expression
					self.runtime.trigger(cr.plugins_.LocalStorage.prototype.cnds.OnItemExists, self);
				}
				
				currentKey = "";
				lastValue = "";
			}
		});
	};
	
	Acts.prototype.RemoveItem = function (keyNoPrefix)
	{
		var keyPrefix = prefix + keyNoPrefix;
		
		var self = this;
		localforage["removeItem"](keyPrefix, function (err)
		{
			debugDataChanged = true;
			
			if (err)
			{
				errorMessage = getErrorString(err);
				self.runtime.trigger(cr.plugins_.LocalStorage.prototype.cnds.OnError, self);
			}
			else
			{
				currentKey = keyNoPrefix;
				lastValue = "";
				
				self.runtime.trigger(cr.plugins_.LocalStorage.prototype.cnds.OnAnyItemRemoved, self);
				self.runtime.trigger(cr.plugins_.LocalStorage.prototype.cnds.OnItemRemoved, self);
				
				currentKey = "";
			}
		});
	};
	
	Acts.prototype.ClearStorage = function ()
	{
		// Can't clear storage in the Scirra Arcade, would remove other game's keys
		if (is_arcade)
			return;
		
		var self = this;
		localforage["clear"](function (err)
		{
			debugDataChanged = true;
			
			if (err)
			{
				errorMessage = getErrorString(err);
				self.runtime.trigger(cr.plugins_.LocalStorage.prototype.cnds.OnError, self);
			}
			else
			{
				currentKey = "";
				lastValue = "";
				cr.clearArray(keyNamesList);
				self.runtime.trigger(cr.plugins_.LocalStorage.prototype.cnds.OnCleared, self);
			}
		});
	};
	
	Acts.prototype.GetAllKeyNames = function ()
	{
		var self = this;
		localforage["keys"](function (err, keyList)
		{
			var i, len, k;
			
			if (err)
			{
				errorMessage = getErrorString(err);
				self.runtime.trigger(cr.plugins_.LocalStorage.prototype.cnds.OnError, self);
			}
			else
			{
				cr.clearArray(keyNamesList);
				
				// Only use key names which pass the valid prefix test (for the Scirra Arcade)
				for (i = 0, len = keyList.length; i < len; ++i)
				{
					k = keyList[i];
					
					if (!hasRequiredPrefix(k))
						continue;
					
					keyNamesList.push(removePrefix(k));
				}
				
				self.runtime.trigger(cr.plugins_.LocalStorage.prototype.cnds.OnAllKeyNamesLoaded, self);
			}
		});
	};
	
	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	Exps.prototype.ItemValue = function (ret)
	{
		ret.set_any(lastValue);
	};
	
	Exps.prototype.Key = function (ret)
	{
		ret.set_string(currentKey);
	};
	
	Exps.prototype.KeyCount = function (ret)
	{
		ret.set_int(keyNamesList.length);
	};
	
	Exps.prototype.KeyAt = function (ret, i)
	{
		i = Math.floor(i);
		
		if (i < 0 || i >= keyNamesList.length)
		{
			ret.set_string("");
			return;
		}
		
		ret.set_string(keyNamesList[i]);
	};
	
	Exps.prototype.ErrorMessage = function (ret)
	{
		ret.set_string(errorMessage);
	};
	
	pluginProto.exps = new Exps();

}());