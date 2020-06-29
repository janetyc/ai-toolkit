import React, { useEffect, useState, useRef, createRef } from 'react';
import { Container, Button, Grid, Label, Divider, Menu} from "semantic-ui-react";

import { useForm, useFieldArray } from 'react-hook-form';


import { Stage, Layer, Image, Rect, Text, Group} from 'react-konva';
import '../App.css';

import axios from "axios";
import shortid from 'shortid';

async function fetchImageData(imgId) {
  const result = await axios.post(process.env.REACT_APP_API_URL + '/api/get_image_by_id', {
    "image_id": imgId
  });
  return result.data
}
async function fetchStoryData(imgId) {
  const result = await axios.post(process.env.REACT_APP_API_URL + '/api/get_stories_by_image_id', {
    "image_id": imgId
  });
  return result.data
}

function ObjectStoryView({ match }) {
  const [imagedata, setImageData] = useState({});
  
  const [loaded, setLoad] = useState(false);
  const [storyloaded, setStoryLoad] = useState(false);
  const [imageloaded, setImageLoad] = useState(false);
  const imgRef = useRef();

  const [storyData, setStoryData] = useState([]);
  const [currentStory, setCurrentStory] = useState(-1);
  const [objectData, setObjectData] = useState([]);

  const imageId = match.params.imgid;

  const imageW = 800;

  const imageLoad = () => {
    setImageLoad(true);
  }  
  const handleLabelMouseEnter = (index) => {
    setCurrentStory(index);
  };
  const handleLabelMouseLeave = (index) => {
    setCurrentStory(-1);
  };
  // ----------------------------------------------------------------
  useEffect(()=> {
    fetchImageData(imageId).then(res => {        
        setImageData(res["data"]);
        setLoad(true);
    });
    
  }, []);

  useEffect(()=> {
    
    fetchStoryData(imageId).then(res => {
        setStoryData(res["data"]);
        
        res["data"].map((story => {
            console.log(story.story)
            setObjectData(objectData => [
                ...objectData, 
                ...story.object_list
            ]);
        }));
        
        setStoryLoad(true);
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
                    >
                        <Layer><Image image={imgRef.current} width={ imageW } height={imgRef.current.height*(imageW/imgRef.current.width)}></Image></Layer>  
                        <Layer>
                        {storyData.map((story, i) => (
                            story.object_list.map((object, j) => (
                            <Group key={shortid.generate()}>
                            <Rect
                                x={object.x*imageW} 
                                y={object.y*imgRef.current.height*(imageW/imgRef.current.width)}
                                width={object.w*imageW} 
                                height={object.h*imgRef.current.height*(imageW/imgRef.current.width)}
                                scaleX={1}
                                scaleY={1}
                                stroke={(currentStory == i) ? '#ff4d4d' : '#ffcccc'}
                                strokeWidth={2}
                                />
                            <Text 
                                text={object.label}
                                fill={(currentStory == i) ? '#ff4d4d' : '#ffcccc'}
                                x={object.x*imageW} 
                                y={object.y*imgRef.current.height*(imageW/imgRef.current.width)}
                            /> 
                            </Group>
                            ))
                        ))}
                        </Layer>
                    </Stage>
                }
                </Grid.Column>
                <Grid.Column width={4}>
                    <div>Total story: {storyData.length}</div>
                    <div>Total object: {objectData.length}</div>
                    {objectData.map((object, i) => (
                        <Label key={"o-"+i} size="tiny" >{object.label}</Label>
                    ))}
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={16}>
              {storyData.map((story, i) => (
                  <Grid.Row key={"story-"+i} >
                    <div 
                        onMouseEnter={()=> {
                            handleLabelMouseEnter(i);
                        }} 
                        onMouseLeave={()=> {
                            handleLabelMouseLeave(i);}}
                    >
                        Story {i+1} ({story.created_user}): {story.story}
                        {story.object_list.map((object, j) => (
                        <Label style={{ marginLeft: '3px'}} key={"obj-"+i+"-"+j} color={"grey"} size="small" >{object.label}</Label>
                        ))}
                        <Divider />
                    </div>
                    </Grid.Row>
                  ))}
              </Grid.Column>
            </Grid.Row>
        </Grid>
        }
    </Container>
    </div>    
  )
}
export default ObjectStoryView;