import { useEffect, useRef, useState } from "react";
import { useSocket } from "./SocketContextProvider";

let id = 0;

interface messageInterface {
  id: number;
  msg: string;
}

interface payloadInterface {
  message: string;
}

interface responseInterface {
  type: string;
  payload: payloadInterface;
}
// let msgs:messageInterface[]=[];

export const ChatRoom = () => {
  const msgRef = useRef<HTMLInputElement | null>(null);
  const [msgs, setmsgs] = useState<Array<messageInterface>>([]);
  const { socket } = useSocket();
  if (!socket) {
    return <div className="text-white">Loading...</div>;
  }

  useEffect(() => {
    if (socket) {
      socket.onmessage = (message) => {
        const parsedMessage:responseInterface=JSON.parse(message.data.toString());
        
        setmsgs((msgs) => [
          ...msgs,
          {
            id: id++,
            msg: parsedMessage.payload.message,
          },
        ]);
      };
    }
  }, [socket]);

  const sendMessage = () => {
    const msg = msgRef?.current?.value;
    if (msg === "" || msg === undefined) {
      alert("please enter the message");
    } else {
      socket?.send(
        JSON.stringify({
          type: "chat",
          payload: {
            message: msg,
          },
        })
      );
    }
  };

  // if(!socket){
  //     return <div>
  //         Loading...
  //     </div>
  // }
  return (
    <div className="mx-28 flex justify-center">
      <div className="h-dvh bg-black w-3/4 flex-col items-center space-between">
        <div className="m-2 h-[90%] bg-gray-900 rounded-md overflow-y-auto">
          {msgs.map((mg) => (
            <div key={mg.id}>
              <span className="my-[1px] mx-2 py-[1px] text-white px-4 bg-gray-800 break-all rounded-sm inline-block">
                {mg.msg}
              </span>
            </div>
          ))}
        </div>
        <div className="fixed w-2/3 bottom-2 mx-2">
          <input
            ref={msgRef}
            type="text"
            className="border border-black p-2 m-2 rounded-md w-[80%]"
            placeholder="enter message"
          />
          <button
            onClick={sendMessage}
            className="py-2 px-8 bg-blue-700 rounded-md"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};
