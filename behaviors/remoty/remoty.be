
if (typeof API_CHANNEL == "undefined") API_CHANNEL = 1;
if (typeof OFFSET == "undefined") OFFSET = 5000;
if (typeof MAX_SCREENS == "undefined") MAX_SCREENS = 10;
if (typeof MAX_REMOTES == "undefined") MAX_REMOTES = 20;

SCRIPT_ENV = {
  OFFSET        : OFFSET,
  MAX_SCREENS   : MAX_SCREENS,
  MAX_REMOTES   : MAX_REMOTES
}

function EACH_CHANNEL (fn) {
  var range = OFFSET + MAX_SCREENS + MAX_REMOTES;
  for (var i = OFFSET; i < range; i++) {
    fn(i);
  }
}

function CHANNEL_OPEN (no) {
  channel = no
    mode = "read"
      run("./open.js", SCRIPT_ENV)
      when = $CODE
        allow()
      end
      deny($MESSAGE)
    end
    deny("ERR_REMOTY_BAD_MODE")
  end  
}


function CHANNEL_CLOSE (no) {
  channel = no
    run("./destroy.js", SCRIPT_ENV)
  end  
}

/*
 *  This is the setup routines. An application MUST either initialize
 *  a screen or device before any other actions could be taken.
 */
open
  channel = API_CHANNEL
    token = match("^remoty-init-(screen|device)")
      mode = "writeemit"
        run("./init.js", SCRIPT_ENV)
        when = $CODE
          redirect($CODE, $MESSAGE)
        end
        deny($MESSAGE)
      end
      deny("ERR_REMOTY_BAD_MODE")
    end
  end

  EACH_CHANNEL(CHANNEL_OPEN)

end


emit
  
end


close
  EACH_CHANNEL(CHANNEL_CLOSE)
end