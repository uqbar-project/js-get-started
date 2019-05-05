server = require("./server")
Producto = require ("./src/producto")

var myObject = new Producto("alfajor", 20);

server.init(myObject);
