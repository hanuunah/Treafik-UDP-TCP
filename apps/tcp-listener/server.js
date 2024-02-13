const net = require('net');

// Create a TCP server
const server = net.createServer((socket) => {
  console.log('Client connected');

  // Handle data received from the client
  socket.on('data', (data) => {
    console.log(`Received data: ${data}`);
    // Send a response back to the client
    socket.write('Server received your data.');
  });

  // Handle client disconnection
  socket.on('end', () => {
    console.log('Client disconnected');
  });
});

const PORT = 8085;

// Start the server and listen on a specific port
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
