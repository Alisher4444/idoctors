import React, { Component } from 'react';
import { Image, View, Text } from 'react-native';
import ScrollTabView from 'react-native-scrollable-tab-view';
import HelpDesk from '../HelpDesk/HelpDesk';
import PatientScreen from '../Patient/PatientScreen';

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
    const { navigation } = this.props;
    return (
      <ScrollTabView>
        <PatientScreen tabLabel="PatientScreen" navigation={navigation} />
        <HelpDesk tabLabel="HelpDesk" navigation={navigation} />
      </ScrollTabView>
    );
  }
}
