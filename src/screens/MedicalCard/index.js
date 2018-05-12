import React, { Component } from 'react';
import { Image, View, Text } from 'react-native';
import ScrollTabView from 'react-native-scrollable-tab-view';
import Card from '../MedicalCard/Card';
import Notes from '../MedicalCard/DNotes';

export default class MainCard extends Component {
  static navigationOptions = {
    title: 'Medical Card',
    drawerIcon: (
      <Image
        source={require('../../../assets/home.png')}
        style={{ height: 24, width: 24 }}
      />
    )
  };

  render() {
    const { navigation } = this.props;
    return (
      <ScrollTabView>
        <Card tabLabel="Card" navigation={navigation} />
        <Notes tabLabel="Notes" navigation={navigation} />
      </ScrollTabView>
    );
  }
}
