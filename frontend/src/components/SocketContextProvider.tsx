import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { WS_URL } from "../config";

interface contextInterface{
    socket:WebSocket|null,
    setSocket:(socket:WebSocket|null)=>void
}
export const SocketContext=createContext<contextInterface|undefined>(undefined);

export const SocketContextProvider=({children}:{children:ReactNode})=>{
    const [socket,setSocket]=useState<WebSocket|null>(null);
    useEffect(()=>{
        const newSocket=new WebSocket(WS_URL);
        setSocket(newSocket);
        newSocket.onopen=()=>{
            console.log("Connection Established");
        }
        newSocket.onerror=()=>{
            console.error;
        }
        newSocket.onclose=()=>{
            console.log("connection disconnected");
        }
        return () => {
            if (newSocket.readyState === WebSocket.OPEN || newSocket.readyState === WebSocket.CONNECTING) {
                newSocket.close();
            }
    };
    },[])
    return <SocketContext.Provider value={{socket,setSocket}}>
    {children}
    </SocketContext.Provider>
}

export const useSocket=():contextInterface=>{
    const context=useContext(SocketContext);
    if(!context){
        throw new Error("Error in socket context creation")
    }
    else
    return context;
}

