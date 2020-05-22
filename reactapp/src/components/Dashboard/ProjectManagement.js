import React, { useEffect, useState } from 'react';
import { Container, Item, Button, Card, Image} from "semantic-ui-react";
import { Link } from 'react-router-dom';
import axios from "axios";

async function fetchProjectData(pid) {
  const result = await axios.post(process.env.REACT_APP_API_URL + '/api/get_project_by_id', {
    "project_id": pid.toString()
  });
  return result.data
}

async function fetchData(){
  const result = await axios.get(process.env.REACT_APP_API_URL+'/api/get_all_projects');
  // const result = await axios.get('/api/get_all_projects');
  return result.data.all_projects 
}
async function deleteImage(image_id){
}
async function deleteProject(project_id){
}

function ProjectManagement() {
  const [data, setData] = useState([]);

  const getProjectData = (indx, pid) => {
    console.log("fetch "+indx);
    console.log(data[indx]);
    if("image_data" in data[indx]){
        console.log("fetch already!!!");
    }else{
        console.log("fetch data from project "+ pid);
        fetchProjectData(pid).then(res=>{
          data[indx] = {
              ...data[indx],
              "image_data": res["image_data"]
          }
          setData(data => [...data]); 

        });
    }
    
    //how to update state??????
    console.log(indx);
    console.log(data);
    
  }


  useEffect(()=> {   
    fetchData().then(res =>{
        res.map(item => {
            setData(data => [
              ...data,
              {
                "data": item,
              }
            ]);
        });
    });
  }, []);
  
  return (
    <Container>
      <Item.Group divided>
        {data.map((item, indx) =>
          <Item key={indx}>
            <Item.Content>
              <Item.Header>{item["data"].title}</Item.Header>
              <Item.Description>{item["data"].description}</Item.Description>
              <Item.Extra>
                  <Button onClick={ () => getProjectData(indx, item["data"].id) }>See Details {item.id}</Button>
              </Item.Extra>
              <Item.Extra>
              <Card.Group itemsPerRow={5}>
                  {("image_data" in item) && item["image_data"].map((img, img_indx)=>(
                    <Card key={img.key}>
                      <Card.Content>
                        <Image src={img.image_url} />
                      </Card.Content>
                      <Button attached='bottom'>Delete</Button>
                    </Card>
                  ))}
                </Card.Group>
              </Item.Extra>
            </Item.Content>
            
          </Item>
        )}
      </Item.Group>    
    </Container>
  )
}
export default ProjectManagement;