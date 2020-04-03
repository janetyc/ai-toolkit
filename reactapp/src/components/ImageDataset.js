import React from 'react';
import { Container, Grid, Image } from "semantic-ui-react";

const ImageDataset = ({ imageList }) => {

  return (
    <Container>
      <Grid>
        <Grid.Row columns={5}>
          {imageList.map((item, idx) => 
            <Grid.Column key={item.key}>
              <Image src={item.image_url} />
            </Grid.Column>
          )}
        </Grid.Row>
      </Grid>
    </Container>
  );
};

export default ImageDataset;