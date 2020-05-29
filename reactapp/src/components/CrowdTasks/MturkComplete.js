import React from 'react'
import { Form, Button} from "semantic-ui-react";
import queryString from 'query-string';
import axios from "axios";

async function submitToMturkServer(serverURL, data) {
    let result = await axios.post(serverURL, data);
    return result
}

function MturkComplete() {
  const urlparams = window.location.hash.split('?')[1];

  function handleMturkSubmit(e) {
    e.preventDefault();
    const values = queryString.parse(urlparams);
    const data = {
        "assignmentId": values.assignmentId,
        "workerId": values.workerId,
        "hitId": values.hitId
    }

    if("using_sandbox" in values){
        if(values.using_sandbox = "true"){        
            submitToMturkServer("https://workersandbox.mturk.com/mturk/externalSubmit", data);
        }else if(values.using_sandbox = "false"){
            submitToMturkServer("https://www.mturk.com/mturk/externalSubmit", data);
        }
    }

  }  
  return (
    <div>
        <Form onSubmit={handleMturkSubmit}>
            <Button>Complete</Button>
        </Form>     
    </div>
  )
}
export default MturkComplete;