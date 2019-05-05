server = require("./server")
Home = require("./src/memoryHome")
Producto = require("./src/producto")


var myHome = new Home()
var miProducto = new Producto("Papas Fritas", 30)
myHome.insert(miProducto)

server.init(myHome, miProducto.id)