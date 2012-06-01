(function () {
  var exports = window.remoty = {};

  exports.listen                  = listen;
  exports.connect                 = connect;
  exports.getScreens              = getScreens;
  exports.getDevices              = getDevices;

  var Channel                     = null;


  Channel = typeof HydnaChannel !== "undefined" ? HydnaChannel
                                                : WinkChannel;

  if (!Channel) {
    throw new Error("Unable to load Remoty library, no Channel was defined");
  }


  /**
   *  listen (url, {options}, [callback]) 
   */
  function listen (url, options, callback) {
    var instance;
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

    instance = new Screen(url, options);

    if (callback) {
      instance.onready = function () {
        this.onready = null;
        callback.apply(this);
      }
    }

    return instance;
  }


  function connect (url, nameOrId, options, callback) {
    var instance;

    if (typeof url != "string") {
      throw new Error("Expected string for 'url'");
    }

    if (typeof nameOrId != "string" && typeof nameOrId != "number") {
      throw new Error("Expected string or number for 'nameOrId'");
    }

    if (typeof options == "function") {
      callback = options;
      options = null;
    }

    options = options || {};

    instance = new RemoteInstance();
  }


  function Screen (url, name) {
    var self = this;
    var fullurl;

    fullurl = url + "/?remoty-init-screen";

    if (typeof name == "string") {
      fullurl += "?name=" + name;
    }

    this.id = null;
    this.name = null;
    this.url = url;
    this.devices = {};
    this.channel = new HydnaChannel(fullurl, "r");


    this.channel.onopen = function (event) {
      self.id = this.id;
      self.name = name;
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
    var self = this;
    var dest;

    this.screen = screen;
    this.id = id;
    this.chid = params.channel;
    this.accepted = false;

  }

  function receiveJSON (C, haltOnError) {
    return function (event) {
      try {
        event.graph = JSON.parse(event.data);
      } catch (err) {
        return haltOnError ? C(err) : null;
      }
    };
  }

  function receiveEvents (C) {
    return function (event) {
      if (event.graph && event) {

      }
      return C(event);
    };
  }


  function receiveHandshake (C) {
    return receiveTimeout(
            receiveJSON(function (event) {
              event.graph;
    }, true));
  }

  function receiveTimeout (C, time) {
    var timeout;

    function ontimeout () {
      return C(new Error("ERR_REMOTY_RECEIVE_TIMEOUT"));
    }

    timeout = setTimeout(ontimeout, time || 2000);

    return function (event) {
      clearTimeout(timeout);
      return C(event);
    };
  }


  Device.prototype.onerror = null;
  Device.prototype.onclose = null;


  Device.prototype.accept = function (context) {
    if (this.channel) return;

    this.accepted = true;


    function eventHandler (event) {

    }


    dest = screen.url + "/" + params.channel;
    this.channel = new HydnaChannel(dest, "r");

    this.channel.onmessage = receiveEvents(eventHandler);

    this.channel.onopen = function () {

    };

    this.channel.onclose = function () {
      if (typeof self.onclose == "function") {
        self.onclose(event);
      }
    };

  };

  Device.prototype.reject = function () {
    // TODO: Disconnect channel by sending a singal
    
  };


  Device.prototype._destroy = function (err) {

    if (this.channel) {
      this.channel.close();
      this.channel = null;
    }

    if (err && typeof this.onerror == "function") {
      this.onerror(err);
    }

    if (typeof this.onclose == "function") {
      this.onclose();
    }
  };


  function Connection (baseurl, screenNameOrId, options) {
    var self = this;
    var params = {};
    var channel;
    var url;

    fullurl = url + "/?remoty-init-remote";

    options = options || {};

    params["type"] = options.type || "generic";

    url = buildURL(baseurl, "remoty-init-remote", params);

    channel = connectChannel(url, "we", function (err) {
      if (err) return self._destroy(err);
      bindDestroyHandlers(self, channel);
      // Connect to screen
    });

    this.channel = channel;
  }

  Connection.prototype.onopen = function () {};
  Connection.prototype.onerror = function (err) {};
  Connection.prototype.onclose = function () {};


  Connection.prototype.emit = function () {
    
  };


  Connection.prototype._destroy = function (err) {

    if (err && typeof this.onerror == "function") {
      this.onerror(err);
    }

    if (this.local) {
      this.local.close();
      this.local = null;
    }
    this.channel
  };


  function bindDestroyHandlers (target, chan) {
    chan.onerror = function (event) {
      delete chan.onerror;
      delete chan.onclose;
      target._destroy(new Error(event.message));
    };
    chan.onclose = function () {
      delete chan.onerror;
      delete chan.onclose;
      target._destroy();
    };
  }


  function connectChannel (url, mode, C) {
    var chan = new Channel(url, "we");

    function cleanup () {
      delete chan.onopen;
      delete chan.onerror;
      delete chan.onclose;
    }

    chan.onopen = function () {
      cleanup();
      return C();
    };

    chan.onerror = function (event) {
      cleanup();
      return C(new Error(event.message || "unknown error");
    };

    chan.onclose = function () {
      cleanup();
      return C(new Error("Disconnected"));
    };

    return chan;
  }


  function buildURL (base, name, params) {
    var result;

    function paramstostr () {
      var r = [];
      for (var k in params) {
        r.push(k + "=" + encodeURIComponent(params[k]));
      }
      return r.join("&");
    }

    return [base, "/?", name, "?", paramstostr()].join("");
  }


  function getParams (t) {
    var r = {};
    t.replace(/([^?=&]+)(=([^&]*))?/g, function(a, b, c, d) { r[b] = d; });
    return r;
  }

})();