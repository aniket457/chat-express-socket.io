const socket = io(); //trying to connect to the host that serves the page.

// let's assume that the client page, once rendered, knows what room it wants to join

socket.emit('create', 'room1');


const form = document.getElementById("form");
const input = document.getElementById("input");
const messages = document.getElementById("messages");

// when the user types in a message, the server gets it as a chat message event. 
 form.addEventListener("submit", (e)=>{
    e.preventDefault();
    if(input.value){
        socket.emit("chat message", input.value);
        input.value = "";
    }
 })
socket.on("chat message", (msg) => {
const item = document.createElement('li');
item.textContent = msg;
messages.appendChild(item);
window.scrollTo(0, document.body.scrollHeight);
});
