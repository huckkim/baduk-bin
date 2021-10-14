interface BadukBoardProps {
  board: Array<Array<number>>;
  boxSize: number;
  vertexOnClick: any;
};

interface GridLineProps {
  length: number;
  width: number;
  relX: (i: number) => number;
  relY: (i: number) => number;
  xyrange: Array<number>;
  boxSize: number;
};

interface VertexProps{
  board: Array<Array<number>>;
  x: number;
  y: number;
  marker: string;
  boxSize: number;
  vertexOnClick: any;
};

const Grid = (props: GridLineProps) => {
  let horiLines = props.xyrange.map((y) => {
    return <rect key={y.toString()} width={(props.boxSize * (props.length - 1))+'em'} height={'0.05em'} y={props.relY(y)+'em'} x={(props.boxSize / 2)+'em'} />
  });

  let vertLines = props.xyrange.map((x) => {
    return <rect key={x.toString()} width={'0.05em'} height={(props.boxSize * (props.length - 1))+'em'} x={props.relX(x)+'em'} y={(props.boxSize / 2)+'em'} />
  });

  let starCoords = []
  if (props.length === 9) {
    starCoords.push([2, 2]);
    starCoords.push([2, 6]);
    starCoords.push([6, 2]);
    starCoords.push([6, 6]);
    starCoords.push([4, 4]);
  }
  else if (props.length === 13) {
    starCoords.push([3, 3]);
    starCoords.push([3, 9]);
    starCoords.push([9, 3]);
    starCoords.push([9, 9]);
    starCoords.push([6, 6]);
  }
  else if (props.length === 19) {
    starCoords.push([3, 3]);
    starCoords.push([3, 15]);
    starCoords.push([15, 3]);
    starCoords.push([15, 15]);

    starCoords.push([9, 3]);
    starCoords.push([9, 15]);
    starCoords.push([3, 9]);
    starCoords.push([15, 9]);

    starCoords.push([9, 9]);
  }

  let starPoints = starCoords.map(([x, y]) => {
    return (
      <circle
        key={x + '-' + y}
        r={(props.boxSize / 10) + 'em'}
        cx={(props.relX(x) + 0.02) + 'em'}
        cy={(props.relY(y) + 0.01) + 'em'}
      />
    )
  })

  return (
    <svg
      className="baduk-grid"
      width={(props.length * props.boxSize) + 'em'}
      height={(props.length * props.boxSize) + 'em'}
    >
      {horiLines}
      {vertLines}
      {starPoints}
    </svg>
  )
};

const Vertex = (props: VertexProps) => {
  return (
    <div
      onClick={() => {
        props.vertexOnClick(props.x, props.y);
      }}
      key={props.x + '-' + props.y+'-'+props.board[props.y][props.x]}
      className={"baduk-stone baduk-stone-" + props.board[props.y][props.x]}
      style={{
        top: props.boxSize*props.y +'em',
        left: props.boxSize*props.x +'em',
        width: props.boxSize + 'em',
        height: props.boxSize + 'em',
      }}
    >
    </div>
  )
};

const arrRange = (start: number, len: number) =>
  Array.from(new Array(len), (x, i) => i);

const BadukBoard = (props: BadukBoardProps) => {
  // relative X and Y positions
  let xyrange = arrRange(0, props.board.length);
  let relX = (i: number) => i * (props.boxSize) + props.boxSize / 2;
  let relY = (i: number) => i * (props.boxSize) + props.boxSize / 2;
  return (
    <div
      className="baduk-board"
      style={{
        width: (xyrange.length * props.boxSize + 0.5) + 'em',
        height: (xyrange.length * props.boxSize + 0.5) + 'em',
      }}>
      {/* Renders the nxn grid with the star points*/}
      <Grid
        length={props.board.length}
        width={props.board[0].length}
        xyrange={xyrange}
        relX={relX} relY={relY}
        boxSize={props.boxSize}
      />

      {/* Renders the Vertex that can be clicked */}
      {xyrange.map(x => {
        return xyrange.map(y => {
          return (
            <Vertex
              board={props.board}
              key={x + '-' + y}
              x={x} y={y}
              marker=""
              boxSize={props.boxSize}
              vertexOnClick={props.vertexOnClick}
            ></Vertex>);
        })
      })}
    </div>
  )
};

export default BadukBoard;
