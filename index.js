const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

let backoffDate = new Date();

app.use('/', express.static('static'));

app.get('/check/:url', async (req, res) => {
    const response = await fetch(req.params.url);

    const result = {
        status: response.status
    }

    res.status(200).type("application/json").send(result);
});

app.get('/:baseurl/:id', async (req, res) => {
    if (backoffDate.getTime() < Date.now()) {
        const response = await fetch(req.params.baseurl + req.params.id);
        
        if (response.status == 429) {
            backoffDate = new Date();
            backoffDate.setTime(backoffDate.getTime() + 60*1000);
            res.status(response.status).type("text/plain").send('pastebin needs a break');
        }

        if (!response.ok) {
            res.status(response.status).send(await response.text());
        }

        if (response.ok) {
            res.type(response.type).send(await response.text());
        }
    } else {
        res.status(429).type("text/plain").send('pastebin needs a break');
    }
});

app.listen(port, () => {
    console.log(`Randpaste is listening on port ${port}`);
})