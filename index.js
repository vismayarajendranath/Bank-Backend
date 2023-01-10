// Import express inside index.js file
const express = require('express')
// import dataService
const dataService = require('./services/data.service')
// import cors
const cors = require('cors')
// import jsonwebtoken
const jwt = require('jsonwebtoken')


// create server app using express
const app = express()

// to define origin using cors
app.use(cors({
    origin: 'http://localhost:4200'
}))

//set up port for server app
app.listen(3002, () => {
    console.log('server started at 3002');
})

// Application specific Middleware 
const appMiddleware =(req,res,next)=>{
    console.log(('Application specific Middleware '));
    next()
}
// to usw in entire application
app.use(appMiddleware)
//  to parse json
app.use(express.json())

//  bank server api- request resolving

// jwt token verification  middleware
const jwtMiddleware = (req,res,next)=>{
    console.log('router specific middileware');
    // 1.get token from request header in access-token
    const token =req.headers['access-token']
    // 2.verify token using verify method in jsonwebtoken
 try{
       const data=jwt.verify(token,"secretekey12345")
    //    assigining login user acno to currentAcno in req
        req.currentAcno = data.currentAcno
    next()
    }
    catch{
        res.status(422).json({
            status:false,
            message:'Please Log In'


        })
    }
    
}

// login API -resolve
app.post('/login', (req, res) => {
    console.log(req.body);
    // asyncronous
    dataService.login(req.body.acno, req.body.pswd)
        .then((result) => {
            res.status(result.statusCode).json(result)
        })
    })
    
    // register API -resolve
    app.post('/register', (req, res) => {
        console.log(req.body);
        // asyncronous
        dataService.register(req.body.acno, req.body.pswd, req.body.uname)
            .then((result) => {
                res.status(result.statusCode).json(result)
            })

    })
 // deposit API -resolve -router specific middileware
 app.post('/deposit',jwtMiddleware,(req, res)=> {
    console.log(req.body);
    // asyncronous
    dataService.deposit(req,req.body.acno, req.body.pswd, req.body.amt)
        .then((result) => {
            res.status(result.statusCode).json(result)
        })

})
// withdraw API -resolve -router specific middileware
app.post('/withdraw',jwtMiddleware,(req, res)=> {
    console.log(req.body);
    // asyncronous
    dataService.withdraw(req,req.body.acno, req.body.pswd, req.body.amt)
        .then((result) => {
            res.status(result.statusCode).json(result)
        })

})
// transaction API -resolve -router specific middileware
app.get('/transaction/:acno',jwtMiddleware,(req, res)=> {
    console.log(req.params);
    // asyncronous
    dataService.transaction(req.params.acno)
        .then((result) => {
            res.status(result.statusCode).json(result)
        })

})
// delete API
app.delete('/deleteAcno/:acno',jwtMiddleware,(req,res)=>{
    dataService.deleteAcno(req.params.acno)
    .then((result) => {
        res.status(result.statusCode).json(result)
    })
})