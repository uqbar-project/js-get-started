uuid = require("uuid/v1")

class MemoryHome {

    constructor() {
        this.elements = {};
    }

    insert(element) {
        element.id = uuid();
        this.elements[element.id] = element;
    }

    delete(elementId) {
        this.elements[elementId] = undefined
    }

    get(elementId) {
        return this.elements[elementId]
    }

    update(element) {
        this.elements[element.id] = element
    }

    all() {
        return Object.entries(this.elements).map(function (x) {return x[1]} )
    }

}

module.exports = MemoryHome