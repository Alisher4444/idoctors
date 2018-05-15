import React, { Component } from 'react';
import { Image, View, Text } from 'react-native';
import ScrollTabView from 'react-native-scrollable-tab-view';
import Disease from '../Disease/Disease';
import Doctors from '../Doctors/Doctors';
import HelpDesk from '../HelpDesk/HelpDesk';

export default class Home extends Component {
  static navigationOptions = {
    title: 'MY DOCTORS',
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
      tabBarBackgroundColor='#019ae8'
      tabBarInactiveTextColor='#fff'
      tabBarActiveTextColor='#fff'
      tabBarTextStyle={{ fontSize: 16 }}
      >
        <Disease tabLabel="Disease" navigation={navigation} />
        <Doctors tabLabel="Doctors" navigation={navigation} />
        <HelpDesk tabLabel="HelpDesk" navigation={navigation} />
      </ScrollTabView>
    );
  }
}
