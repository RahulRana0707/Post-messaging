const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3000; // You can change the port number if needed

const server = http.createServer((req, res) => {
    // Check if the request is for the root URL
    if (req.url === '/') {
        // Read the index.html file
        fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Error loading index.html');
            } else {
                // Serve the index.html file
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    } else {
        // If the request is for any other resource, return a 404 error
        res.writeHead(404);
        res.end('404 Not Found');
    }
});

// Start the server
server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
});
