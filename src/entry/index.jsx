import '../common/lib';
import App from '../component/App';
import ReactDOM from 'react-dom';
import React from 'react';
import {Router, hashHistory } from 'react-router';

const rootRoute = {
  component: 'div',
  childRoutes: [{
    path: '/',
    component: require('../component/App'),
    indexRoute: { onEnter: (nextState, replace) => replace('/enter') },
    childRoutes: [
     require('../route/Home'),
     require('../route/Home/account'),
     require('../route/Home/confirm'),
     require('../route/Home/article'),
     require('../route/Home/media'),
     require('../route/Home/rank'),
     require('../route/Home/visitor'),
     require('../route/Apply'),
     require('../route/Apply/applyed'),
     require('../route/Apply/link'),
     require('../route/Apply/enter'),
     require('../route/Signup'),
     require('../route/Signup/finish'),
    ]
  }]
};

ReactDOM.render(
  <Router history={hashHistory} routes={rootRoute} />,
  document.getElementById('react-content'));
// ReactDOM.render(<App/>,document.getElementById('react-content'));
