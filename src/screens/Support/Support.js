import React, { Component } from 'react';
import { Text } from 'react-native';

export default class Support extends Component {
  static navigationOptions = {
    title: 'SUPPORT',

    // drawerIcon: (
    //   <Image
    //     source={require('../../../assets/home.png')}
    //     style={{ height: 24, width: 24 }}
    //   />
    // )
  };
  constructor() {
    super();
    this.state = {
      active: 'true'
    };
  }
  render() {
    return (
      <Text />
    );
}
}
