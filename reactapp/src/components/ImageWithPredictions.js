import React, { useRef, useState, useEffect } from 'react';
import styled from '@emotion/styled';
import ConceptNetAPI from './ConceptNetAPI';

const classifyImg = (classifier, image) =>
  classifier.predict(image, 5, (err, results) => {
    if (err) console.error('Unable to make a prediction.');
    return results;
  });

const Img = styled.img`
  width: 90%;
  box-shadow: 0px 0px 13px -1px rgba(0, 0, 0, 0.4);
  margin: 16px;
  border-radius: 8px;
`;

const Prediction = styled.div`
  width: 90%;
  display: flex;
  justify-content: space-between;
  padding: 5px;
  border: 1px #333 solid;
`;

const mystyle = {
  // border: "1px solid #ff0000",
  padding: "1px"
};

const ImageWithPredictions = ({ classifier, id, src }) => {
  const imgRef = useRef();
  const [predictions, setPredictions] = useState([]);
  const [onQuery, setOnQuery] = useState(false);

  useEffect(() => {
    const generatePredictions = async () => {
      const predictions = await classifyImg(classifier, imgRef.current);
      setPredictions(predictions);
    };
    generatePredictions();
  }, [classifier]); // pass the second augment to useEffect


  function onClickEvent(e) {
    e.preventDefault();
    setOnQuery(true);
    console.log(e.currentTarget.getAttribute('value'));
    if(e.currentTarget.childNodes.length>2){
      e.currentTarget.childNodes[1].set("visible")
      console.log(e.currentTarget.childNodes[1]);
    }
    
  }

  return (
    <div>
      <Img key={id} alt={`img - ${id}`} src={src} ref={imgRef} />
      {predictions.map((pred, i) => {
        const { label, confidence } = pred;
        const roundedConfidence = Math.floor(confidence * 10000) / 100 + '%';
        return (
          <Prediction key={i}>
            <div>{label.split(',').map((item, indx) => 
              // <span style={mystyle} key={indx} value={item} onClick={onClickEvent}>
                <ConceptNetAPI currentNode={item} confidence={roundedConfidence}/>
              // </span>
            )}</div>
          </Prediction>
        );
      })}
    </div>
  );
};

export default ImageWithPredictions;
