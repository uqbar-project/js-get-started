uuid = require("uuid/v1")

class MemoryHome {

    constructor(type) {
        this.type = type
        this.elements = {};
    }

    insert(element) {
        element.id = uuid();
        this.elements[element.id] = element;
    }

    delete(elementId) {
        delete this.elements[elementId]
    }

    get(elementId) {
        return this.elements[elementId]
    }

    update(element) {
        if(!this.elements[element.id]) {
            throw new Error(`element ${element.id} don't exist`);
        }
        this.elements[element.id] = element
    }

    all() {
        return Object.entries(this.elements).map( (x) =>  x[1] )
    }

}

module.exports = MemoryHome