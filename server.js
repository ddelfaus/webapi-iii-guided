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
  
  const password = req.headers.password

  if (password && password.toLowerCase() ==="mellon") {
    next()
  }else{
    res.status(404).json({ you: " you shall not pass"})
  }
  
}


const checkRole = (role) => {
  return function(req,res,next) {
    if(role && role === req.headers.role) {
      next()
    }else {
      res.status(403).json({ message: "must have right role"})
    }
  }
}



//middleware
server.use(helmet())
server.use(express.json());
server.use(logger);


//endpoints

// helemt can be use for speific endpoints with /api/hubs
server.use('/api/hubs',helmet(), checkRole('admin'), hubsRouter);

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
server.get('/area51', helmet() , gatekeeper, checkRole('agent'),(req, res) => {
  res.send(req.headers)
})
module.exports = server;
