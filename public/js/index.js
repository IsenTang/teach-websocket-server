const socket = io();
console.log('socket: ', socket);
socket.on("connect", () => {
    console.log(socket.id); 
});