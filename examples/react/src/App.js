import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import {Form} from './containers'
import { HISTORY } from './util'
import { ToastProvider } from 'react-toast-notifications';

function App() {
  return (
    <ToastProvider
    autoDismiss
    autoDismissTimeout={5000}>
      <Router history={HISTORY}>
          <Switch>
            <Route exact path='/' component={Form}></Route>
            {/* <Route exact path='/extend' component={Extend}></Route> */}
          </Switch>
      </Router> 
    </ToastProvider>
  );
}

export default App;
