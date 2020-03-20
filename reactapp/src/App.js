import React, { useState, useRef, useEffect } from 'react';
import { Global, css } from '@emotion/core';
import * as ml5 from 'ml5';
import './App.css';

import DropZone from './components/DropZone';
import Images from './components/Images';

const globalStyle = css`
  * {
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
      Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  }
`;

const initClassifier = callback =>
  ml5.imageClassifier('MobileNet', () => callback && callback());

const query = "table";

function App() {
  //use state Hooks
  const [loaded, setLoaded] = useState(false);
  const [images, setImages] = useState([]);

  const classifierRef = useRef();

  useEffect(() => {
    classifierRef.current = initClassifier(() => setLoaded(true));
  }, []); //pass empty array --> props, state preserve the initial value
  
  return (
    <div>
      <Global styles={globalStyle} />
      {!loaded && <h1>Loading ml5 model...</h1>}
      <div className="main-area">
        <div className="left-area">
          {loaded && <DropZone setImages={setImages} />}
        </div>
        <div className="right-area">
        {loaded && (
          <Images data={images} classifier={classifierRef.current}></Images>
        )}
        </div>
      </div>
    
    </div>
  );
  
  
}

export default App;
