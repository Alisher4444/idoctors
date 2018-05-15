import React, { Component } from 'react';
<<<<<<< HEAD
import { Image, View, Text } from 'react-native';
=======
import { Image, StyleSheet } from 'react-native';
>>>>>>> 1ab18cf455540efa5a2f303a5480a7c671c4ee92
import ScrollTabView from 'react-native-scrollable-tab-view';
import HelpDesk from '../HelpDesk/HelpDesk';
import PatientScreen from '../Patient/PatientScreen';

export default class HomeScreen extends Component {
  static navigationOptions = {
<<<<<<< HEAD
    title: 'Home',
    drawerIcon: (
      <Image
        source={require('../../../assets/home.png')}
        style={{ height: 24, width: 24 }}
      />
    )
=======
    title: 'MY PATIENTS',
    
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
>>>>>>> 1ab18cf455540efa5a2f303a5480a7c671c4ee92
  };

  render() {
    const { navigation } = this.props;
    return (
<<<<<<< HEAD
      <ScrollTabView>
=======
      <ScrollTabView 
      tabBarUnderlineStyle={{ backgroundColor: '#fff' }}
      tabBarBackgroundColor='#019ae8'
      tabBarInactiveTextColor='#fff'
      tabBarActiveTextColor='#fff'
      tabBarTextStyle={{ fontSize: 16 }}
      >
>>>>>>> 1ab18cf455540efa5a2f303a5480a7c671c4ee92
        <PatientScreen tabLabel="PatientScreen" navigation={navigation} />
        <HelpDesk tabLabel="HelpDesk" navigation={navigation} />
      </ScrollTabView>
    );
  }
}
<<<<<<< HEAD
=======

>>>>>>> 1ab18cf455540efa5a2f303a5480a7c671c4ee92
