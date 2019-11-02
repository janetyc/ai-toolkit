import React from 'react';
import styled from '@emotion/styled';

import ImageWithPredictions from './ImageWithPredictions';

const List = styled.ul`
  display: flex;
  flex-wrap: wrap;
  padding: 0;
  width: 100%;
  justify-content: flex-start;
  align-items: center;
  list-style: none;
`;

const Images = ({ data, classifier }) => {
  return (
    <List>
      {data.map(image => (
        <li key={image.id}>
          <ImageWithPredictions
            id={image.id}
            src={image.src}
            classifier={classifier}
          ></ImageWithPredictions>
        </li>
      ))}
    </List>
  );
};

export default Images;
