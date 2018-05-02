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
  Switch
} from "native-base";
import {
  StackNavigator,
  DrawerNavigator,
  DrawerItems,
  TabNavigator
} from "react-navigation";
import PatientScreen from "../components/PatientScreen";
import HelpDesk from "../components/HelpDesk/HelpDesk";
import HomeScreen from "../HomeScreen";

const CustomDrawerContentComponent = props => (
  <Container>
    <Header style={{ height: 200 }}>
      <Body>
        <Image
          style={styles.drawerImage}
          source={require("../../assets/logo.png")}
        />
      </Body>
    </Header>
    <Content>
      <DrawerItems {...props} />
    </Content>
  </Container>
);
const MyApp = DrawerNavigator(
  {
    Home: {
      screen: HomeScreen
    }
  },
  {
    initialRouteName: "Home",
    drawerPosition: "Left",
    contentComponent: CustomDrawerContentComponent,
    drawerOpenRoute: "DrawerOpen",
    drawerCloseRoute: "DrawerClose",
    drawerToggleRoute: "DrawerToggle"
  }
);

export default class MainScreen extends Component {
  render() {
    return <MyApp />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  drawerHeader: {
    height: 200,
    backgroundColor: "white"
  },
  drawerImage: {
    height: 150,
    width: 150,
    borderRadius: 75
  }
});
