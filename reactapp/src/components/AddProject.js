import React, { useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';
import { Container, Grid, Form, Segment, Button, Card } from "semantic-ui-react";
import { Redirect } from 'react-router-dom';

import axios from "axios";

async function addProjectToServer(data) {
    let res = await axios.post('/api/add_project', data);
    console.log(res);
}

function AddProject() {
    const [postSuccess, setPostSuccess] = useState(false);

    const { register, handleSubmit } = useForm();
    const onSubmit = (data,e) =>{
        addProjectToServer(data).then(()=> {
            setPostSuccess(true);
            e.target.reset();
        });
    };
    
    return (
        <Container>
            {postSuccess && ( <Redirect to='/projects' /> )}
            <Grid textAlign='center' style={{ height: '80vh' }} verticalAlign='middle'>
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

export default AddProject;