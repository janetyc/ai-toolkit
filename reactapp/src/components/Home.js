import React from 'react'
import { Container, Item, Image, Label, Divider } from 'semantic-ui-react'
import logo from '../img/logo.png'
import objectstory1 from '../img/objectstory-1.png'
import objectstory2 from '../img/objectstory-2.png'

function Home() {
  return (
    <Container>
      <div align='center' style={{marginTop: "30px"}}>
        <Image src={logo} />
      </div>
      <Divider />
      <Item.Group divided>
        <Item>
          <Item.Content>
            <Item.Header as='a'>Step 1: Tell a story</Item.Header>
            <Item.Description>Use your reasoning skill to <u><b>guess or speculate a possible story</b></u> in this image.<br/>(Please describe <b>WHO</b>, <b>WHAT</b>, <b>WHERE</b>, and <b>WHEN</b> to construct your story.)<br/><br/>
            e.g., "Two children" are "playing" toy bear in "the livining room" during "the Christmas time".
            </Item.Description>
          </Item.Content>
          <Image position='right' bordered size='large' src={objectstory1} />
        </Item>
        <Item>
          <Item.Content>
            <Item.Header as='a'>Step 2: Identiy key objects</Item.Header>
            <Item.Description>Identify <u><b>key objects</b></u> as evidences that support your speculation.<br/><br/>
            e.g., The identified objects: <Label color="blue">Christmas tree</Label>, <Label color="blue">Slipper shoes</Label>, <Label color="blue">Toy bear</Label>
            </Item.Description> 
          </Item.Content>
          <Image position='right' bordered size='large' src={objectstory2} />
        </Item>
        <Item>
          <Item.Content>
            <Item.Header as='a'>Step 3: Complete your story</Item.Header>
            <Item.Description><u><b>Check and submit</b></u> your story.</Item.Description>
          </Item.Content>
        </Item>
      </Item.Group>
    </Container>
  )
}
export default Home;