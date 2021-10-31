// @ts-nocheck

import React from 'react';
import { AuthProvider } from './components/contexts/AuthContext';
import Signup from './components/Signup';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Dashboard from './components/Dashboard';
import LoginPage from './components/LoginPage';
import PrivateRoute from './components/PrivateRoute';
import ForgotPassword from './components/ForgotPassword';
import UpdateProfile from './components/UpdateProfile';
import DetailsPage from './components/DetailsPage';
import Testthing from './components/Testthing';
import ProfilePage from './components/ProfilePage';
import Episodes from './components/Episodes';
import Person from './components/Person';

function App() {
  return (
    <>
    <div className="w-screen min-h-screen h-auto bg-gray-900 absolute" id="superBody">
    <Router>
    <AuthProvider>
      <Switch>
        <PrivateRoute exact path="/" component={Dashboard}></PrivateRoute>
        <PrivateRoute path="/updateprofile" component={UpdateProfile}></PrivateRoute>
        <Route path="/signup" component={Signup}></Route>
        <Route path="/login" component={LoginPage}></Route>
        <Route path="/forgotpassword" component={ForgotPassword}></Route>
        <Route path="/series/:id" component={DetailsPage}></Route>
        <Route path="/:id/season-:seasonId/episodes" component={Episodes}></Route>
        <Route path="/actor/:actorId" component={Person}></Route>
        <PrivateRoute path="/:profileId" component={ProfilePage}></PrivateRoute>
      </Switch>
    </AuthProvider>
    </Router>
    </div>
    </>
  );
}

export default App;