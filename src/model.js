class Model {
    toJSON() {
        const proto = Object.getPrototypeOf(this);
        const jsonObj = Object.assign({}, this);
        
        Object.entries(Object.getOwnPropertyDescriptors(proto))
            .filter(([key, descriptor]) => typeof descriptor.get === 'function')
            .forEach(([key, descriptor]) => jsonObj[key] = this[key]);
        
        return jsonObj;
    }
}

module.exports = Model