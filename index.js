const express = require ("express");
const {createServer} = require("node:http")
const {join} = require("node:path")
const {Server} = require("socket.io")


const app = express ();
app.use(express.static(__dirname + '/public'));
const server = createServer(app);
const io = new Server(server); //initialize new  instance of Socket.io by passing http server



io.on("connection", (socket) =>{

    socket.emit("chat message", "Welcome to the chat room!");
    
    //print out the chat message event
    socket.on("create", (room)=>{
        socket.join(room);
        console.log(room);
        // io.to(room).emit("chat message",msg);
         
    })
    
    socket.on("chat message",(msg)=> {  // listen on "chat message" event for incoming chat messages
        io.emit("chat message", msg)    // emit "chat message" event to all users.
        //console.log("Message : "+msg)
    })

    socket.on("disconnecting", () => {
        console.log(socket.rooms); // the Set contains at least the socket ID
      });
    
})


app.get("/", (req,res)=>{
    res.sendFile(join(__dirname, "public/index.html"));
})

server.listen(3000, ()=>{
    console.log("Server listening on port 3000");
})