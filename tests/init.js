if (typeof print === "undefined") {
  var print = console.log;
}

var n = 100000
var obj = {}
for (var i = 0; i < n; i++) {
  obj['key' + i] = 'value' + i
}
