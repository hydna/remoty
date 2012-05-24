(function () {
  var exports = window.remoty = {};

  exports.listen                  = listen;
  exports.connect                 = connect;
  exports.getScreens              = getScreens;
  exports.getDevices              = getDevices;

  exports.ondeviceavailable       = null;
  exports.ondeviceunavailable     = null;
  exports.onscreenavailable       = null;
  exports.onscreenunavailable     = null;

  var availableScreens            = [];
  var availableDevices            = [];


  /**
   *  listen (url, {options}, [callback]) 
   */
  function listen (url, options, callback) {
    var screen;
    var name;
    var token;

    if (typeof url !== "string") {
      throw new Error("Expected `url`");
    }
    if (typeof options == "function") {
      callback = options;
      options = null;
    }

    options = options || {};

    screen = new Screen(url, options);

    if (callback) {
      screen.onready = function () {
        this.onready = null;
        callback.apply(this);
      }
    }

    return screen;
  }


  function connect (url, nameOrId, callback) {

  }


  function Screen (url, name) {
    var self = this;
    var fullurl;

    fullurl = url + "/?remoty-init-screen?name=" + name;

    this.id = null;
    this.name = null;
    this.url = url;
    this.devices = {};
    this.channel = new HydnaChannel(fullurl, "r");


    this.channel.onopen = function (event) {
      self.id = this.id;
      self.name = null;
      if (typeof self.onready == "function") {
        self.onready();
      }
    };

    this.channel.onsignal = function (event) {
      var device;
      var params;
      var event;
      var m;

      m = /^(.+)\?|^(.+)$/.exec(event.message);

      switch (m && (m[1] || m[2]) {
        case "remoty-connect":
          params = getParams(event.message);
          device = new Device();
          event = { name: "connect", params: params };
          if ()
          break;
        case "remoty-disconnect":
          params = getParams(event.message);
          break;
      }
    };

    this.channel.onerror = function (event) {
      if (typeof self.onerror == "function") {
        self.onerror(event);
      }
    };

    this.channel.onclose = function (event) {
      self.devices = [];
      if (typeof self.onclose == "function") {
        self.onclose(event);
      }
    };
  }

  Screen.prototype.onready = null;
  Screen.prototype.onerror = null;
  Screen.prototype.onclose = null;
  Screen.prototype.onconnect = null;
  Screen.prototype.ondisconnect = null;

  Screen.prototype.setInfo = function (info) {
    var devices = this.devices;
    var message;

    if (typeof info == "undefined" || info == null) {
      return;
    }

    this._info = info;

    message = JSON.stringify({
      cmd: "screen-info",
      id: this.id,
      params: info
    });

    this.channel.send(message);
  };

  Screen.prototype.listen = function () {

  };


  function Device (screen, id, params) {
    var dest;

    this.screen = screen;
    this.id = id;
    this.chid = params.channel;
    this.accepted = false;

    function handshakeCallback () {
      
    }

    dest = screen.url + "/" + params.channel;
    this.channel = new HydnaChannel(dest, "r");

    this.channel.onmessage = handshakeHandler;

    this.channel.onclose = function () {
      if (typeof self.onclose == "function") {
        self.onclose(event);
      }
    };
  }

  function handshakeHandler (C) {
    return function (event) {
      var graph;

      try {
        graph = JSON.parse(event.data);
      } catch (err) {
        this,
      }
    };
  }

  Device.prototype.onerror = null;
  Device.prototype.onclose = null;


  Device.prototype.accept = function (context) {
    if (this.accepted) return;

    this.accepted = true;

    message = JSON.stringify({
      cmd: "handshake-accept",
      id: this.id,
      params: info
    });

    try {
      this.channel.send(message);
    } catch (err) {
      return this.destroy(err);
    }

  };

  Device.prototype.reject = function () {
    // TODO: Disconnect channel by sending a singal
    
  };


  function buildURL (base, name, params) {
    var result;

    function paramstostr () {
      var r = [];
      for (var k in params) {
        r.push(k + "=" + encodeURIComponent(params[k]));
      }
      return r.join("&");
    }

    return [
      base,
      "/?",
      name,
      "?",
      paramstostr()
    ].join("");
  }


  function getParams (t) {
    var r = {};
    t.replace(/([^?=&]+)(=([^&]*))?/g, function(a, b, c, d) { r[b] = d; });
    return r;
  }

})();