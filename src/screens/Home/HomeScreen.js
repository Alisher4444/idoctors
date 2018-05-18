import React, { Component } from 'react';
import { Image, StyleSheet } from 'react-native';
import ScrollTabView from 'react-native-scrollable-tab-view';
import HelpDesk from '../HelpDesk/HelpDesk';
import PatientScreen from '../Patient/PatientScreen';

export default class HomeScreen extends Component {
  static navigationOptions = {
    title: 'MY PATIENTS'

    // headerStyle: {
    //     backgroundColor: '#019ae8',
    //     borderBottomColor: 'transparent',
    //     shadowColor: 'transparent',
    //     elevation: null
    // },
    // drawerIcon: (
    //   <Image
    //     source={require('../../../assets/home.png')}
    //     style={{ height: 24, width: 24 }}
    //   />
    // )
  };

  render() {
    const { navigation } = this.props;
    return (
      <ScrollTabView
        tabBarUnderlineStyle={{ backgroundColor: '#fff' }}
        tabBarBackgroundColor="#019ae8"
        tabBarInactiveTextColor="#fff"
        tabBarActiveTextColor="#fff"
        tabBarTextStyle={{ fontSize: 16 }}
      >
        <PatientScreen tabLabel="PatientScreen" navigation={navigation} />
        <HelpDesk tabLabel="HelpDesk" navigation={navigation} />
      </ScrollTabView>
    );
  }
}
