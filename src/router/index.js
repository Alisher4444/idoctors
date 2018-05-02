import React from 'react';
import { StyleSheet, Image } from 'react-native';
import {
  Container,
  Content,
  Header,
  Body,
  Icon,
  Left,
  Button,
  Title
} from 'native-base';
import { DrawerNavigator, DrawerItems, StackNavigator } from 'react-navigation';
import {
  Switch,
  Login,
  Register,
  HomeScreen,
  // SettingScreen,
  // Profile,
  FirstPage
} from '../screens';

const CustomDrawerContentComponent = props => (
  <Container>
    <Header style={{ height: 200 }}>
      <Body>
        <Image
          style={styles.drawerImage}
          source={require('../../assets/logo.png')}
        />
      </Body>
    </Header>
    <Content>
      <DrawerItems {...props} />
    </Content>
  </Container>
);

const LoginStack = StackNavigator({
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
  }
});

const DrawerStack = DrawerNavigator(
  {
    Home: {
      screen: FirstPage
    }
  },
  {
    initialRouteName: 'Home',
    drawerPosition: 'Left',
    contentComponent: CustomDrawerContentComponent,
    drawerOpenRoute: 'DrawerOpen',
    drawerCloseRoute: 'DrawerClose',
    drawerToggleRoute: 'DrawerToggle',
    navigationOptions: {
      title: 'App',
      drawerIcon: (
        <Image
          source={require('../../assets/home.png')}
          style={{ height: 24, width: 24 }}
        />
      ),
      header: (
        <Header style={{ backgroundColor: '#0095F8', elevation: 0 }}>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.navigate('DrawerOpen')}
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

const Router = StackNavigator({
  LoginStack: {
    screen: LoginStack
  },
  DrawerStack: {
    screen: DrawerStack
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  drawerHeader: {
    height: 200,
    backgroundColor: 'white'
  },
  drawerImage: {
    height: 150,
    width: 150,
    borderRadius: 75
  }
});

export default Router;
