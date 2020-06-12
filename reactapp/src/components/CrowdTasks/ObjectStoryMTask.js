import React, { useEffect, useState, useRef, createRef } from 'react';
import { Container, Button, TextArea, Form, Grid, Input, Header, Label, Divider, Menu} from "semantic-ui-react";

import { useHistory } from "react-router-dom";

import { useForm, useFieldArray } from 'react-hook-form';

import { Stage, Layer, Image, Rect} from 'react-konva';
import MyRectangle from '../AnnotationTool/MyRectangle';
import MyRectTransformer from '../AnnotationTool/MyRectTransformer';
import '../../App.css';

import axios from "axios";
import shortid from 'shortid';



async function addObjectStoryToServer(data) {
  let result = await axios.post(process.env.REACT_APP_API_URL+'/api/add_objectstory', data);
  return result.data
}

async function fetchImageData(imgId) {
  const result = await axios.post(process.env.REACT_APP_API_URL + '/api/get_image_by_id', {
    "image_id": imgId
  });
  return result.data
}
// async function fetchStoryData(imgId) {
//   const result = await axios.post(process.env.REACT_APP_API_URL + '/api/get_stories_by_image_id', {
//     "image_id": imgId
//   });
//   return result.data
// }

function ObjectStoryMtask({ match }) {
  const [imagedata, setImageData] = useState({});
  
  const [loaded, setLoad] = useState(false);
  const [storyloaded, setStoryLoad] = useState(false);
  const [imageloaded, setImageLoad] = useState(false);
  const imgRef = useRef();

  const [storyData, setStoryData] = useState([]);
  const [storyCount, setStoryCount] = useState(0);
  const [postSuccess, setPostSuccess] = useState(false);


  // add bounding boxes on the photo
  const [humanboxes, setHumanBoxes] = useState([]);
  const [boxCount, setBoxCount] = useState(0);
  const boxRefs = useRef([]);
  const [selectedBoxName, setSelectedBoxName] = useState("");
  const [hoverBoxName, setHoverBoxName] = useState("");
  const [mouseDown, setMouseDown] = useState(false);

  const history = useHistory();

  const imageId = match.params.imgid;
  const [worker, setWorker] = useState("");

  const imageW = 800;

  const imageLoad = () => {
    setImageLoad(true);
  }  
  // ----------------- handle story annoation ----------------------
  const { control, register, errors, formState, handleSubmit } = useForm({
    mode: "onBlur",
    defaultValue: {
      story: "",
      object: []
    }
  });
  const { append, remove } = useFieldArray({
    control,
    name: "object"
  });
  

  // add new story to server
  const onSubmit = (data, e) => {
    const object_list = [];
    const imageH = imgRef.current.height*(imageW/imgRef.current.width);
    data.object.map((item, index) => {
      
      object_list.push({
        "label": item.name,
        "x": humanboxes[index].x/imageW,
        "y": humanboxes[index].y/imageH,
        "w": humanboxes[index].width/imageW,
        "h": humanboxes[index].height/imageH
      });
    });
    const results = {
      "created_user": worker,
      "image_id": imageId,
      "story": data.story,
      "object_list": object_list
    }
    addObjectStoryToServer(results).then(() => {
      setPostSuccess(true);
      e.target.reset();
      setHumanBoxes([]);

      if (window.location.hash.split('?')[1]){
        history.push("/mturksuccess?"+window.location.hash.split('?')[1]);
      }
    });
  };

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
    append({ name:  boxKey});
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
    remove(index);
  };

  // ----------------------------------------------------------------
  useEffect(()=> {
    fetchImageData(imageId).then(res => {        
        setImageData(res["data"]);
        setLoad(true);
    });
    
  }, []);
  
  return (
    <div>
    <Menu>
      <Menu.Item>PickaObject</Menu.Item>
    </Menu>
    
    <Container>
        {loaded &&
        <Grid celled>
            <Grid.Row>
            <img style={ {display: "none"} } src={imagedata.image_url} ref={imgRef} onLoad={ () => {imageLoad()}}/>
            <Grid.Column width={12} >
            {imageloaded &&
                <Stage 
                    width={imageW}
                    height={imgRef.current.height*(imageW/imgRef.current.width)}

                    onMouseDown={handleStageMouseDown}
                    onTouchStart={handleStageMouseDown}

                    onMouseUp={mouseDown && handleStageMouseUp}
                    onTouchEnd={mouseDown && handleStageMouseUp}
                >
                    <Layer><Image image={imgRef.current} width={ imageW } height={imgRef.current.height*(imageW/imgRef.current.width)}></Image></Layer>  
                    <Layer>
                      {storyData.map((story, i) => (
                        story.object_list.map((object, j) => (
                          <Rect
                            key={shortid.generate()}
                            x={object.x*imageW} 
                            y={object.y*imgRef.current.height*(imageW/imgRef.current.width)}
                            width={object.w*imageW} 
                            height={object.h*imgRef.current.height*(imageW/imgRef.current.width)}
                            scaleX={1}
                            scaleY={1}
                            stroke={"#ff3333"}
                            strokeWidth={2}
                            />
                        ))
                      ))}
                    </Layer>
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
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Grid.Row>
                <Header as='h4' block>Step 1: Tell a story</Header>
                    <div>Please speculate a possible story or scenario to describe <b>WHO</b> and <b>WHAT activity</b> are they doing.
                    </div>
                    <textarea placeholder='Tell us a story about this image' style={{ marginTop: '6px', minHeight: '50px' }} name="story" ref={register({ required: true })}/>
                    {errors.story && <Label pointing prompt>Story is required</Label>}
                    
                </Grid.Row>
                <Grid.Row style={{ marginTop: '2em'}}>
                    <Header as='h4' block>Step 2: Identify key objects</Header>
                    <div>Please identify <b>key objects</b> that shape your written story.</div>
                    
                    <Button fluid color="blue" onClick={addNewBox} style={{ marginTop: '6px', marginBottom: '6px'}}>Add An Object</Button>
                    
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
                            
                            <div className="ui icon input" style={{width: '100%'}} >
                              <input type="text" placeholder={'object '+(i+1)} name={`object[${i}].name`} ref={register({ required: true })}/>
                              <i aria-hidden="true" className="remove circular inverted link icon" onClick={ ()=>removeObject(i)}></i>
                            </div>
                            
                        </div>
                    ))}
                
                </Grid.Row>

                {humanboxes.length !== 0 &&
                <Grid.Row style={{ marginTop: '5em'}}>
                    {formState.isValid && <Button fluid color="teal" style={{ marginBottom: '6px'}}>Submit this story!</Button> }
                    {!formState.isValid && <Button disabled fluid color="teal" style={{ marginBottom: '6px'}}>Submit this story!</Button> }
                </Grid.Row>
                }
              </Form>
            </Grid.Column>
            </Grid.Row>
        </Grid>
        }
    </Container>
    </div>    
  )
}
export default ObjectStoryMtask;