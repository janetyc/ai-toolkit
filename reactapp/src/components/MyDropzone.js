import React, { useCallback, useState, Fragment } from 'react';
import { Icon } from "semantic-ui-react";
import { useDropzone } from 'react-dropzone';

const previewStyle = {
  display: 'inline',
  width: 100,
  height: 100,
};

function MyDropzone() {
  const [images, setImages] = useState([]);

  const onPreviewDrop = useCallback(acceptedFiles => {
    // Do something with the files
    console.log("upload");

  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onPreviewDrop })

  return (
    <div className="ui center aligned tertiary blue inverted segment" {...getRootProps()}>
      <input {...getInputProps()} />
      <Icon name="cloud upload" size="big" />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop some files here, or click to select files</p>
      }
      
    </div>
  )
}

export default MyDropzone;
