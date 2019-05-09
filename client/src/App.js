import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
//import component
import Header from './components/navbar/Header';
import Carousel from './components/carousel/SlideShow';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import NotFound from './components/notFound/NotFound';
import './App.css'
class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <Router>
          <Switch>
            <Route path="/" exact component={Carousel} />
            <Route path="/register" exact component={Register} />
            <Route path="/login" exact component={Login} />
            <Route path="/" component={NotFound} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;