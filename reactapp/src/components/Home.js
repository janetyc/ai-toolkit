import React from 'react'
import { Container, Item, Image, Label, Divider, Button, Message } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import queryString from 'query-string';

import logo from '../img/logo.png'
import objectstory1 from '../img/objectstory-1.png'
import objectstory2 from '../img/objectstory-2.png'


function Home() {
  const urlparams = window.location.hash.split('?')[1];
  const values = queryString.parse(urlparams);

  return (
    <Container>
      <div align='center' style={{marginTop: "30px"}}>
        <Image src={logo} />        
      </div>

      <Divider />

      <div style={{textAlign: "center", marginTop: "10px"}}>
      {'workerId' in values && 'assignmentId' in values && 'image_id' in values && (
        <Button size="large" fluid color="teal" as={Link} to={"/annotateObjectStory/" + values.image_id + "?"+urlparams}>Start to Tell a Object Story!</Button>
      )}
      </div>
      <Message color="blue">
        <Message.Header>Reminder!! Please use the <u>Google Chrome browser</u> to do the task</Message.Header>
      </Message>
      <Item.Group divided>
        <Item>
          <Item.Content>
            <Item.Header>Step 1: Tell a story</Item.Header>
            <Item.Description>Use your reasoning skill to <u><b>guess or speculate a possible story</b></u> in this image.<br/>(Please describe <b>WHO</b>, <b>WHAT</b>, <b>WHERE</b>, and <b>WHEN</b> to construct your story.)<br/><br/>
            e.g., "Two children" are "playing" toy bear in "the livining room" during "the Christmas time".
            </Item.Description>
          </Item.Content>
          <Image position='right' bordered size='large' src={objectstory1} />
        </Item>
        <Item>
          <Item.Content>
            <Item.Header>Step 2: Identiy key objects</Item.Header>
            <Item.Description>Identify <u><b>key objects</b></u> as evidences that support your speculation.<br/><br/>
            e.g., The identified objects: <Label color="blue">Christmas tree</Label>, <Label color="blue">Slipper shoes</Label>, <Label color="blue">Toy bear</Label>
            </Item.Description> 
          </Item.Content>
          <Image position='right' bordered size='large' src={objectstory2} />
        </Item>
        <Item>
          <Item.Content>
            <Item.Header>Step 3: Complete your story</Item.Header>
            <Item.Description><u><b>Check and submit</b></u> your story.</Item.Description>
          </Item.Content>
        </Item>
      </Item.Group>
    </Container>
  )
}
export default Home;