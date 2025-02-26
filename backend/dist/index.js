"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
//start a websocket server
const wss = new ws_1.WebSocketServer({ port: 8080 });
const roomMap = new Map();
let roomId = '';
wss.on('connection', (ws) => {
    ws.on('error', console.error);
    ws.on('message', function message(message) {
        var _a, _b, _c;
        console.log(message.toString());
        const parsedMessage = JSON.parse(message.toString());
        if (parsedMessage.type === "join") {
            roomId = (_a = parsedMessage.payload) === null || _a === void 0 ? void 0 : _a.roomId;
            console.log("client joined the room : ", roomId);
            if (roomMap.has(roomId)) {
                (_b = roomMap.get(roomId)) === null || _b === void 0 ? void 0 : _b.add(ws);
            }
            else {
                roomMap.set(roomId, new Set([ws]));
            }
            ws.send("room joined");
        }
        if (parsedMessage.type === "chat") {
            (_c = roomMap.get(roomId)) === null || _c === void 0 ? void 0 : _c.forEach((client) => {
                client.send(JSON.stringify({
                    type: "chat",
                    payload: {
                        message: parsedMessage.payload.message
                    }
                }));
            });
        }
    });
    ws.on('close', () => {
        var _a, _b;
        console.log("client disconnected");
        if (roomMap.has(roomId) && ((_a = roomMap.get(roomId)) === null || _a === void 0 ? void 0 : _a.has(ws)))
            (_b = roomMap.get(roomId)) === null || _b === void 0 ? void 0 : _b.delete(ws);
    });
});
