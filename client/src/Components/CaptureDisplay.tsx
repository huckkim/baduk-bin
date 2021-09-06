interface CaptureDisplayProps{
  my_color: number;
  their_color: number;
  blackCaptures: number;
  whiteCaptures: number;
  boxSize: number;
}

const CaptureDisplay = (props: CaptureDisplayProps) => {
  let myCaptures = props.my_color === 1 ? props.blackCaptures : props.whiteCaptures;
  let theirCaptures = props.my_color === 1 ? props.whiteCaptures : props.blackCaptures;
  return (
    <div
      className="capture-display"
      style={{
        display:'flex',
        flexDirection:'column-reverse',
        justifyContent:'space-between' 
      }}
    >
      <div style={{
        display:'flex'
      }}>
        <div className={"capture-stone-" + props.my_color} style={{
          width: props.boxSize + 'em',
          height: props.boxSize + 'em',
        }}></div>
        <div>{myCaptures === 1 ? '1 capture': myCaptures+' captures'}</div>
      </div>
      <div>
        <div className={"capture-stone-" + props.their_color} style={{
          width: props.boxSize + 'em',
          height: props.boxSize + 'em',
        }}></div>
        <div>{theirCaptures === 1 ? '1 capture': theirCaptures+' captures'}</div>
      </div>
    </div>
  )
}

export default CaptureDisplay;
