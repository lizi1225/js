const express = require('express')
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Methods': 'GET,POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type,name'
    });
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
})
app.get('/get', function (req, res) {
    res.json(req.query);
});
app.post('/post', function (req, res) {
    res.json(req.body);
});

// app.get('*', function (req, res) {
//     res.json('ok');
// });
app.listen(3000)