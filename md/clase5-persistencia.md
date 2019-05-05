
## Clase 5 : Persistencia

### Usando MongoDB
MongoDB es una alterniva a las tradicionales bases de datos sql. Tiene como ventajas que trabaja directamente con Json, evitando todo el gap Objeto/Relacional
que da origen a la necesidad de un ORM. Como desventaja que se puede considerar que ciertos features como Transaccionalidad o Cache de identidad no vienen incluidos.

La instalación del servidor depende de la versión del sistema operativo: [install](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/) 

Para iniciar el servicio
```
sudo service mongod start
```

Y se puede usar por línea de comandos usando `mongo` client. Sin embargo esta parte no será necesaria ya que el cliente será nuestra app, pero puede ser útil si queremos revisar los efectos del uso de nuestra app.

Agregamos la dependencia a nuestro proyecto

```
npm install mongodb --save
```

Algunas cuestiones a tener en cuenta al usar mongo:

1. Mongo tiene una interfaz asincrónica basada en callbacks. Esto se debe a que una interfaz de este tipo puede ser aprovechada mejor en sistemas de Big Data y/o sistemas basado en colas en lugar del modelo request/response que estamos manejando en una arquitectura rest. En este punto tenemos dos opciones: Modificar nuestra arquitectura para que la home utilice una interfaz basada en callbacks o utilizar alguna técnica de programación concurrente para adapatar la llamada asincrónica de mongo a una interfaz sincrónica. Como lo segundo es un poco más complejo, primero resolveremos el problema con la primera alternativa.

2. Mongo agrega un campo "_id" a los objetos, ese valor no es exactamente un string uuid, si no que utiliza una implementación interna por fines de performance (ObejctID). Cuando un objeto es obtenido de mongo y renderizado en un json el campo _id toma el tipo string, sin embargo cuando querramos pasar dicho valor a mongo para buscar por _id o cualquier otra operación que lo requiera vamos a tener que invocar explícitamente la conversión de string a ObjectID.

3. Vamos a mantener en un único objeto la conexión a mongo, las homes colaborarán con este objeto para obtener una referencia a la colección persistente que se utilizará para realizar las operaciones

#### app.js
``` javascript
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
```
Aquí se ve con un callback como la registración de las homes y el inicio del server ocurre luego de que se produzca la conexión con mongo.


#### mongo/mongoConnection.js
``` javascript
var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://localhost:27017'
var dbname = 'mydb'
var db


function connect(callback) {
    console.log("Tratando de conectar")
    MongoClient.connect(url, { useNewUrlParser: true } , function(err, _db) {
        if (err) throw err
        console.log("Mongo DB Connected")
        db=_db.db(dbname)
        callback(db)        
    })
}

function close() {
    db.close()
}

exports.connect = connect;
exports.close = close;
exports.dbname = dbname
exports.url = url
```
Esta interfaz permite configurar una url y/o dbname distinta antes de usar el método connect. Si no utiliza los defaults configurados al inicio del archivo.

#### mongo/mongoHome.js
``` javascript
var mongoDriver = require('mongodb');

class MongoDBHome {

    constructor(type, db) {
        this.type = type
        this.persistentCollection = db.collection(type)
    }

    insert(element) {
        this.persistentCollection.insertOne(element, (error, result)=>{
            if(error) throw error
            console.log(`Result of insert one: ${JSON.stringify(result)}`)
        })
    }

    delete(elementId) {
        var objectId = mongoDriver.ObjectID(elementId);
        this.persistentCollection.deleteOne({"_id" : objectId}, (error, result)=>{
            if(error) throw error
            console.log(`Result of delete one: ${JSON.stringify(result)}`)
        })    
    }

    get(elementId, callback) {
        var objectId = mongoDriver.ObjectID(elementId);
        return this.persistentCollection.findOne({"_id" : objectId}, (error, result)=>{
            if(error) throw error
            callback(result)
        })
    }

    update(element) {
        var objectId = mongoDriver.ObjectID(element._id);
        element._id = objectId;
        this.persistentCollection.replaceOne({"_id" : objectId}, element, (error, result)=>{
            if(error) throw error
            console.log(`Result of updateOne one: ${JSON.stringify(result)}`)
        })
    }

    all(callback) {
        this.persistentCollection.find({}).toArray( (error, result)=>{
            if(error) throw error
            callback(result)
        })
    }

}

module.exports = MongoDBHome
```

#### server.js
``` javascript
express = require("express");
bodyParser = require("body-parser");
var events = require("events");

var eventEmitter = new events.EventEmitter();


function register(home) {
  console.log(`registering handlers for ${home.type}`)
  
  eventEmitter.on(`find-${home.type}`, 
              (response)=>
                home.all( 
                  ( result) => {
                    response.json(result)
                    response.end()
                  }
              )    
  )

  eventEmitter.on(`get-${home.type}`, 
              (id, response)=> {
              console.log("respondiendo evento, llamando a la home")
                home.get(id, 
                  ( result ) => {
                    response.json(result)
                    response.end()
                  }
              )}
  )    

   
  eventEmitter.on(`update-${home.type}`, (object)=> home.update(object))
  eventEmitter.on(`insert-${home.type}`, (object)=> home.insert(object))
  eventEmitter.on(`delete-${home.type}`, (id)=> home.delete(id))
}

function init() {
  var server = express();
  server.use(bodyParser.json());

  server.get("/:type", (req, res) => {
    eventEmitter.emit(`find-${req.params.type}`, res);

  })

  server.get("/:type/:id", (req, res) => {
    eventEmitter.emit(`get-${req.params.type}`, req.params.id, res);
   })

  server.put("/:type", (req, res) => {
    eventEmitter.emit(`update-${req.params.type}`, req.body);
    res.status(204).end();  
  })

  server.post("/:type", (req, res) => {
    eventEmitter.emit(`insert-${req.params.type}`, req.body);
    res.status(204).end();  
  })

  server.delete("/:type/:id", (req, res) => {
    eventEmitter.emit(`delete-${req.params.type}`, req.params.id);
    res.status(204).end();  
  });

  server.listen(8888, () => {
    console.log("Server running on port 8888");
  });
}

exports.init = init;
exports.register = register;

```

Como tarea queda que escriban un test que use esta home!


