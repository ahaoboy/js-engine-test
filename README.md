
## test
9/6/2025, 2:34:18 AM

### ubuntu
| Engine | bun | node | deno | graaljs | hermes | llrt | txiki.js | quickjs | quickjs-ng | mujs | mujs-pgo | mujs-one | xst | JavaScriptCore | v8 | spidermonkey | JerryScript | primjs | rquickjs | rquickjs-pgo | ChakraCore | duktape | nova | boa | engine262 | ladybird | goja | kiesel | mozjs | jint | dune | jjs | rhino | njs | ringo | lo | spiderfire | bare | hako | quickjs-emscripten |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| reassign | 12 | 22 | 20 | 111 | 13 | 19 | 17 | 17 | 18 | 29 | 21 | 32 | 14161 | 12 | 18 | 6 |  | 20 | 19 | 18 | 41 | 24 | 3838 | 152
undefined | 19890 | [35;1m85[0m | 2025/09/06 02:33:02 53 | 222 | 5 | 201 | [33m21[0m | 209 | 66 | 16 | 107 | 19 | 4 | 21 | Segmentation fault (core dumped) | 35 |
| values | 2 | 38 | 35 | 16 | 7 | 8 | 7 | 6 | 6 | TypeError: undefined is not callable
	at /home/runner/work/js-engine-test/js-engine-test/tmp/values.js:13 | TypeError: undefined is not callable
	at /home/runner/work/js-engine-test/js-engine-test/tmp/values.js:13 | TypeError: undefined is not callable | 13723 | 2 | 30 | 1 |  | 7 | 8 | 8 | 47 | TypeError: undefined not callable (property 'values' of [object Function])
    at [anon] (duk_js_call.c:2800) internal
    at global (/home/runner/work/js-engine-test/js-engine-test/tmp/values.js:12) preventsyield
error in executing file /home/runner/work/js-engine-test/js-engine-test/tmp/values.js | 2913 | 30
undefined | 3583 | [35;1m68[0m | 2025/09/06 02:33:02 36 | 23 | 2 | 48 | [33m40[0m | Warning: The jjs tool is planned to be removed from a future JDK release
/home/runner/work/js-engine-test/js-engine-test/tmp/values.js:13 TypeError: Object.values is not a function | 34 | 5 | 49 | 37 | 2 | 38 | Segmentation fault (core dumped) | 15 |
### macos-arm64
| Engine | bun | node | deno | graaljs | hermes | llrt | txiki.js | quickjs | quickjs-ng | mujs | xst | JavaScriptCore | v8 | spidermonkey | JerryScript | primjs | rquickjs | duktape | nova | engine262 | ladybird | goja | kiesel | mozjs | jint | dune | jjs | rhino | njs | ringo | spiderfire | bare | hako | quickjs-emscripten |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| reassign | 10 | 18 | 18 | 121 | 11 | 15 | 22 | 13 | 12 | 31 | 17789 | 11 | 20 | 16 |  | 21 | 18 | 13 | 4256 | 16982 | [35;1m72[0m | 2025/09/06 02:33:33 63 | 215 | 9 | 258 | [33m23[0m | 322 | 62 | 17 | 144 | 9 | 20 | 460 | 66 |
| values | 1 | 42 | 43 | 19 | 7 | 11 | 5 | 4 | 4 | TypeError: undefined is not callable
	at /Users/runner/work/js-engine-test/js-engine-test/tmp/values.js:13 | 17212 | 1 | 32 | 2 |  | 6 | 5 | Warning: setrlimit failed
TypeError: undefined not callable (property 'values' of [object Function])
    at [anon] (duk_js_call.c:2805) internal
    at global (/Users/runner/work/js-engine-test/js-engine-test/tmp/values.js:12) preventsyield
error in executing file /Users/runner/work/js-engine-test/js-engine-test/tmp/values.js | 3384 | 3668 | [35;1m75[0m | 2025/09/06 02:33:34 41 | 50 | 2 | 67 | [33m49[0m | Warning: The jjs tool is planned to be removed from a future JDK release
/Users/runner/work/js-engine-test/js-engine-test/tmp/values.js:13 TypeError: Object.values is not a function | 42 | 4 | 43 | 7 | 42 | 158 | 15 |
### windows
| Engine | bun | node | deno | graaljs | hermes | llrt | txiki.js | quickjs | quickjs-ng | mujs | mujs-pgo | xst | JavaScriptCore | v8 | spidermonkey | rquickjs | rquickjs-pgo | ChakraCore | duktape | nova | boa | engine262 | goja | kiesel | jint | dune | jjs | rhino | spiderfire | bare | quickjs-emscripten |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| reassign | 16 | 22 | 19 | 132 | 24 | 37 | 24 | 26 | 20 | 30 | 36 | Error: memory full | 12 | 17 | 5 | 31 | 32 | 31 | 62 | 4123 | 205
undefined | 21383 | 2025/09/06 02:33:30 45 | 198 | 240 | [33m19[0m | 172 |  | 6 | 28 | 34 |
| values | 1 | 37 | 46 | 11 | 13 | 17 | 10 | 9 | 16 | TypeError: undefined is not callable
	at D:\a\js-engine-test\js-engine-test\tmp\values.js:13 | TypeError: undefined is not callable
	at D:\a\js-engine-test\js-engine-test\tmp\values.js:13 | Error: memory full | 1 | 29 | 2 | 15 | 16 | 39 | TypeError: undefined not callable (property 'values' of [object Function])
    at [anon] (duk_js_call.c:2925) internal
    at global (D:\a\js-engine-test\js-engine-test\tmp\values.js:12) preventsyield
error in executing file D:\a\js-engine-test\js-engine-test\tmp\values.js | 2323 | 24
undefined | 3874 | 2025/09/06 02:33:30 39 | 22 | 59 | [33m34[0m | D:\a\js-engine-test\js-engine-test\tmp\values.js:13 TypeError: Object.values is not a function |  | 2 | 32 | 15 |
