import React, { useState, useEffect, useRef, createRef } from 'react';
import { Container, Button, Menu } from "semantic-ui-react";

import { Stage, Layer, Image, Text, Group } from 'react-konva';
import MyRect from './MyRect';
import MyRectangle from './AnnotationTool/MyRectangle';
import MyRectTransformer from './AnnotationTool/MyRectTransformer';
import shortid from 'shortid';
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
  const [loadCount, setLoadCount] = useState(0);

  const [humanboxes, setHumanBoxes] = useState([]);
  const [boxCount, setBoxCount] = useState(0);
  const boxRefs = useRef([]);
  const [selectedBoxName, setSelectedBoxName] = useState("")
  const [mouseDown, setMouseDown] = useState(false);

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

  //------------------- handle human annotation ----------------------
  function addNewBox(e){
    e.preventDefault();
    //add new bounding box
    boxRefs.current[boxCount] = createRef();
    setHumanBoxes(humanboxes => [
      ...humanboxes,
      {
          x: 10,
          y: 10,
          width: 100,
          height: 100,
          name: `rect${boxCount + 1}`,
          stroke: '#cc0000',
          key: shortid.generate(),
          ref: boxRefs.current[boxCount].current
      }
    ]);

    setBoxCount(boxCount + 1);
  }
  const handleRectChange = (index, newProps) => {
    humanboxes[index] = {
      ...humanboxes[index],
      ...newProps,
    };    
    setHumanBoxes(humanboxes => [...humanboxes]);
  };
  // ---------------------------------------------------
  const changeImg = (i) => {
    setCurrentIndex(i);
    setPredictions([]);
    setHumanBoxes([]);
  }

  const imageLoad = (i) => {
    setLoadCount(loadCount+1); 
  }

  const handleStageMouseDown = (event) => {
    
    // clicked on stage - clear selection or ready to generate new rectangle
    if (event.target.getType() === 'Stage') {
      // const stage = event.target.getStage();
      setMouseDown(true);
      setSelectedBoxName("");
      return;
    }

    // clicked on transformer - do nothing
    const clickedOnTransformer = event.target.getParent().className === 'Transformer';
    if (clickedOnTransformer) {
      return;
    }

    // find clicked rect by its name
    const name = event.target.name();
    
    const rect = humanboxes.find(r => r.name === name);
    if (rect) {
      setSelectedBoxName(name);
    } else {
      setSelectedBoxName("");
    }
  }; 
  const handleStageMouseUp = () => {
    setMouseDown(false);
  };

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
    <div>
    <Menu>
      <Menu.Item>PickaObject</Menu.Item>
    </Menu>
    <Container>
      <div>
        {loaded && imagedata.map( (item, i) => 
          <img key={i} style={ {display: "none"} } src={item.image_url} ref={refs.current[i]} onLoad={ () => {imageLoad(i)}}/>
        )}
      </div>
      
      <div>
        {loaded && imagedata.map( (item, i) => 
          <Button key={i} circular size="tiny" onClick={ ()=> changeImg(i) } content={i} />  
        )}
      </div>  

      {loaded && loadCount == imagedata.length && (
        <div>
          <div style={ {float: "left", display: "block"} }>
            <Stage 
              style={ {float: "left"} } 
              width={refs.current[currentIndex].current.width} 
              height={refs.current[currentIndex].current.height}
              onMouseDown={handleStageMouseDown}
              onTouchStart={handleStageMouseDown}

              onMouseUp={mouseDown && handleStageMouseUp}
              onTouchEnd={mouseDown && handleStageMouseUp}
            >
            <Layer><Image image={refs.current[currentIndex].current}/></Layer>
            <Layer>
            {!predloading && predictions.map((box, idx) => 
              <Group key={idx}>
                {/* <Rect x={box.box[1]*imgSize.w} y={box.box[0]*imgSize.h} width={(box.box[3]-box.box[1])*imgSize.w} height={ (box.box[2]-box.box[0])*imgSize.h} stroke={'#33d6ff'} strokeWidth={2} /> */}
                <MyRect x={box.box[1]*imgSize.w} y={box.box[0]*imgSize.h} width={(box.box[3]-box.box[1])*imgSize.w} height={ (box.box[2]-box.box[0])*imgSize.h} stroke={'#33d6ff'} strokeWidth={2} name={box.label+'-'+idx}/>
                <Text x={box.box[1]*imgSize.w} y={box.box[0]*imgSize.h} fill={'#ccf5ff'} fontSize={20} text={box.label} />
              </Group>  
            )}
            </Layer>
            <Layer>
              {humanboxes.map((rect, i) => (
                <MyRectangle
                  ref={boxRefs.current[i].current}
                  sclassName="rect"
                  key={rect.key}
                  {...rect}
                  
                  onTransform={(newProps) => {
                    handleRectChange(i, newProps);
                  }}
                />
              ))}
              <MyRectTransformer selectedShapeName={selectedBoxName} />
            </Layer>
            </Stage>
          </div>
          
          <div style={ {float: "left", marginLeft: "10px",  display: "block" } }>
          <Button onClick={predict}>Predict</Button>
          {!predloading && predictions.map((box, idx) => 
              <div key={idx}>{box.label}</div>
            )}
          </div>
          <div style={ {float: "left", marginLeft: "10px",  display: "block"} }>
            <Button onClick={addNewBox}>Add</Button>
          </div>
        </div>  
      )}
      
    </Container>
    </div>
  )
}
export default AnnotatePage;