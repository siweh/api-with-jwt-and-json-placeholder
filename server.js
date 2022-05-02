require('dotenv').config();
const { default: axios } = require('axios');
const express = require('express');
const app = express();

const jwt = require('jsonwebtoken');

app.use(express.json())
app.use(express.urlencoded({ extended: false }));


app.get('/posts', authenticateToken, async (req, res) =>{
    const results = await axios.get(`https://jsonplaceholder.typicode.com/users/${req.user.id}/posts`);
    //console.log(req.user.id);
    //console.log(results);
    res.json(results.data);
});

app.post('/login', async (req, res) => {
    //Authenticate a user
    //console.log(req);
    const {username} = req.body;
    const results = await axios.get(`https://jsonplaceholder.typicode.com/users?username=${username}`)
    //console.log(data);
    const user = {name: username, id: undefined};
    //console.log(user);
    if (results.data.length === 0){
        return res.sendStatus(403);
    }

   // console.log(results.data[0].id);
    user.id = results.data[0].id;
    const access_token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    console.log(access_token);
    res.json({accessToken: access_token});
});

//?Authenticate if the token is for the correct user
function authenticateToken(req, res, next){
    //Get the token
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    //check if there is no token
    if(token === null) return res.sendStatus(401)

    //Verify the token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        console.log(err)
        if (err) return res.sendStatus(403)
        req.user = user;
        next();
      })
}

//?Import the port number to be used here
const PORT = process.env.PORT || 4017;

app.listen(PORT, function(){
    console.log(`App started on port ${PORT}`);
});