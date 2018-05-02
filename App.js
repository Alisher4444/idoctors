import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, Image } from "react-native";
import Switch from "./src/components/Switch/Switch";
import Login from "./src/components/Login/Login";
import Register from "./src/components/Register/Register";
import {
  DrawerNavigator,
  DrawerItems,
  TabNavigator,
  StackNavigator
} from "react-navigation";
import HomeScreen from "./src/HomeScreen";
import MainScreen from "./src/components/MainScreen";
import SettingScreen from "./src/SettingScreen";
import Profile from "./src/components/Profile/Profile";
import FirstPage from "./src/components/Welcome/FirstPage";
import {
  Container,
  Content,
  Header,
  Body,
  Icon,
  Left,
  Button,
  Title
} from "native-base";

export default class App extends Component {
  render() {
    return <MyApp />;
  }
}

const Navigation = StackNavigator({
  Welcome: {
    screen: FirstPage
  },
  Switch: {
    screen: Switch
  },
  Login: {
    screen: Login
  },
  Register: {
    screen: Register
  },
  Home: {
    screen: HomeScreen
  },
  SettingScreen: {
    screen: SettingScreen
  },
  Profile: {
    screen: Profile
  }
});

const CustomDrawerContentComponent = props => (
  <Container>
    <Header style={{ height: 200 }}>
      <Body>
        <Image
          style={styles.drawerImage}
          source={require("./assets/logo.png")}
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
      screen: Navigation
    }
  },
  {
    initialRouteName: "Home",
    drawerPosition: "Left",
    contentComponent: CustomDrawerContentComponent,
    drawerOpenRoute: "DrawerOpen",
    drawerCloseRoute: "DrawerClose",
    drawerToggleRoute: "DrawerToggle",
    navigationOptions: {
      title: "App",
      drawerIcon: (
        <Image
          source={require("./assets/home.png")}
          style={{ height: 24, width: 24 }}
        />
      ),
      header: (
        <Header style={{ backgroundColor: "#0095F8", elevation: 0 }}>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.navigate("DrawerOpen")}
            >
              <Icon name="home" ios="ios-menu" android="md-menu" />
            </Button>
          </Left>
          <Body>
            <Title style={{ marginLeft: 40 }}>Header</Title>
          </Body>
        </Header>
      )
    }
  }
);

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
