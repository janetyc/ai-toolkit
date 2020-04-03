import React, { useState } from 'react';

import DropZone from './DropZone';
import { Button, Dimmer, Loader } from "semantic-ui-react";
import axios from "axios";

const previewStyle = {
  display: 'inline',
  width: 100,
  height: 100,
  padding: '3px'
};


async function addImagesToServer(imagedata) {
  let res = await axios.post(process.env.REACT_APP_API_URL+'/api/add_images', imagedata);
  // let res = await axios.post('/api/add_images', imagedata);
  return res.data
}

function Uploader( {statusCallback, projectId} ) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  function uploadImages(){
    setLoading(true);

    var data = {}
    images.map(item => {
      data[item.id] = item.src
    });
    var imagedata = {
      "project_id": projectId,
      "data":  data
    }
    addImagesToServer(imagedata).then(response => {
      if(response["success"]){
        setLoading(false);
        setImages([]);
        statusCallback(true);
      }
    });
  };

  return (
    <div>
      {loading && (
        <Dimmer active inverted>
          <Loader size='medium'>Uploading</Loader>
        </Dimmer>
      ) }
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
export default Uploader;