import {  useEffect, useRef} from "react"
import { useNavigate } from "react-router-dom";
import {  useSocket } from "./SocketContextProvider";

export const JoinRoom=()=>{
    const roomref=useRef<HTMLInputElement|null>(null);
    const {socket}=useSocket();
    const navigate=useNavigate();

    useEffect(()=>{

       if(socket){
        socket.onmessage=(message)=>{
            console.log(message);
            if(message.data==="room joined"){
                console.log(socket);
                navigate('/chat');
            }
            else{
                alert("join failed");
            }
        }
       } 
    },[socket])

    const joinRoom=()=>{
        console.log("button clicked");
        
        socket?.send(JSON.stringify({
            "type": "join",
            "payload": {
              "roomId": roomref.current?.value
            }
         }))
    }
    
    return (
        <div className="w-full h-screen flex items-center justify-center">
                <input ref={roomref} type="text" className="border border-black p-2 m-2 rounded-md" placeholder="enter room id"/>
                <button onClick={joinRoom} className="p-2 bg-blue-700 rounded-md">Join Room</button>
        </div>
    )
}