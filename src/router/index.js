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
  Title,
  Tab
} from 'native-base';
import {
  DrawerNavigator,
  DrawerItems,
  StackNavigator,
  TabNavigator
} from 'react-navigation';
import {
  Switch,
  Login,
  Register,
  PatientScreen,
  HelpDesk,
  Completed,
  Upcoming,
  Canceled,
  DiseaseProfile,
  //--HelpDeskProfile,
  Disease,
  Doctors,
  //--Consultation,
  //--AppointmentDetails,
  //Information,
  //--Review
  //--User
  // SettingScreen,
  //--Profile
  //FirstPage,
  //MainScreen,
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
    screen: DiseaseProfile
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
const TabStack = TabNavigator({
  Patient: {
    screen: PatientScreen
  },
  HelpDesk: {
    screen: HelpDesk
  }
});

const TabAppoitment = TabNavigator({
  Completed: {
    screen: Completed
  },
  Upcoming: {
    screen: Upcoming
  },
  Canceled: {
    screen: Canceled
  }
});

const TabConsultations = TabNavigator({
  Disease: {
    screen: Disease
  },
  Doctors: {
    screen: Doctors
  },
  HelpDesk: {
    screen: HelpDesk
  }
});

const DrawerStack = DrawerNavigator(
  {
    Home: {
      screen: DiseaseProfile
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
  },
  TabStack: {
    screen: TabConsultations
  },
  TabAppoitment: {
    screen: TabConsultations
  },
  TabConsultations: {
    screen: TabConsultations
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
