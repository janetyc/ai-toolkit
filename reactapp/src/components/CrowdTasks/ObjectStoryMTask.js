import React, { useEffect, useState, useRef, createRef } from 'react';
import { Container, Button, TextArea, Form, Grid, Input, Header} from "semantic-ui-react";


import { Stage, Layer, Image} from 'react-konva';
import MyRectangle from '../AnnotationTool/MyRectangle';
import MyRectTransformer from '../AnnotationTool/MyRectTransformer';
import '../../App.css';

import axios from "axios";
import shortid from 'shortid';


async function fetchImageData(imgId) {
    const result = await axios.post(process.env.REACT_APP_API_URL + '/api/get_image_by_id', {
        "image_id": imgId
    });
    return result.data
}

function ObjectStoryMtask({ match }) {

  const [imagedata, setImageData] = useState({});
  
  const [loaded, setLoad] = useState(false);
  const [imageloaded, setImageLoad] = useState(false);
  const imgRef = useRef();

  const [stories, setStories] = useState([]);
  const [storyCount, setStoryCount] = useState(0);
  
  // add bounding boxes on the photo
  const [humanboxes, setHumanBoxes] = useState([]);
  const [boxCount, setBoxCount] = useState(0);
  const boxRefs = useRef([]);
  const [selectedBoxName, setSelectedBoxName] = useState("");
  const [hoverBoxName, setHoverBoxName] = useState("");
  const [mouseDown, setMouseDown] = useState(false);


  const imageId = match.params.imgid;


  const imageLoad = () => {
    setImageLoad(true);
  }  
  
  //------------------- handle human annotation ----------------------
  function addNewBox(e){
    e.preventDefault();
    //add new bounding box
    boxRefs.current[boxCount] = createRef();
    let boxKey = shortid.generate()
    setHumanBoxes(humanboxes => [
      ...humanboxes,
      {
          x: 10,
          y: 10,
          width: 100,
          height: 100,
          key: boxKey,
          name: `rect${boxKey}`,
          stroke: '#2982F9',
          
          lable: 'none'
      }
    ]);

    setBoxCount(boxCount + 1);
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

  const handleRectChange = (index, newProps) => {
    humanboxes[index] = {
      ...humanboxes[index],
      ...newProps,
    };
    
    setHumanBoxes(humanboxes => [...humanboxes]);
  };

  const handleLabelMouseEnter = (index, rect) => {
    rect.stroke = "#8AE1FF";
    humanboxes[index] = {
        ...humanboxes[index],
        ...rect,
      };
    
    setHumanBoxes(humanboxes => [...humanboxes]);
    
    setHoverBoxName(rect.name);
  };

  const handleLabelMouseLeave = (index, rect) => {
    rect.stroke = "#2982F9";
    humanboxes[index] = {
        ...humanboxes[index],
        ...rect,
      };    
    setHumanBoxes(humanboxes => [...humanboxes]);
    setHoverBoxName("");
  };
  const removeObject = (index) => {
    
    humanboxes.splice(index, 1);
    setHumanBoxes(humanboxes => [...humanboxes]);
    setBoxCount(boxCount - 1);
  };

  // ----------------------------------------------------------------
  useEffect(()=> {
    fetchImageData(imageId).then(res => {        
        setImageData(res["data"]);
        setLoad(true);
    });
    console.log("fetch image url");

  }, []);
  
  return (
    <Container>
        
        {loaded &&
        <Grid celled>
            <img style={ {display: "none"} } src={imagedata.image_url} ref={imgRef} onLoad={ () => {imageLoad()}}/>
            <Grid.Column width={12} >
            {imageloaded &&
                <Stage 
                    width={800}
                    height={imgRef.current.height*(800/imgRef.current.width)}

                    onMouseDown={handleStageMouseDown}
                    onTouchStart={handleStageMouseDown}

                    onMouseUp={mouseDown && handleStageMouseUp}
                    onTouchEnd={mouseDown && handleStageMouseUp}
                >
                    <Layer><Image image={imgRef.current} width={ 800 } height={imgRef.current.height*(800/imgRef.current.width)}></Image></Layer>  
                    <Layer>
                        {humanboxes.map((rect, i) => (
                            <MyRectangle
                            // ref={boxRefs.current[i]}
                            sclassName="rect"
                            key={rect.key}
                            {...rect}
                            
                            onTransform={(newProps) => {
                                handleRectChange(i, newProps);
                            }}

                            //hover event
                            onEnter={(newProps) => {
                                setHoverBoxName(newProps);
                            }}
                            onLeave={(newProps) => {
                                setHoverBoxName("");
                            }}

                            />
                        ))}
                        <MyRectTransformer selectedShapeName={selectedBoxName} />
                    </Layer>
                </Stage>

            }
            </Grid.Column> 
            <Grid.Column width={4}>
                <Grid.Row>
                <Header as='h5' block>Step 1: Tell a story</Header>
                <Form>
                    <TextArea placeholder='Tell us a story about this image' style={{ minHeight: 100 }} />
                </Form>
                </Grid.Row>
                <Grid.Row style={{ marginTop: '2em'}}>
                    <Header as='h5' block>Step 2: Identify key objects to define your story</Header>
                    
                    <Button fluid color="primary" onClick={addNewBox} style={{ marginBottom: '6px'}}>Add An Object</Button>
                    {humanboxes.map((rect, i) => (
                        <div key={rect.key} 
                             style={{ marginBottom: '2px'}} 
                             className={`${hoverBoxName == rect.name ? "hoveredBox" : ""}`}
                             onMouseEnter={()=> {
                                handleLabelMouseEnter(i, rect);
                             }} 
                             onMouseLeave={()=> {
                                handleLabelMouseLeave(i, rect);
                             }} >

                            <Input placeholder={'object '+(i+1)} style={{width: '100%'}} 
                             action={{ icon: 'remove', onClick: () => { removeObject(i) } }}  
                            />
                            
                        </div>
                    ))}    
                </Grid.Row>
                
            </Grid.Column>
            
        </Grid>
        }

    </Container>    
  )
}
export default ObjectStoryMtask;