import React from 'react';
import { 
    HashRouter as Router,
    Switch,
    Link,
    Route
} from 'react-router-dom';
import { Menu, Button } from 'semantic-ui-react'
import { createBrowserHistory } from "history";

import './index.css';
import ProjectsIndex from './components/ProjectsIndex';
import Project from './components/Project';
import AddProject from './components/AddProject';
import AnnotatePage from './components/AnnotatePage';
import ObjectStoryMtask from './components/CrowdTasks/ObjectStoryMTask';

const customHistory = createBrowserHistory();

export default (
    <Router history={customHistory}>
        <Menu>
          <Menu.Item><Link to="/">Home</Link></Menu.Item>
          <Menu.Item position='right'><Button color="teal" as={Link} to="/addProject">Add Project</Button></Menu.Item>
        </Menu>
        <Switch>
            <Route exact path="/" component={ProjectsIndex} />
            <Route path="/projects" component={ProjectsIndex} />
            <Route path="/project/:pid" component={Project} />
            <Route path="/annotate/:pid" component={AnnotatePage} />
            <Route path="/addProject" component={AddProject} />
            
            <Route path="/annotateObjectStory/:imgid" component={ObjectStoryMtask} />
        </Switch>
    </Router>
);