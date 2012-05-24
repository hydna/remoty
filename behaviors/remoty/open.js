var connectionClass = connection.get("remoty-class");
var channelClass = channel.get("remoty-class");
var name = channel.get("remoty-name");
var type = channel.get("remoty-type");
var secret = channel.get("remoty-secret");

if (!connectionClass) {
  exit(0, "ERR_REMOTY_CONNECTION_NOT_INITAILIZED");
}

if (!channelClass) {
  exit(0, "ERR_REMOTY_NOT_AVAILABLE");
}

if (connectionClass == channelClass) {
  exit(0, "ERR_REMOTY_BAD_ENDPOINT");
}

if (secret && secret !== script.env.TOKEN) {
  exit(0, "ERR_REMOTY_BAD_SECRET");
}

channel.emit(
  "remoty-connect?" +
  "connection=" + connection.id +
  "&channel=" + channel.id +
  "&name=" + name +
  "&type=" + type
);

exit(1);