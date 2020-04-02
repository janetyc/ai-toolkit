import React, { useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';
import { Container, Grid, Form, Segment, Button, Card } from "semantic-ui-react";

import axios from "axios";

// var config = {
//     headers: {'Access-Control-Allow-Origin': '*'}
// };

async function addProject(data) {
  let res = await axios.post('/api/add_project', data);
  console.log(res);
}
async function fetchData(){
  // const result = await axios.get('/api/get_all_projects', config);
  const result = await axios.get('/api/get_all_projects';
  console.log(result.data.all_projects);
  return result.data.all_projects
    
}

function Project() {
  const { register, handleSubmit } = useForm();
  const onSubmit = (data,e) =>{
    console.log(data);
    addProject(data).then(()=> {
      fetchData().then(setData);
      e.target.reset();
    });
  };

  const [data, setData] = useState([])
  // useEffect(()=> {
  //     const fetchData = async () => {
  //         const result = await axios.get('http://127.0.0.1:5000/api/get_all_projects', config);
  //         console.log(result.data.all_projects);
  //         setData(result.data.all_projects);
  //     };    
  //     fetchData();
  // }, []);

  useEffect(()=> {   
    fetchData().then(setData);
  }, []);
  
  return (
    // height: '100vh' --> height of this element is equal to 100% of the viewport height. 
    <Container> 
      <Card.Group style={{ marginTop: '5em', height: '50vh' }} itemsPerRow={4}>
        {data.map((item, indx) => 
          <Card key={indx}>
            <Card.Content>
              <Card.Header>Project: {item.title}</Card.Header>
              <Card.Description>{item.description}</Card.Description>
            </Card.Content>
          </Card>
        )}
      </Card.Group>
      <Grid textAlign='center' style={{ height: '50vh' }} verticalAlign='middle'>
        <Grid.Column style={{ maxWidth: 450 }}>
          <Form size='large' onSubmit={ handleSubmit(onSubmit) }>
            <Segment stacked>
              <Form.Field>
                <input type="hidden" name="created_user" value="web_user" ref={register} />
                <input placeholder='Project title' name="title" ref={register} />
              </Form.Field>
              <Form.Field>
                <input placeholder='Description' name="description" ref={register} />
              </Form.Field>
              
              <Button color='teal' fluid size='large'>Add Project</Button>
            </Segment>
          </Form>
        </Grid.Column>
      </Grid> 
        
    </Container>
  );
}

export default Project;