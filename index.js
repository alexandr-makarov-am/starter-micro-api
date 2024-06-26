const http = require('http');
const axios = require('axios');
const express = require('express');

const app = express();

app.use(express.json());

let queue = [];

app.get('/', async (req, res) => {
    const json = [];
    for (const i in [...new Array(60)]) {
        const index = i % queue.length;
        const item = queue[index];
        if (item) {
            const { url, method, data, hook } = item;
            const response = await axios.request({
                method,
                url,
                data
            })
            await axios.post(hook, { content: JSON.stringify(response.data) + "   i: " + i });
            json.push(response.data);
        }
    }
    return res.status(200).json(json);
})

app.get('/queue/list', (req, res) => {
    res.status(200).json(JSON.stringify(queue));
})

app.get('/queue/clear', (req, res) => {
    queue = [];
    res.status(200).json(JSON.stringify(queue));
})

app.post('/queue/add', (req, res) => {
    if (Array.isArray(req.body)) {
        queue = [...queue, ...req.body];
        return res.status(200).json("ok");
    }
    res.status(400).json("wrong payload");
})

http.createServer(app).listen(process.env.PORT || 3000);
