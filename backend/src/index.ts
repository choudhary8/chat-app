import WebSocket, { WebSocketServer } from "ws";

//start a websocket server
const wss:WebSocketServer=new WebSocketServer({port:8080});
const roomMap:Map<string,Set<WebSocket>>=new Map();
let roomId:string='';

interface joinPayloadInterface{
    roomId:string
}
interface chatPayloadInterface{
    message:string
}
interface messageInterface{
    type:string,
    payload:joinPayloadInterface & chatPayloadInterface
}

wss.on('connection',(ws)=>{
    ws.on('error',console.error);

    ws.on('message',function message(message){
        console.log(message.toString());
        const parsedMessage:messageInterface=JSON.parse(message.toString());
        
        if(parsedMessage.type==="join"){
            roomId=parsedMessage.payload?.roomId;
            console.log("client joined the room : ",roomId);
            if(roomMap.has(roomId)){
                roomMap.get(roomId)?.add(ws);
            }
            else{
                roomMap.set(roomId,new Set([ws]));
            }
            ws.send("room joined")
        }

        if(parsedMessage.type==="chat"){
            roomMap.get(roomId)?.forEach((client)=>{
                client.send(JSON.stringify({
                    type:"chat",
                    payload:{
                        message:parsedMessage.payload.message
                    }
                }))
            })
        }
        
        
    })

    ws.on('close',()=>{
        console.log("client disconnected");
        if(roomMap.has(roomId)&&roomMap.get(roomId)?.has(ws))
        roomMap.get(roomId)?.delete(ws);
    })
})