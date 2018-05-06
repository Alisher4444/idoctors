import React, { Component } from 'react';
import { Image, View, Text } from 'react-native';

export default class HomeScreen extends Component {
  static navigationOptions = {
    title: 'Home',
    drawerIcon: (
      <Image
        source={require('../../../assets/home.png')}
        style={{ height: 24, width: 24 }}
      />
    )
  };

  render() {
    return (
      <View>
        <Text>Hello world</Text>
      </View>
    );
  }
}
