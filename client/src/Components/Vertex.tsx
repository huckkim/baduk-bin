interface VertexProps {
  board: Array<Array<number>>;
  x: number;
  y: number;
  marker: string;
  boxSize: number;
  vertexOnClick: any;
}

const Vertex = (props: VertexProps) => {
  return (
    <div
      onClick={() => {
        props.vertexOnClick(props.x, props.y);
      }}
      key={props.x + "-" + props.y + "-" + props.board[props.y][props.x]}
      className={"baduk-stone baduk-stone-" + props.board[props.y][props.x]}
      style={{
        top: props.boxSize * props.y + "em",
        left: props.boxSize * props.x + "em",
        width: props.boxSize + "em",
        height: props.boxSize + "em",
      }}></div>
  );
};

export default Vertex;
