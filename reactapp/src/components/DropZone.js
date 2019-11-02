import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import cuid from 'cuid';
import styled from '@emotion/styled';

const Container = styled.div`
  display: flex;
  width: 80%;
  height: 400px;
  margin: 100px auto 0 auto;
  background: lightgray;
  border: 4px dotted darkgray;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const DropZone = ({ setImages }) => {
  const onDrop = useCallback(
    acceptedFiles => {
      acceptedFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
          setImages(currentImages => [
            ...currentImages,
            { id: cuid(), src: e.target.result }
          ]);
        };
        reader.readAsDataURL(file);
      });
    },
    [setImages]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  return (
    <Container {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag 'n' drop some files here, or click to select files</p>
      )}
    </Container>
  );
};

export default DropZone;
