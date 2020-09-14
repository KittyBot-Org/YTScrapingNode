import ytsr from 'ytsr'
import express from 'express'
const {
    Client
} = require('pg')
import cors from 'cors'
import bodyParser from 'body-parser'
import {
    equal
} from 'assert'


var app = express();

app.use(bodyParser.json())
app.use(cors())

app.post("/search", async (req, res) => {
    if (req.body.query.trim() == "") {
        res.send(error("please provide a propper search string"));
        return
    }
    if (!await isSessionValid(req.headers.authorization)) {
        res.send(error("sessionId doesn't exists!"));
        return;
    }

    res.send(await ytsr(req.body.query, {
        limit: req.body.limit,
        restricted: req.body.restricted
    }))
})

function error(error) {
    return {
        error: error
    };
}

async function isSessionValid(sessionId) {
    const client = new Client({
        host: 'kittybot.de',
        user: 'kittybot',
        database: 'kittybot',
        password: '745699b756b75678b4v578687b479568b7968547b6',
        port: 5432,
    })

    await client.connect();
    const res = await client.query('SELECT * from sessions WHERE session_id = $1::varchar', [sessionId])
    await client.end();
    return res.rows.length > 0
}

app.listen(process.env.SERVER_PORT || 3000, () => {
    console.log(`app listening on port ${process.env.SERVER_PORT || 3000}...`)
})