import http from 'http';
import express from 'express';
import dotenv from 'dotenv-defaults';
import mongoose from 'mongoose';
import WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid';
import mongo from './mongo';
import wsConnect from './wsConnect'

mongo.connect();

const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({ server: server })

const db = mongoose.connection
db.once('open', () => {
    console.log("MongoDB connected!");
    wss.on('connection', (ws) => {
        // console.log("Client connected");
        // Define WebSocket connection logic
        // wsConnect.initData(ws);
        ws.id = uuidv4()
        ws.box = ''; // 用來記錄目前 active ChatBox name
        ws.onmessage = wsConnect.onMessage(wss, ws);
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () =>
    console.log(`Example app listening on port ${PORT}!`),
);