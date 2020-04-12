import React, { useState, useEffect, useRef, createRef } from 'react';
import { Container, Button } from "semantic-ui-react";

import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';

import { Stage, Layer, Image, Rect, Text, Group } from 'react-konva';
import useImage from 'use-image';

import axios from "axios";

async function getPredictionFromServer(image_url, image_key) {
  let res = await axios.post(process.env.REACT_APP_API_URL+'/api/get_predictions_by_image_url', {
    "image_url": image_url,
    "image_key": image_key
  });
  return res.data
}

async function fetchData(pid) {
  const result = await axios.post(process.env.REACT_APP_API_URL + '/api/get_project_by_id', {
    "project_id": pid
  });
  return result.data
}

const URLImage = ({ url, myRef }) => {
  const [img] = useImage(url);
  return <Image image={img} ref={myRef}/>;
};

function AnnotatePage({ match }) {

  const [data, setData] = useState({});
  const [imagedata, setImageData] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [predloading, setPredLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imgSize, setImgSize] = useState({ w:0, h:0 });

  const refs = useRef([]);

  const projectId = match.params.pid;  

  function makePrediction(image_url, image_key){
    
    setPredLoading(true);
    getPredictionFromServer(image_url, image_key).then(res => {
      if(res["success"]){
        setPredictions(res["data"].predictions);
        setPredLoading(false);
        let imgS = res["data"].image_size;
        setImgSize({
          w: imgS[0],
          h: imgS[1]
        });
 
      }
    });
  }

  function predict(e){
    e.preventDefault();
    makePrediction(imagedata[currentIndex].image_url, imagedata[currentIndex].key);
  }
  function changeImg(e){
    setCurrentIndex(e.item);
    setPredictions([])
  }

  useEffect(() => {
    fetchData(projectId).then(res => {
      setData(res["data"]);
      refs.current = [];
      res["image_data"].map((item, i) => {
        setImageData(imagedata=>[
          ...imagedata,
          {
            id: item.id,
            key: item.key,
            image_url: item.image_url
          }
        ]);
        refs.current[i] = createRef();
      });
      
      setLoaded(true);
      
    });
    
  }, []);
  
  return (
    <Container>
      {loaded && (
        <AliceCarousel onSlideChanged={ changeImg }>
          {imagedata.map( (item, i) => 
            <Stage key={item.key} width={window.innerWidth*0.75} height={window.innerHeight*0.75} >
              <Layer>                
                <URLImage url={item.image_url} myRef={refs.current[i]} width={1024} height={600}/>
              </Layer> 
            </Stage>
          )}
        </AliceCarousel>
      )}
      <Button onClick={predict}>predict</Button>
      <Stage width={imgSize.w} height={imgSize.h}>
      <Layer>
        {predictions.length > 0 &&(
          <Image image={refs.current[currentIndex].current.attrs.image} />
        )}
        {!predloading && predictions.map((box, idx) => 
          <Group key={idx}>
            <Rect  x={box.box[1]*imgSize.w} y={box.box[0]*imgSize.h} width={(box.box[3]-box.box[1])*imgSize.w} height={ (box.box[2]-box.box[0])*imgSize.h} stroke={'#33d6ff'} strokeWidth={2} />
            <Text x={box.box[1]*imgSize.w} y={box.box[0]*imgSize.h} fill={'#ccf5ff'} fontSize={20} text={box.label} />
          </Group>  
        )}  
      </Layer>    
      </Stage>
      
    </Container>
  )
}
export default AnnotatePage;