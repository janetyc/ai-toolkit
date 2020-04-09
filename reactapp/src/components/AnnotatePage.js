import React, { useState, useEffect } from 'react';
import { Container } from "semantic-ui-react";

import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';

import axios from "axios";

async function getPredictionFromServer(image_url) {
  let res = await axios.post(process.env.REACT_APP_API_URL+'/api/get_predictions_by_image_url', {
    "image_url": image_url
  });
  return res.data
}


async function fetchData(pid) {
  const result = await axios.post(process.env.REACT_APP_API_URL + '/api/get_project_by_id', {
    "project_id": pid
  });
  return result.data
}


function AnnotatePage({ match }) {

  const [data, setData] = useState({});
  const [imagedata, setImageData] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const projectId = match.params.pid;

  function makePrediction(image){
    getPredictionFromServer(image.src).then(res => {
      if(res["success"]){
        setPredictions(res["data"].predictions);
      }
    });
  }
  function predict(e){
    e.preventDefault();
    console.log(e.currentTarget.width);
    console.log(e.currentTarget.height);
    makePrediction(e.currentTarget);
  }

  useEffect(() => {
    fetchData(projectId).then(res => {
      setData(res["data"]);
      
      res["image_data"].map((item) => {
        setImageData(imagedata=>[
          ...imagedata,
          {
            id: item.id,
            key: item.key,
            image_url: item.image_url
          }
        ]); 
      });
      setLoaded(true);
    });
    
  }, []);

  return (
    <Container>
      {predictions.map((box, idx) => 
        <div key={idx}>{box.label} ({box.score})</div> 
      )}
      {loaded && (
        <AliceCarousel>
          {imagedata.map(item => 
            <div key={item.key}>
              <img key={item.key} src={item.image_url} onClick={predict} crossOrigin="anonymous"/>
              
            </div>
          )}
        </AliceCarousel>
      )}
    </Container>
  )
}
export default AnnotatePage;