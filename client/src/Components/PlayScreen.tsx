import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import io, { Socket } from "socket.io-client";
import BadukBoard from "./Board";
import Sidebar from "./Sidebar";

const PlayScreen = () => {
  const [board, setBoard] = useState(Array(19).fill(0).map(() => new Array(19).fill(0)));
  const [socket, setSocket] = useState({} as Socket);
  const [black_captures, setBlackCaptures] = useState(0);
  const [white_captures, setWhiteCaptures] = useState(0);
  const [my_color, setMyColor] = useState(0);
  const [roomID, setRoomId] = useState("");

  useEffect(() => {
    const newSocket = io(`localhost:2567`);
    setSocket(newSocket);
    newSocket.on("UPDATE_BOARD", (board: Array<Array<number>>, black_captures, white_captures, msg: string) => {
      setBlackCaptures(black_captures);
      setWhiteCaptures(white_captures);
      console.log("Update board")
      setBoard(board);
    });

    newSocket.on("ERROR", (msg: string) => {
      toast(msg);
    });

    newSocket.on("ROOM_ID", (roomId: string) => {
      setRoomId(roomId);
      alert(roomId);
    })

    newSocket.on("GAME_STARTED", (board: Array<Array<number>>,) => {
      setBoard(board);
      toast("Game Started!")
    })

    newSocket.on("BLACK_PLAYER", () => {
      console.log("BLACK")
      setMyColor(1);
    })
    
    newSocket.on("WHITE_PLAYER", () => {
      console.log("WHITE")
      setMyColor(-1);
    })

    newSocket.on("GAME_END", (winner, bscore, wscore, msg) => {
      toast((winner === 1 ? "Black" : "White") + "wins by "+ Math.abs(bscore-wscore)+" points!")
    })

    return () => { newSocket.close() };
  }, [setSocket]);

  return (
    <div>
      <div className="main-screen">
        <BadukBoard
          board={board}
          boxSize={2} 
          vertexOnClick={(x: number, y:number) => { (socket as Socket).emit("PLAY_MOVE", x, y, false, roomID) }}
        />
        <Sidebar
          color={my_color}
          captures={[black_captures, white_captures]}
          name={['Anon', 'Anon']}
          online={[true, true]}
          socket={socket}
          roomID={roomID}
          setRoomId={setRoomId}
        />
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
      />
    </div>
  )
}

export default PlayScreen;
