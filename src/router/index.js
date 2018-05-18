import React from 'react';
import { StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
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
import { DrawerNavigator, DrawerItems, StackNavigator } from 'react-navigation';
import {
  Switch,
  Login,
  DoctorsLogin,
  DoctorRegister,
  ClientRegister,
  DoctorProfile,
  HelpDeskProfile,
  Consultation,
  AppointmentDetails,
  Information,
  Review,
  User,
  FirstPage,
  HomeScreen,
  PatientHome,
  DiseaseProfile,
  MedicalCard,
  Notification,
  Support
} from '../screens';

const CustomDrawerContentComponent = props => (
  <Container style={styles.drawerContainer}>
    <Header style={{ height: 200 }}>
      <Body>
        <Image
          style={styles.drawerImage}
          source={require('../../assets/logo.png')}
        />
        <Text style={{ color: 'white' }}> Alisher Bazarkhanov</Text>
      </Body>
    </Header>
    <Content style={styles.drawerItemStyle}>
      <DrawerItems {...props} />
    </Content>
  </Container>
);

const LoginStack = StackNavigator({
  DoctorsLogin: {
    screen: DoctorsLogin
  },
  DoctorRegister: {
    screen: DoctorRegister
  }
});
const LoginPatient = StackNavigator({
  Login: {
    screen: Login
  },
  ClientRegister: {
    screen: ClientRegister
  }
});

const DrawerStack = DrawerNavigator(
  {
    Home: {
      screen: HomeScreen
    },
    Appointment: {
      screen: Consultation
    },
    Notification: {
      screen: Notification
    },
    Support: {
      screen: Support
    }
  },
  {
    initialRouteName: 'Home',
    drawerPosition: 'Left',
    contentComponent: CustomDrawerContentComponent,
    drawerOpenRoute: 'DrawerOpen',
    drawerCloseRoute: 'DrawerClose',
    drawerToggleRoute: 'DrawerToggle',
    contentOptions: {
      activeTintColor: '#019ae8',
      activeBackgroundColor: '#fafafa'
    }
  }
);

DrawerStack.navigationOptions = ({ navigation }) => ({
  title: 'Doctor',
  headerLeft: (
    <Icon
      style={{ paddingHorizontal: 10, color: '#fff' }}
      name="menu"
      ios="ios-menu"
      android="md-menu"
      size={30}
      onPress={() => {
        if (navigation.state.index === 0) {
          navigation.navigate('DrawerOpen');
        } else {
          navigation.navigate('DrawerClose');
        }
      }}
    />
  ),
  headerRight: (
    <Icon
      style={{ paddingHorizontal: 10, color: '#fff' }}
      name="search"
      ios="ios-search"
      android="md-search"
      size={30}
      onPress={() => {
        if (navigation.state.index === 0) {
          navigation.navigate('DrawerOpen');
        } else {
          navigation.navigate('DrawerClose');
        }
      }}
    />
  ),
  headerStyle: {
    backgroundColor: '#019ae8',
    borderBottomColor: 'transparent',
    shadowColor: 'transparent',
    elevation: null
  },
  headerTintColor: '#fff'
});

const DrawerPatientStack = DrawerNavigator(
  {
    PatientHome: {
      screen: PatientHome
    },
    Consultation: {
      screen: Consultation
    },
    MedicalCard: {
      screen: MedicalCard
    }
  },
  {
    initialRouteName: 'PatientHome',
    drawerPosition: 'Left',
    contentComponent: CustomDrawerContentComponent,
    drawerOpenRoute: 'DrawerOpen',
    drawerCloseRoute: 'DrawerClose',
    drawerToggleRoute: 'DrawerToggle',
    contentOptions: {
      activeTintColor: '#019ae8',
      activeBackgroundColor: '#fafafa'
    }
  }
);

DrawerPatientStack.navigationOptions = ({ navigation }) => ({
  title: 'Patient',
  headerLeft: (
    <Icon
      style={{ paddingHorizontal: 10, color: '#fff' }}
      name="home"
      ios="ios-menu"
      android="md-menu"
      size={30}
      onPress={() => {
        if (navigation.state.index === 0) {
          navigation.navigate('DrawerOpen');
        } else {
          navigation.navigate('DrawerClose');
        }
      }}
    />
  ),
  headerRight: (
    <Icon
      style={{ paddingHorizontal: 10, color: '#fff' }}
      name="search"
      ios="ios-search"
      android="md-search"
      size={30}
      onPress={() => {
        if (navigation.state.index === 0) {
          navigation.navigate('DrawerOpen');
        } else {
          navigation.navigate('DrawerClose');
        }
      }}
    />
  ),
  headerStyle: {
    backgroundColor: '#019ae8',
    borderBottomColor: 'transparent',
    shadowColor: 'transparent',
    elevation: null
  },
  headerTintColor: '#fff'
});

const Router = StackNavigator({
  Welcome: {
    screen: FirstPage
  },
  Switch: {
    screen: Switch
  },
  LoginStack: {
    screen: LoginStack
  },
  LoginPatient: {
    screen: LoginPatient
  },
  DrawerStack: {
    screen: DrawerStack
  },

  DrawerPatientStack: {
    screen: DrawerPatientStack
  },
  Notification: {
    screen: Notification
  },
  Support: {
    screen: Support
  },
  User: {
    screen: User
  },
  DoctorProfile: {
    screen: DoctorProfile
  },
  HelpDeskProfile: {
    screen: HelpDeskProfile
  },
  AppointmentDetails: {
    screen: AppointmentDetails
  },
  Information: {
    screen: Information
  },
  Review: {
    screen: Review
  },
  DiseaseProfile: {
    screen: DiseaseProfile
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  drawerHeader: {
    height: 200
    //backgroundColor: '#019ae8'
  },
  drawerImage: {
    height: 150,
    width: 150,
    borderRadius: 75
  },
  drawerItemStyle: {
    paddingLeft: 30
  },
  drawerContainer: {
    backgroundColor: '#fafafa'
  }
});

export default Router;
