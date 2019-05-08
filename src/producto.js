var Model = require("./model")
class Producto extends Model {

    constructor(nombre, precio) {
        super();
        this.nombre = nombre;
        this.precio = precio;
    }

    get esCaro() {
        return this.precio > 150
    }

    aumentarPrecio() {
        this.precio *= 1.1
    }
}

module.exports = Producto;
