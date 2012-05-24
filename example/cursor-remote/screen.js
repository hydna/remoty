function main () {
  var mainscreen = null;
  var noDevices = 0;
  var maxDevices = 4;

  function onnotif (event) {
    var graph;

    try {
      graph = JSON.parse(event.data);
    } catch (err) {
      return;
    }

    
  }

  function ondeviceavailable (event) {
    var device = event.device;

    if (++noDevices == maxDevices) {
      noDevices--;
      device.reject("Too many remote controls already connected");
    } else {
      device.onnotif = onnotif;
      device.accept();
    }
  }

  function onopenerror (event) {
    
  }

  function onerror (event) {
    
  }

  function onready () {
    mainscreen.ondeviceavailable = ondeviceavailable;
    mainscreen.onerror = onerror;
  }

  mainscreen = remoty.listen("demo.hydna.net", "screen1", onready);
  mainscreen.onerror = onopenerror;
}

if ("addEventListener" in window) {
  window.addEventListener("load", main, true);
} else if ("attachEvent" in window) {
  window.attachEvent("onload", main);
}