server = require("./server")
Producto = require ("./src/producto")
Home = require("./src/memoryHome")


productoHome = new Home()

productoHome.insert(new Producto("alfajor", 20))
productoHome.insert(new Producto("chocolate", 30))

server.init(productoHome);