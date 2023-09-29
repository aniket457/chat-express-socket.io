const express = require ("express");
require("./db/config")
const User = require("./db/User")
const {createServer} = require("node:http")
const {join} = require("node:path")
const {Server} = require("socket.io")



const app = express ();
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(cors());

const server = createServer(app);

const io = new Server(server); //initialize new  instance of Socket.io by passing http server

// mongoose.connect("mongodb://127.0.0.1:27017/chatApp")
// const userSchema =  new mongoose.Schema( {
//     name : String,
//     email : String,
//     password : String
// })

// const User = mongoose.model("User", userSchema);

// const userData = new User({
//     name : "Aniket",
//     email : "kaniket457@gmail.com",
//     password : "abc123"
// })

// userData.save().then(()=>{
//     console.log("User Data saved successfully");
// })

io.on("connection", (socket) =>{
    console.log("a user connected");

    socket.emit("chat message", "Welcome to the chat room!");
    
    //print out the chat message event
    socket.on("create",(room)=>{
        socket.join(room);
        console.log(room);
    })
        // io.to(room).emit("chat message");
         
    
    
    socket.on("chat message",(msg)=> {  // listen on "chat message" event for incoming chat messages
        io.emit("chat message", msg)    // emit "chat message" event to all users.
       //console.log("Message : "+msg)
    })

    socket.on("disconnect", () => {
        console.log("user disconnected"); // the Set contains at least the socket ID
      });
    
})


app.get("/", (req,res)=>{
    res.sendFile(join(__dirname, "public/index.html"));
    
})
app.post("/register", async (req, res) => {
    let user = new User(req.body);
    let result = await user.save();
    result = result.toObject();
    delete result.password;
    res.send(result);
  });


server.listen(5000, ()=>{
    console.log("Server listening on port 5000");
})