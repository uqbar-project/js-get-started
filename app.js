server = require("./server")
Producto = require ("./producto")
Home = require("./memoryHome")

var myObject = new Producto("alfajor", 20);
var home = new Home();

console.log("what is? " + JSON.stringify(home))
home.insert(myObject)

server.init(myObject);