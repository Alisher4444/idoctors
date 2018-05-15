import React, { Component } from 'react';
<<<<<<< HEAD
import firebase from 'firebase';
import Hello from './router';

export default class App extends Component {
  componentWillMount() {
    firebase.initializeApp({
      apiKey: 'AIzaSyBh7_KG-G77_In2dB-zQuiCiUyoPDOsrA4',
      authDomain: 'idoctors-29f7d.firebaseapp.com',
      databaseURL: 'https://idoctors-29f7d.firebaseio.com',
      projectId: 'idoctors-29f7d',
      storageBucket: 'idoctors-29f7d.appspot.com',
      messagingSenderId: '74208637941'
    });
  }
=======
import Hello from './router';

export default class App extends Component {
>>>>>>> 1ab18cf455540efa5a2f303a5480a7c671c4ee92
  render() {
    return <Hello />;
  }
}
