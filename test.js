const express = require('express')
const app = express() 
app.use(express.static('public')) 
app.listen(8000, "localhost");
console.log("TCP server listening on port 8000 at localhost.");
