import React, { useState, useEffect } from 'react';
import axios from 'axios';

const startNodeAPI = "http://api.conceptnet.io/query?start=/c/en/%s&rel=/r/UsedFor&limit=20";
const endNodeAPI = "http://api.conceptnet.io/query?end=/c/en/%s&rel=/r/UsedFor&limit=20";

const noConcepts = {
  background: "#FFF"
};
const haveConcepts = {
  background: "#FF9999",
  padding: "1px"
};

const ConceptNetAPI = ( {currentNode, confidence} ) => {
  const [loaded, setLoaded] = useState(false);
  const [concepts, setConcepts] = useState([]);
  const [toggle, setToggle] = useState(false);
  

  // 相似於 componentDidMount 和 componentDidUpdate:
  useEffect(() => {
    const getConcepts = async () => {
      //get data from api
      let res = await axios.get(startNodeAPI.replace("%s", currentNode));
      console.log(res);
      setConcepts(res.data.edges);  
      setLoaded(true);
      
    };
    getConcepts();

  }, [currentNode]);
  

  function onClickEvent(e) {
    e.preventDefault();
    console.log(currentNode);
    console.log(toggle);
    setToggle(!toggle);
  }

  return (
    <React.Fragment>
    <div>
      <span style={concepts.length ? (haveConcepts) : (noConcepts) } onClick={onClickEvent}>{currentNode}</span>
      <span> ({confidence})</span>
      {loaded ? (
      (toggle &&
        concepts.map( (concept, index)  => (
          <div key={index}>
            <span>{concept.surfaceText}</span>
          </div>
        )
      ) )
      ) : (
      <p>Loading...</p>
      )}
    </div>
    </React.Fragment>
  );
}

export default ConceptNetAPI;