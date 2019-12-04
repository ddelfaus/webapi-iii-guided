const express = require('express'); // importing a CommonJS module
const helmet = require("helmet")

const hubsRouter = require('./hubs/hubs-router.js');

const server = express();

// custom middleware

function logger(req, res, next) {
  console.log(`${req.method} to ${req.originalUrl}`)


  next(); // allows the request to continue to the next middleware or route handler
}

// write a gatekeeper middleware that reads a password from the headers and if the password is 'mellon', ket it continue
// if not, send back status code 401 and a message

function gatekeeper(req,res,next) {
  
  res.send(req.headers)

  if (req.headers.StartsWith("mellon")) {
    next()
  }else{
    res.send(404)
  }
  
}

//middleware
server.use(helmet())
server.use(express.json());
server.use(logger);


//endpoints

// helemt can be use for speific endpoints with /api/hubs
server.use('/api/hubs',helmet(), hubsRouter);

server.get('/', (req, res) => {
  const nameInsert = (req.name) ? ` ${req.name}` : '';

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
    `);
});

server.get('/echo', (req, res) => {
  res.send(req.headers)
})

// can use the middle helmet just for one enpoint invoking witihin the get
server.get('/area51', helmet() , gatekeeper, (req, res) => {
  res.send(req.headers)
})
module.exports = server;
