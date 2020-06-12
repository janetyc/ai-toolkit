import React from 'react'
import { Form, Button} from "semantic-ui-react";
import queryString from 'query-string';
import { Link } from 'react-router-dom';

function MturkComplete() {
  const urlparams = window.location.hash.split('?')[1];
  const values = queryString.parse(urlparams);

  return (
    <div style={{textAlign: "center", marginTop: "50px"}}>
        {"using_sandbox" in values && values.using_sandbox == "true" && (
            <form action="https://workersandbox.mturk.com/mturk/externalSubmit" method="post">
                <input type="hidden" id="assignmentId" name="assignmentId" value={values.assignmentId}/>
                <input type="hidden" id="hitId" name="hitId" value={values.hitId} />
                <input type="hidden" id="workerId" name="workerId" value={values.workerId}/>
                <Button>Complete HIT</Button>
            </form>     
        )}
        {"using_sandbox" in values && values.using_sandbox == "false" && (
            <form action="https://www.mturk.com/mturk/externalSubmit" method="post">
                <input type="hidden" id="assignmentId" name="assignmentId" value={values.assignmentId} />
                <input type="hidden" id="hitId" name="hitId" value={values.hitId} />
                <input type="hidden" id="workerId" name="workerId" value={values.workerId} />
                <Button>Complete HIT</Button>
            </form>       
        )}
        {!("workerId" in values) && !("assignmentId" in values) && (
            <Button basic color="grey" as={Link} to={"/"}>Back to Home</Button>
        )}
    </div>
  )
}
export default MturkComplete;