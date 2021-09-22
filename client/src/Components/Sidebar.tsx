import { Socket } from 'socket.io-client'
import { Button, ButtonGroup, FormControl, InputGroup } from 'react-bootstrap';
import PlayerDisplay from './PlayerDisplay'

interface SidebarProps{
	color: number;
	captures: [number, number];
	name: [string,string];
	online: [boolean, boolean];
  socket: Socket;
  roomID: string;
};

interface SocketProps{
  socket: Socket;
  roomID: string;
}

const ButtonDisplay = (props: SocketProps) => {
	return (
		<div className="button-display">
			<ButtonGroup>
				<Button onClick={() => { props.socket.emit('PLAY_MOVE', 0, 0, true, props.roomID)} }>Pass</Button>
				<Button onClick={() => { props.socket.emit('CREATE_GAME', 19, [], "random")}}>Create Game</Button>
				<Button onClick={() => { props.socket.emit('SURRENDER_MOVE', props.roomID)}}>Surrender</Button>
			</ButtonGroup>
		</div>
	)
}

const RoomIdEnter = (props: SocketProps) => {
  return(
    <div className="room-id-enter">
      <InputGroup>
        <FormControl 
          placeholder="Room ID"
          aria-label="Recipient's username"
          aria-describedby="basic-addon2"
        />
        <Button 
          onClick={() => {}}
          variant="outline-secondary" id="button-addon2">
          Join Game
        </Button>
      </InputGroup>
    </div>
  )
};

const Sidebar = (props: SidebarProps) =>{
  const myidx = props.color === 1 ? 0 : 1;
  const theiridx = props.color === 1 ? 1 : 0;
	return (
		<div className='sidebar'>
			{/* Enemy player display */}
			<PlayerDisplay
				color={props.color === 1 ? -1 : (props.color === -1 ? 1 : 0)}
        online={props.online[theiridx]}
        captures={props.captures[theiridx]}
        name={props.name[theiridx]}
      />
			{/* Options, start game, pass, surrender */}
      <div>
        <ButtonDisplay
          socket={props.socket}
          roomID={props.roomID}
        />
        <RoomIdEnter 
          socket={props.socket}
          roomID={props.roomID}
        />
      </div>

			{/* Your player display */}
			<PlayerDisplay 
				color={props.color}
        online={props.online[myidx]}
        captures={props.captures[myidx]}
        name={props.name[myidx]}
      />
		</div>
	)
}

export default Sidebar;
