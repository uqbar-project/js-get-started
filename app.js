server = require("./server")

class MyHandler {
    onRequest(response) {
        response.write("Esto es magia");
    }
}

handler = new MyHandler();
server.init(handler);