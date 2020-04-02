import React, { Container, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import cuid from 'cuid'; //utility for construting unique IDs

// import styled from '@emotion/styled';

// const Container = styled.div`
//   display: flex;
//   width: 80%;
//   height: 400px;
//   margin: 20px auto 0 auto;
//   background: lightgray;
//   border: 4px dotted darkgray;
//   justify-content: center;
//   align-items: center;
//   cursor: pointer;
// `;

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
    <div className="ui center aligned tertiary blue inverted segment" {...getRootProps()}>
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
