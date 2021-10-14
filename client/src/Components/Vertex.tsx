interface VertexProps {
  board: Array<Array<number>>;
  x: number;
  y: number;
  marker: string; // "" - none, s - square, c - circle, t - triangle, d - dot, x - cross
  boxSize: number;
  vertexOnClick: any;
}

const Vertex = (props: VertexProps) => {
  const stone = props.board[props.y][props.x];

  return (
    <div
      onClick={() => {
        props.vertexOnClick(props.x, props.y);
      }}
      key={props.x + "-" + props.y + "-" + stone}
      className={`baduk-stone baduk-stone-${stone}`}
      style={{
        top: props.boxSize * props.y + "em",
        left: props.boxSize * props.x + "em",
        width: props.boxSize + "em",
        height: props.boxSize + "em",
      }}>
      <Marker stone={stone} marker={props.marker} />
    </div>
  );
};

interface MarkerProps {
  stone: number;
  marker: string;
}

const Marker = (props: MarkerProps) => {
  return (
    <svg
      width="60%"
      height="60%"
      viewBox="0 0 100 100"
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
      }}>
      <MarkerShape {...props} />
    </svg>
  );
};

const MarkerShape = (props: MarkerProps) => {
  const stroke = { "stroke-width": "12%", stroke: props.stone === 1 ? "white" : "black" };

  console.log(props);

  switch (props.marker) {
    case "s":
      return <rect x="10" y="10" width="80" height="80" fill="transparent" {...stroke} />;
    case "c":
      return <circle cx="50" cy="50" r="40" fill="transparent" {...stroke} />;
    case "t":
      return <polygon points="8,81 50,8 92,81" fill="transparent" {...stroke} />;
    case "d":
      return <circle cx="50" cy="50" r="24" fill={stroke.stroke} {...stroke} />;
    case "x":
      return (
        <>
          <line x1="8" y1="8" x2="92" y2="92" {...stroke} />
          <line x1="8" y1="92" x2="92" y2="8" {...stroke} />
        </>
      );
    default:
      return <></>;
  }
};

export default Vertex;
