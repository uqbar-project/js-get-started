server = require("./server")
Producto = require ("./src/producto")
Cliente = require ("./src/cliente")
Home = require("./src/memoryHome")

productoHome = new Home("productos")

productoHome.insert(new Producto("alfajor", 20))
productoHome.insert(new Producto("chocolate", 30))

clienteHome = new Home("clientes")

clienteHome.insert(new Cliente("pepito", "calle falsa 123"))
clienteHome.insert(new Cliente("fulanito", "calle san martín s/n"))

server.register(productoHome)
server.register(clienteHome)
server.init();
