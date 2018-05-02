import React, { Component } from "react";
import { Platform, StyleSheet, Image, Text, View } from "react-native";
import {
  Icon,
  Button,
  Container,
  Header,
  Content,
  Left,
  Body,
  Title,
  Switch,
  Tab
} from "native-base";
import {
  StackNavigator,
  DrawerNavigator,
  DrawerItems,
  TabNavigator
} from "react-navigation";
import PatientScreen from "./components/PatientScreen";
import HelpDesk from "./components/HelpDesk/HelpDesk";
import Profile from "./components/Profile/Profile";

export default class HomeScreen extends Component {
  static navigationOptions = {
    title: "MY PATIENTS",
    drawerIcon: (
      <Image
        source={require("../assets/home.png")}
        style={{ height: 24, width: 24 }}
      />
    )
  };

  render() {
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
