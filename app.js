server = require("./server")
Home = require("./src/memoryHome")
Producto = require("./src/producto")


var myHome = new Home()
myHome.insert(new Producto("Papas Fritas", 30))
myHome.insert(new Producto("Yerba La Cumbrecita", 36))
myHome.insert(new Producto("Termo Lumilagro", 1250))

server.init(myHome)