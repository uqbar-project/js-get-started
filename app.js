server = require("./server")

mongoConnection = require("./src/mongo/mongoConnection")
Home = require("./src/mongo/mongoHome")
mongoConnection.connect( (db) => {
    productoHome = new Home("productos", db)
    clienteHome = new Home("clientes", db)    
    server.register(productoHome)
    server.register(clienteHome)
    server.init();
})

