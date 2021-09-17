import PlayerDisplay from './PlayerDisplay'

interface SidebarProps{
	color: number;
	captures: [number, number];
	name: [string,string];
  online: [boolean, boolean];
};

const Sidebar = (props: SidebarProps) =>{
  const myidx = props.color === 1 ? 0 : 1;
  const theiridx = props.color === 1 ? 1 : 0;
	return (
		<div className='sidebar'>
			{/* Enemy player display */}
			<PlayerDisplay
				color={props.color === 1 ? -1 : 1}
        online={props.online[theiridx]}
        captures={props.captures[theiridx]}
        name={props.name[theiridx]}
      />
			{/* Options, start game, pass, surrender */}

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
