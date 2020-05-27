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
import Home from './components/Home';
import ProjectsIndex from './components/ProjectsIndex';
import Project from './components/Project';
import AddProject from './components/AddProject';
import AnnotatePage from './components/AnnotatePage';
import ObjectStoryMtask from './components/CrowdTasks/ObjectStoryMTask';

import ProjectManagement from './components/Dashboard/ProjectManagement';

const customHistory = createBrowserHistory();

export default (
    <Router history={customHistory}>
        <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/dashboard" component={ProjectsIndex} />
            <Route path="/projects" component={ProjectsIndex} />
            <Route path="/project/:pid" component={Project} />
            <Route path="/annotate/:pid" component={AnnotatePage} />
            <Route path="/addProject" component={AddProject} />
            
            <Route path="/annotateObjectStory/:imgid" component={ObjectStoryMtask} />

            <Route path="/admin" component={ProjectManagement} />
        </Switch>
    </Router>
);