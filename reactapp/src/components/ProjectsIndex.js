import React, { useEffect, useState } from 'react';
import { Container, Card } from "semantic-ui-react";
import axios from "axios";

async function fetchData(){
  const result = await axios.get(process.env.REACT_APP_API_URL+'/api/get_all_projects');
  // const result = await axios.get('/api/get_all_projects');
  return result.data.all_projects 
}

function ProjectsIndex() {
  const [data, setData] = useState([]);

  useEffect(()=> {   
    fetchData().then(setData);
  }, []);
  
  return (
    <Container>
      <Card.Group style={{ marginTop: '2em' }} itemsPerRow={4}>
        {data.map((item, indx) =>
          <Card key={indx} href={"/#/project/"+ item.id} >
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