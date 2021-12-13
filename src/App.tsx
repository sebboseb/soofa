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
import Users from './components/Users';
import RecentActivity from './components/RecentActivity';
import PersonReview from './components/PersonReview';
import UserSeriesPage from './components/UserSeriesPage';
// import { Provider } from 'react-redux';
// import { createStore, applyMiddleware } from 'redux';
// import rootReducer from './redux/reducers';
// import thunk from 'redux-thunk';
// import Reduxmainpage from './components/Reduxmainpage';

// const store = createStore(rootReducer, applyMiddleware(thunk));

function App() {
  return (
    <>
    <div className="w-screen min-h-screen h-auto dark:bg-letterboxd-bg bg-youtube-white-bg absolute" id="superBody">
          <Router>
            <AuthProvider>
              <MainPageNavbar></MainPageNavbar>
              <Switch>
                {/* <PrivateRoute exact path="/" component={Dashboard}></PrivateRoute> */}
                <PrivateRoute path="/updateprofile" component={UpdateProfile}></PrivateRoute>
                <Route path="/signup" component={Signup}></Route>
                <Route path="/dashboard/page/:pageId" component={Dashboard}></Route>
                <Route path="/login" component={LoginPage}></Route>
                <Route path="/forgotpassword" component={ForgotPassword}></Route>
                <Route path="/series/:id" component={DetailsPage}></Route>
                <Route path="/reviews/:id" component={ReviewPage}></Route>
                <Route path="/:id/season-:seasonId/episodes" component={Episodes}></Route>
                <Route path="/activity/:activityId" component={Activity}></Route>
                <Route exact path="/:profileId/series/" component={UserSeriesPage}></Route>
                <Route exact path="/:profileId/activity/:activityId" component={RecentActivity}></Route>
                <Route exact path="/:profileId/:id/:indexId/" component={PersonReview}></Route>
                <Route exact path="/:knownforId/:actorId" component={Person}></Route>
                <Route exact path="/" component={Mainpage}></Route>
                <Route path="/:id/season-:seasonId/episode/:episodeId" component={EpisodeLore}></Route>
                <Route exact path="/users" component={Users}></Route>
                <Route path="/:profileId" component={ProfilePage}></Route>
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