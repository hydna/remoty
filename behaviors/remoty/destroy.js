connection.del("remoty-class");
connection.del("remoty-channel");
connection.del("remoty-name");
connection.del("remoty-type");

channel.del("remoty-class");
channel.del("remoty-name");
channel.del("remoty-type");
channel.del("remoty-secret");

channel.emit(
  "remoty-disconnect?" +
  "connection=" + connection.id
);
