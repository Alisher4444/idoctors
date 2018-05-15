import React from 'react';
<<<<<<< HEAD
import { StyleSheet, Image } from 'react-native';
import { Container, Content, Header, Body, Icon } from 'native-base';
=======
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
>>>>>>> 1ab18cf455540efa5a2f303a5480a7c671c4ee92
import { DrawerNavigator, DrawerItems, StackNavigator } from 'react-navigation';
import {
  Switch,
  Login,
  DoctorsLogin,
  Register,
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
<<<<<<< HEAD
  MedicalCard
} from '../screens';

const CustomDrawerContentComponent = props => (
  <Container>
=======
  MedicalCard,
  Notification,
  Support
} from '../screens';

const CustomDrawerContentComponent = props => (
  <Container style={styles.drawerContainer}>
>>>>>>> 1ab18cf455540efa5a2f303a5480a7c671c4ee92
    <Header style={{ height: 200 }}>
      <Body>
        <Image
          style={styles.drawerImage}
          source={require('../../assets/logo.png')}
        />
      </Body>
    </Header>
<<<<<<< HEAD
    <Content>
=======
    <Content style={styles.drawerItemStyle}>
>>>>>>> 1ab18cf455540efa5a2f303a5480a7c671c4ee92
      <DrawerItems {...props} />
    </Content>
  </Container>
);

const LoginStack = StackNavigator({
  DoctorsLogin: {
    screen: DoctorsLogin
  },
<<<<<<< HEAD

=======
>>>>>>> 1ab18cf455540efa5a2f303a5480a7c671c4ee92
  Register: {
    screen: Register
  }
});
const LoginPatient = StackNavigator({
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
<<<<<<< HEAD
      screen: HomeScreen
    },
    Consultation: {
      screen: Consultation
=======
      screen: HomeScreen,
      
    },
    Appointment: {
      screen: Consultation
    },
    Notification: {
      screen: Notification
    },
    Support: {
      screen: Support
>>>>>>> 1ab18cf455540efa5a2f303a5480a7c671c4ee92
    }
  },
  {
    initialRouteName: 'Home',
    drawerPosition: 'Left',
    contentComponent: CustomDrawerContentComponent,
    drawerOpenRoute: 'DrawerOpen',
    drawerCloseRoute: 'DrawerClose',
<<<<<<< HEAD
    drawerToggleRoute: 'DrawerToggle'
  }
=======
    drawerToggleRoute: 'DrawerToggle',
    contentOptions: {
    activeTintColor: '#019ae8',
    activeBackgroundColor: '#fafafa',
   },
  },
  
>>>>>>> 1ab18cf455540efa5a2f303a5480a7c671c4ee92
);

DrawerStack.navigationOptions = ({ navigation }) => ({
  title: 'Doctor',
  headerLeft: (
    <Icon
<<<<<<< HEAD
      style={{ paddingHorizontal: 10 }}
      name="home"
      ios="ios-menu"
      android="md-menu"
      size={30}
      color={'white'}
=======
      style={{ paddingHorizontal: 10, color: '#fff' }}
      name="menu"
      ios="ios-menu"
      android="md-menu"
      size={30}
>>>>>>> 1ab18cf455540efa5a2f303a5480a7c671c4ee92
      onPress={() => {
        if (navigation.state.index === 0) {
          navigation.navigate('DrawerOpen');
        } else {
          navigation.navigate('DrawerClose');
        }
      }}
    />
<<<<<<< HEAD
  )
=======
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
  headerTintColor: '#fff',
>>>>>>> 1ab18cf455540efa5a2f303a5480a7c671c4ee92
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
<<<<<<< HEAD
    drawerToggleRoute: 'DrawerToggle'
=======
    drawerToggleRoute: 'DrawerToggle',
    contentOptions: {
      activeTintColor: '#019ae8',
      activeBackgroundColor: '#fafafa',
     },
>>>>>>> 1ab18cf455540efa5a2f303a5480a7c671c4ee92
  }
);

DrawerPatientStack.navigationOptions = ({ navigation }) => ({
  title: 'Patient',
  headerLeft: (
    <Icon
<<<<<<< HEAD
      style={{ paddingHorizontal: 10 }}
=======
      style={{ paddingHorizontal: 10, color: '#fff' }}
>>>>>>> 1ab18cf455540efa5a2f303a5480a7c671c4ee92
      name="home"
      ios="ios-menu"
      android="md-menu"
      size={30}
<<<<<<< HEAD
      color={'white'}
=======
>>>>>>> 1ab18cf455540efa5a2f303a5480a7c671c4ee92
      onPress={() => {
        if (navigation.state.index === 0) {
          navigation.navigate('DrawerOpen');
        } else {
          navigation.navigate('DrawerClose');
        }
      }}
    />
<<<<<<< HEAD
  )
=======
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
  headerTintColor: '#fff',
>>>>>>> 1ab18cf455540efa5a2f303a5480a7c671c4ee92
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
  DrawerStack: {
    screen: DrawerStack
  },
  LoginPatient: {
    screen: LoginPatient
  },
  DrawerPatientStack: {
    screen: DrawerPatientStack
  },
<<<<<<< HEAD
=======
  Notification: {
    screen: Notification
  },
  Support: {
    screen: Support
  },
>>>>>>> 1ab18cf455540efa5a2f303a5480a7c671c4ee92
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
    height: 200,
<<<<<<< HEAD
    backgroundColor: 'white'
=======
    //backgroundColor: '#019ae8'
>>>>>>> 1ab18cf455540efa5a2f303a5480a7c671c4ee92
  },
  drawerImage: {
    height: 150,
    width: 150,
    borderRadius: 75
<<<<<<< HEAD
=======
  },
  drawerItemStyle: {
    paddingLeft: 30
  },
  drawerContainer: {
    backgroundColor: '#fafafa'
>>>>>>> 1ab18cf455540efa5a2f303a5480a7c671c4ee92
  }
});

export default Router;
