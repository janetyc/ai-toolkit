import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import cuid from 'cuid'; //utility for construting unique IDs
import { Icon } from "semantic-ui-react";

//https://github.com/react-dropzone/react-dropzone
const DropZone = ({ setImages }) => {
  
  const onDrop = useCallback(acceptedFiles => {
    acceptedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = function (e) {
        //setImages here
        console.log("upload image");
        setImages(currentImages => [
          ...currentImages, //Spred syntax
          { id: cuid(), src: e.target.result } //what is cuid()?
        ]);
      };
      reader.readAsDataURL(file);
      
    });
  }, [setImages]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop }); //customized Hooks
  return (
    <div className="ui center aligned secondary segment" {...getRootProps()}>
      <Icon name="cloud upload" size="big" />
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
    </div>
  );
};

export default DropZone;
