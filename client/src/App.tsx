import { useEffect, useState } from "react"
import BadukBoard from "./Board"

interface AppProps{
  length: number;
};

const App = (props: AppProps) => {
  const [board, setBoard] = useState(Array(props.length).fill(0).map(() => new Array(props.length).fill(0)));
  let curr_player = -1;
  const onVertexClick = () => {
    return () => {
      curr_player = curr_player === 1 ? -1 : 1;
      return curr_player
    }
  }
  return (
    <BadukBoard
      board={board}
      boxSize={2} 
      vertexOnClick={onVertexClick}
    ></BadukBoard>
  )
}

export default App;
