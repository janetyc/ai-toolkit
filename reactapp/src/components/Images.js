import React from 'react';
import styled from '@emotion/styled';

import ImageWithPredictions from './ImageWithPredictions';

const List = styled.ul`
  display: flex;
  flex-wrap: wrap;
  padding: 0;
  margin: 20px auto 0 auto;
  width: 100%;
  justify-content: flex-start;
  align-items: center;
  list-style: none;
`;

const Images = ({ data, detector }) => {
  return (
    <List>
      {data.map(image => (
        <li key={image.id}>
          <ImageWithPredictions
            id={image.id}
            src={image.src}
            detector={detector}
          ></ImageWithPredictions>
        </li>
      ))}
    </List>
  );
};

export default Images;
