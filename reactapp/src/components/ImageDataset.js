import React from 'react';
import { Container, Card, Image, Button} from "semantic-ui-react";
import { Link } from 'react-router-dom';

const ImageDataset = ({ imageList }) => {

  return (
    <Container>
      <Card.Group itemsPerRow={5}>
        {imageList.map((item, idx) => 
          <Card key={item.key}>
            <Card.Content>
            <Image src={item.image_url} />
            </Card.Content>
            <Card.Content extra><Button attached='bottom' as={Link} to={"/annotateObjectStory/" + item.id}>Tell a Story</Button></Card.Content>
          </Card>
        )}
      </Card.Group>
    </Container>
  );
};

export default ImageDataset;