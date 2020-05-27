import React, { useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { Container, Header, Button, Menu} from "semantic-ui-react";
import axios from "axios";

import Uploader from './Uploader'
import ImageDataset from './ImageDataset';


async function fetchData(pid) {
  const result = await axios.post(process.env.REACT_APP_API_URL + '/api/get_project_by_id', {
    "project_id": pid
  });
  return result.data
}

function Project({ match }) {

  const [data, setData] = useState({});
  const [imagedata, setImageData] = useState([]);

  const projectId = match.params.pid;


  const handleStatusChange = (status) => {
    fetchData(projectId).then(res => {
      setData(res["data"])
      setImageData(res["image_data"])
    });
    console.log("upload fetch");
  };

  useEffect(() => {
    fetchData(projectId).then(res => {
      setData(res["data"])
      setImageData(res["image_data"])
    });
    console.log("fetch");
  }, []);

  return (
    <div>
    <Menu>
        <Menu.Item><Link to="/dashboard">Home</Link></Menu.Item>
        <Menu.Item position='right'><Button color="teal" as={Link} to="/addProject">Add Project</Button></Menu.Item>
    </Menu>
    <Container>
      <div style={{ marginTop: '2em' }}>
        <Header as='h2'>Project: {data.title} 
          {imagedata.length !== 0 && 
            <Button style={ {marginLeft: "7px"} }  color="teal" as={Link} to={"/annotate/" + projectId}>Start to Annotate</Button>
          }
        </Header>
        <p>{data.description}</p>
      </div>
      
      <div style={{ marginTop: '2em' }}>
        <Uploader statusCallback={handleStatusChange} projectId={projectId} />
      </div>
      <div style={{ marginTop: '3em' }}>
        <ImageDataset imageList={imagedata} /> 
      </div>
    </Container>
    </div>
  );
}

export default Project;