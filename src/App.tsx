// @ts-nocheck

import React from 'react';
import { AuthProvider } from './components/contexts/AuthContext';
import Signup from './components/Signup';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import LoginPage from './components/LoginPage';
import PrivateRoute from './components/PrivateRoute';
import ForgotPassword from './components/ForgotPassword';
import UpdateProfile from './components/UpdateProfile';
import DetailsPage from './components/DetailsPage';
import ProfilePage from './components/ProfilePage';
import Episodes from './components/Episodes';
import Person from './components/Person';
import Mainpage from './components/Mainpage';
import EpisodeLore from './components/EpisodeLore';
import Activity from './components/Activity';
import MainPageNavbar from './components/MainPageNavbar';
import ReviewPage from './components/ReviewPage';
// import { Provider } from 'react-redux';
// import { createStore, applyMiddleware } from 'redux';
// import rootReducer from './redux/reducers';
// import thunk from 'redux-thunk';
// import Reduxmainpage from './components/Reduxmainpage';

// const store = createStore(rootReducer, applyMiddleware(thunk));

function App() {
  return (
    <>
    <div className="w-screen min-h-screen h-auto bg-gray-900 absolute" id="superBody">
          <Router>
            <AuthProvider>
              <MainPageNavbar></MainPageNavbar>
              <Switch>
                {/* <PrivateRoute exact path="/" component={Dashboard}></PrivateRoute> */}
                <PrivateRoute path="/updateprofile" component={UpdateProfile}></PrivateRoute>
                <Route path="/signup" component={Signup}></Route>
                <Route path="/dashboard" component={Dashboard}></Route>
                <Route path="/login" component={LoginPage}></Route>
                <Route path="/forgotpassword" component={ForgotPassword}></Route>
                <Route path="/series/:id" component={DetailsPage}></Route>
                <Route path="/:id/reviews" component={ReviewPage}></Route>
                <Route path="/:id/season-:seasonId/episodes" component={Episodes}></Route>
                <Route path="/actor/:actorId" component={Person}></Route>
                <Route path="/activity" component={Activity}></Route>
                <Route exact path="/" component={Mainpage}></Route>
                <Route path="/:id/season-:seasonId/episode/:episodeId" component={EpisodeLore}></Route>
                <PrivateRoute path="/:profileId" component={ProfilePage}></PrivateRoute>
              </Switch>
            </AuthProvider>
          </Router>
        </div>
      {/* <Provider store={store}> */}
        {/* <MainMurloc></MainMurloc> */}
      {/* </Provider> */}
    </>
  );
}

export default App;