import React, { useRef, useState, useEffect } from 'react';
import styled from '@emotion/styled';

const classifyImg = (classifier, image) =>
  classifier.predict(image, 5, (err, results) => {
    if (err) console.error('Unable to make a prediction.');
    return results;
  });

const Img = styled.img`
  width: 200px;
  box-shadow: 0px 0px 13px -1px rgba(0, 0, 0, 0.4);
  margin: 16px;
  border-radius: 8px;
`;

const Prediction = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
`;

const ImageWithPredictions = ({ classifier, id, src }) => {
  const imgRef = useRef();
  const [predictions, setPredictions] = useState([]);
  useEffect(() => {
    const generatePredictions = async () => {
      const predictions = await classifyImg(classifier, imgRef.current);
      setPredictions(predictions);
    };
    generatePredictions();
  }, [classifier]);

  return (
    <div>
      <Img key={id} alt={`img - ${id}`} src={src} ref={imgRef} />
      {predictions.map((pred, i) => {
        const { label, confidence } = pred;
        const roundedConfidence = Math.floor(confidence * 10000) / 100 + '%';
        return (
          <Prediction key={i}>
            <span>{label}</span>
            <span>{roundedConfidence}</span>
          </Prediction>
        );
      })}
    </div>
  );
};

export default ImageWithPredictions;
