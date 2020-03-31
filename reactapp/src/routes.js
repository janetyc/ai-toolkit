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
import AddProject from './components/AddProject';
import Home from './components/Home';
import Dashboard from './components/Dashboard';

const customHistory = createBrowserHistory();

export default (
    <Router history={customHistory}>
        <Menu>
          <Menu.Item><Link to="/">Home</Link></Menu.Item>
          <Menu.Item><Link to="/projects">Projects</Link></Menu.Item>
          <Menu.Item><Link to="/dashboard">Dashboard</Link></Menu.Item>
          <Menu.Item position='right'><Button color="teal" as={Link} to="/addProject">Add Project</Button></Menu.Item>
        </Menu>
        <Switch>
            <Route exact path="/"><Home /></Route>
            <Route path="/projects" component={ProjectsIndex} />
            <Route path="/projects/:id" />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/addProject" component={AddProject} />
        </Switch>
    </Router>
);