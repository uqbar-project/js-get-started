## Clase 3: Unit testing

Nuestra MemoryHome es el primer objeto de esta guía que comienza a tener comportamiento que nos gustaría testear de manera automática, 

Existen varias variantes para realizar testing automático. Dos frameworks muy utilizados en conjunto son [Mocha](https://mochajs.org/) para correr test y [Chai](https://www.chaijs.com/) para realizar aserciones. Sin embargo en este proyecto vamos a utilizar [Jest](https://jestjs.io/)

Instalamos jest usando la opción --save-dev para que se incluya en el package.json como dependencia pero solo de desarrollo

```
npm install jest --save-dev
```

Modificamos el atributo test de script en el package.json para que use jest:

#### package.json
``` json
{
  "name": "js-get-started",
  "version": "1.0.0",
  "description": "js tutorial",
  "main": "app.js",
  "scripts": {
    "test": "jest",
    "start": "node app.js"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/uqbar-project/js-get-started.git"
  },
  "keywords": [
    "js",
    "tutorial",
    "node"
  ],
  "author": "lgassman",
  "license": "GPL-3.0-or-later",
  "bugs": {
    "url": "https://github.com/uqbar-project/js-get-started/issues"
  },
  "homepage": "https://github.com/uqbar-project/js-get-started#readme",
  "dependencies": {
    "uuid": "^3.3.2"
  },
  "devDependencies": {
    "jest": "^24.7.1"
  }
}

```

Luego escribimos algunos test.
Por prolijidad los vamos a escribir en una subcarpeta `test`. 
Jest requiere para encontrar los test que el archivo donde se escriben los mismos tengan extensión .test.js

#### /tests/memoryHome.test.js

``` javascript
MemoryHome = require("../src/memoryHome")
Product = require ("../src/producto")

var home
var chocolate
var alfajor


function setup() {
    home = new MemoryHome()
    chocolate = new Product("chocolate", 30)
    alfajor = new Product("alfajor", 20)
    home.insert(alfajor)
    home.insert(chocolate)
}

function get() {
    expect(home.get(chocolate.id)).toBe(chocolate)
    expect(home.get(alfajor.id)).toBe(alfajor)
}

function getNotContained() {
    expect(home.get("pirulito")).toBe(undefined)
}

function deleteObject() {
    home.delete(chocolate.id);
    expect(home.get(chocolate.id)).toBe(undefined)
    expect(home.get(alfajor.id)).toBe(alfajor)
}

function update() {
    chocolate.precio = 45
    home.update(chocolate);
    expect(home.get(chocolate.id).precio).toBe(45);
}

function all() {
    var all = home.all();
    expect(all).toContain(chocolate);
    expect(all).toContain(alfajor);
}

//register functions

beforeEach(setup)
test(get.name, get)
test(getNotContained.name, getNotContained)
test(deleteObject.name, deleteObject)
test(update.name, update)
test(all.name, all)

```

Jest es un framework bastante grande, solo estamos usando una pequeña parte aquí. Las funciones beforeEach permite registrar una función que se ejecuta antes de cada test. Y la función test permite registrar bajo un nombre una función que será lo que se ejecute para testear. Cada test usa
`expect` para realizar las validaciones. En [Jest](https://jestjs.io/) se puede encontrar la documentación de todas las maneras de realizar las aserciones.

Para ejecutar los tests:
```
npm test
```
