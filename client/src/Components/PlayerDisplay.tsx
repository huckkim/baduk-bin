interface PlayerDetailDisplayProps{
  color: number;
  name: string;
  online: boolean; 
}

interface PlayerDisplayProps{
  color: number;
  online: boolean;
  captures: number;
  name: string;
};

const CaptureDisplay = (props: {captures: number}) => {
  return(
    <div>Captures: {props.captures}</div>
  )
}

const PlayerDetailDisplay = (props: PlayerDetailDisplayProps) => {
  return(
    <div className='player-detail-display'>
      <div>{props.online ? '🟢' : '💤'}</div>
      <div>{props.name}</div>
      <div>{props.color === 1 ? '⚫' : (props.color === -1 ? '⚪' : '') }</div>
    </div>
  )
}

const PlayerDisplay = (props: PlayerDisplayProps) => {
  return(
    <div className='player-display'>
      <PlayerDetailDisplay color={props.color} name={props.name} online={props.online}/>
      <CaptureDisplay captures={props.captures}/>
    </div>
  )
}

export default PlayerDisplay;
