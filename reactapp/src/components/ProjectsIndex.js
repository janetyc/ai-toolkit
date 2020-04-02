import React, { useEffect, useState } from 'react';
import { Container, Card } from "semantic-ui-react";
import axios from "axios";

async function fetchData(){
  // const result = await axios.get('http://127.0.0.1:5000/api/get_all_projects');
  const result = await axios.get('/api/get_all_projects');
  console.log(result.data.all_projects);
  return result.data.all_projects 
}

function ProjectsIndex() {
  const [data, setData] = useState([])

  useEffect(()=> {   
    fetchData().then(setData);
  }, []);
  
  return (
    <Container> 
      <Card.Group style={{ marginTop: '5em' }} itemsPerRow={4}>
        {data.map((item, indx) => 
          <Card key={indx}>
            <Card.Content>
              <Card.Header>Project: {item.title}</Card.Header>
              <Card.Description>{item.description}</Card.Description>
            </Card.Content>
          </Card>
        )}
      </Card.Group>    
    </Container>
  );
}

export default ProjectsIndex;