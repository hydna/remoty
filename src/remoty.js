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

    fullurl = url + "/?remoty-create-screen?name=" + name;

    this.id = null;
    this.name = null;
    this.url = url;
    this.devices = [];
    this.channel = new HydnaChannel(fullurl, "r");


    this.channel.onopen = function (event) {
      self.id = this.id;
      self.name = null;
      if (typeof self.onready == "function") {
        self.onready();
      }
    };

    this.channel.onsignal = function (event) {
      var m;
      var args;
      var device;
      var arg1;
      var arg2;

      m = /^([a-zA-Z\-])\:(\.)|([a-zA-Z\-])$)/.exec(event.message);
      args = (m && m[3]) && m[3].split(",");

      switch (m && m[1]) {
        case "device-available":
          
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


  function Device (id) {
    this.id = id;
    this.accepted = false;
    this.channel = null;
  }


  Device.prototype.accept = function () {
    if (this.accepted) return;
    this.accepted = true;
    this.channel = new HydnaChannel();
  };

})();