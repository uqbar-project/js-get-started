MemoryHome = require("../memoryHome")
Product = require ("../producto")

var home
var chocolate
var alfajor





beforeEach(function() {
    home = new MemoryHome()
    chocolate = new Product("chocolate", 30)
    alfajor = new Product("alfajor", 20)
    home.insert(alfajor)
    home.insert(chocolate)
  })


test('get', function() {
    expect(home.get(chocolate.id)).toBe(chocolate)
    expect(home.get(alfajor.id)).toBe(alfajor)
})

test('getNotContained', function() {
    expect(home.get("pirulito")).toBe(undefined)
})


test('delete', function() {
    home.delete(chocolate.id);
    expect(home.get(chocolate.id)).toBe(undefined)
    expect(home.get(alfajor.id)).toBe(alfajor)
})

test('update', function() {
    chocolate.precio = 45
    home.update(chocolate);
    expect(home.get(chocolate.id).precio).toBe(45);
})

test('all', function() {
    var all = home.all();
    expect(all).toContain(chocolate);
    expect(all).toContain(alfajor);
    
})