/**
*  Jojojs v1.0.0 
**/
;(function(global,undefined){
var _jojojs=global.jojojs;
if (_jojojs && _jojojs.version) {
  return
}

var jojojs = global.jojojs = {
  // The current version of SeaJS being used
  version: "1.0.0"
};

// The safe wrapper for `console.xxx` functions
// log("message") ==> console.log("message")
// log("message", "warn") ==> console.warn("message")
var log = jojojs.log = function(msg, type) {

  global.console &&
      // Do NOT print `log(msg)` in non-debug mode
      (type || configData.debug) &&
      // Set the default value of type
      (console[type || (type = "log")]) &&
      // Call native method of console
      console[type](msg)
};

var ids=jojojs.ids={};



})(this);