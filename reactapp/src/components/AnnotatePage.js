import React, { useState, useEffect } from 'react';
import { Container } from "semantic-ui-react";

import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';

import axios from "axios";

async function fetchData(pid) {
  const result = await axios.post(process.env.REACT_APP_API_URL + '/api/get_project_by_id', {
    "project_id": pid
  });
  return result.data
}

function AnnotatePage({ match }) {

  const [data, setData] = useState({});
  const [imagedata, setImageData] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const projectId = match.params.pid;

  const handleOnDragStart = (e) => e.preventDefault();

  useEffect(() => {
    fetchData(projectId).then(res => {
      setData(res["data"]);
      setImageData(res["image_data"]);
      setLoaded(true);
    });
    console.log("fetch");
  }, []);


  return (
    <Container>
      {loaded && (
        <AliceCarousel mouseTrackingEnabled>
          {imagedata.map((item, idx) => 
              <img key={item.key} src={item.image_url} />
          )}
        </AliceCarousel>
      )}
    </Container>
  )
}
export default AnnotatePage;