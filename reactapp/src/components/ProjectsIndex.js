import React, { useEffect, useState } from 'react';

import { Container, Grid, Form, Segment, Button, Card } from "semantic-ui-react";

import axios from "axios";

// var config = {
//     headers: {'Access-Control-Allow-Origin': '*'}
// };

async function fetchData(){
    // const result = await axios.get('http://127.0.0.1:5000/api/get_all_projects', config);
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
            <Card.Group style={{ marginTop: '5em', height: '70vh' }} itemsPerRow={4}>
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