import React, { useRef, useState, useEffect } from 'react';
import styled from '@emotion/styled';

import Konva from 'konva';
import { Stage, Layer, Image, Rect, Text, Circle } from 'react-konva';


const detectImg = (detector, image) =>
  detector.detect(image, (err, results) => {
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

const ImageWithPredictions = ({ detector, id, src }) => {
  const imgRef = useRef();
  const [predictions, setPredictions] = useState([]);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const generatePredictions = async () => {
      const predictions = await detectImg(detector, imgRef.current);
      console.log(predictions);

      setWidth(imgRef.current.width);
      setHeight(imgRef.current.height);
      setPredictions(predictions);
    };
    generatePredictions();
  }, [detector]); // pass the second augment to useEffect

  return (
    <div>
      <Stage width={width} height={height}>
        <Layer>
          <Image image={imgRef.current} />
          {predictions.map((pred, i) => {
            const { label, confidence, x, y, w, h } = pred;
            return (
              <Rect key={i} x={x * width} y={y * height} width={w * width} height={h * height} stroke={'red'} strokeWidth={1} />
            );
          })}
        </Layer>
      </Stage>
      <Img key={id} alt={`img - ${id}`} src={src} ref={imgRef} />
      {predictions.map((pred, i) => {
        const { label, confidence, x, y, w, h } = pred;
        const roundedConfidence = Math.floor(confidence * 10000) / 100 + '%';
        return (
          <Prediction key={i}>
            <div>{label.split(',').map((item, indx) =>
              <div key={indx}>{item} ({roundedConfidence})</div>
            )}</div>
          </Prediction>
        );
      })}
    </div>
  );
};

export default ImageWithPredictions;
