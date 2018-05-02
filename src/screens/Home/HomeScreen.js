import React, { Component } from 'react';
import { Image } from 'react-native';
import { StackNavigator, TabNavigator } from 'react-navigation';
import { Container } from 'native-base';
import PatientScreen from '../Patient/PatientScreen';
import HelpDesk from '../HelpDesk/HelpDesk';
import Profile from '../Profile/Profile';

export default class HomeScreen extends Component {
  static navigationOptions = {
    title: 'MY PATIENTS',
    drawerIcon: (
      <Image
        source={require('../../../assets/home.png')}
        style={{ height: 24, width: 24 }}
      />
    )
  };

  render() {
    // FIX-ME MOVE TO ROUTER 🤪
    const PatientStack = StackNavigator({
      PatientScreen: {
        screen: PatientScreen
      },
      Profile: {
        screen: Profile
      }
    });
    const HelpDeskStack = StackNavigator({
      HelpDesk: {
        screen: HelpDesk
      },
      Profile: {
        screen: Profile
      }
    });
    const Tabs = TabNavigator({
      PatientScreen: {
        screen: PatientStack
      },
      HelpDesk: {
        screen: HelpDeskStack
      }
    });

    return (
      <Container>
        <Tabs />
      </Container>
    );
  }
}
