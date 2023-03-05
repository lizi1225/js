const express = require('express')
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    next();
})
app.get('/get', function (req, res) {
    res.json(req.query);
});
app.post('/post', function (req, res) {
    res.json(req.body);
});

app.get('*', function (req, res) {
    res.json('ok');
});
app.listen(3000)