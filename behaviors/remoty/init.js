var TOKEN           = script.env.TOKEN;
var OFFSET          = script.env.OFFSET;
var MAX_SCREENS     = script.env.MAX_SCREENS;
var MAX_DEVICES     = script.env.MAX_DEVICES;
var SCREEN_OFFSET   = OFFSET;
var DEVICE_OFFSET   = OFFSET + MAX_SCREENS;

var chan;
var type;
var params;
var id;
var m;

m = /^remoty-init-(screen|device)/.exec(TOKEN);

if (!m) {
  exit(0, "ERR_REMOTY_BAD_INIT");
} 

if (connection.get("remoty-type") != null) {
  exit(0, "ERR_REMOTY_CONNECTION_ALREADY_INITIALIZED");
}


type = m[1];
params = (function (t) {
  var r = {};
  t.replace(/([^?=&]+)(=([^&]*))?/g, function(a, b, c, d) { r[b] = d; });
  return r;
})(TOKEN);

switch (type) {

  case "screen":
    for (var i = SCREEN_OFFSET; i < SCREEN_OFFSET + MAX_SCREENS; i++) {
      chan = domain.getChannel(i);
      if (chan.get("remoty-class") == null) {
        chan.set("remoty-class", "screen");
        chan.set("remoty-name", params.name || "noname");
        chan.set("remoty-type", params.type || "na");
        if ("secret" in params) {
          chan.set("remoty-secret", params.secret);
        }
        connection.set("remoty-class", "screen");
        connection.set("remoty-channel", id);
        connection.set("remoty-name", params.name || "noname");
        connection.set("remoty-type", params.type || "na");
        exit(id);
      }
    }
    exit(0, "ERR_REMOTY_TOO_MANY_SCREENS");
    break;

  case "device":
    for (var i = DEVICE_OFFSET; i < DEVICE_OFFSET + MAX_DEVICES; i++) {
      chan = domain.getChannel(i);
      if (chan.get("remoty-class") == null) {
        chan.set("remoty-class", "device");
        chan.set("remoty-type", params.type || "na");
        connection.set("remoty-class", "screen");
        connection.set("remoty-channel", id);
        connection.set("remoty-name", params.name || "noname");
        connection.set("remoty-type", params.type || "na");
        exit(id);
      }
    }
    exit(0, "ERR_REMOTY_TOO_MANY_REMOTES");
    break;
}