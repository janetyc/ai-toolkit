import React, { useState } from 'react';

import DropZone from './DropZone';
import { Button } from "semantic-ui-react";
import axios from "axios";

const previewStyle = {
  display: 'inline',
  width: 100,
  height: 100,
  padding: '3px'
};
const config = { headers: { 'Content-Type': 'multipart/form-data' } };

async function addImagesToServer(imagedata) {
  let res = await axios.post('/api/add_images', imagedata);
  // let res = await axios.post('http://127.0.0.1:5000/api/add_images', imagedata);
  return res.data
}

function Home() {
  const [images, setImages] = useState([]);
  const [postSuccess, setPostSuccess] = useState(false);

  
  function uploadImages(){
    var fdata = new FormData();
    var data = {}
    images.map(item => {
      data[item.id] = item.src
    });
    addImagesToServer(data).then(response => {
      if(response["success"]){
        console.log(response["data"]["images"])
        setImages([]);
      }
    });
  };

  return (
    <div>
      <DropZone setImages={setImages} />
      <div>
      {images.map(image => (
        <img
            key={image.id}
            src={image.src}
            style={previewStyle}
        />
      ))}
      </div>
      {images.length > 0 && <Button color='teal' fluid size='small' onClick={uploadImages}>Submit</Button> } 

    </div>
  )
}
export default Home;