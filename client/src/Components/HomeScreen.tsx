import { Accordion } from 'react-bootstrap'

const HomeScreen = () => {
  return (
    <div className='home-screen'>
      {/* Three Single Select */}
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Play</Accordion.Header>
          <Accordion.Body>
            Play Stuff  
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>Study</Accordion.Header>
          <Accordion.Body>
            Study Stuff
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2">
          <Accordion.Header>Disover</Accordion.Header>
          <Accordion.Body>
            Discover Stuff
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  )
}


export default HomeScreen;
