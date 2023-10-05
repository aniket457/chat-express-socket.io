const express = require("express");
require("./db/config");
const User = require("./db/User");
const Message = require("./db/Message");
const { createServer } = require("node:http");
// const {join} = require("node:path")
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
// app.use(express.static(__dirname + '/public'));
app.use(express.json());

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
}); //initialize new  instance of Socket.io by passing http server

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.emit("chat-message", "Welcome to the chat room!");

  //print out the chat message event
  socket.on("create", (room) => {
    socket.join(room);
    console.log(room);
  });
  // io.to(room).emit("chat message");

  socket.on("chat-message", (message,userId) => {
    // const userId = JSON.parse(localStorage.getItem("user"))._id;
    // console.warn(`User ${userId}`)
    const chatMsg = new Message({message,userId})
    chatMsg.save().then(()=> {
      io.emit("chat-message", message); // emit "chat message" event to all users.
    })
    // listen on "chat message" event for incoming chat messages
    console.log("Message : " + message);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected"); // the Set contains at least the socket ID
  });
});

// app.get("/", (req,res)=>{
//     res.sendFile(join(__dirname, "public/index.html"));

// })
app.post("/register", async (req, res) => {
  let user = new User(req.body);
  let result = await user.save();
  result = result.toObject();
  delete result.password;
  res.send(result);
});

app.post("/login", async (req, res) => {
  let user = await User.findOne(req.body).select("-password");
  if (req.body.password && req.body.email) {
    if (user) {
      res.send(user);
    } else {
      res.send({ result: "No User found" });
    }
  } else {
    res.send({ result: "No User found" });
  }
});


server.listen(5000, () => {
  console.log("Server listening on port 5000");
});
