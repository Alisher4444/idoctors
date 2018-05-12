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
  MedicalCard
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
  DoctorsLogin: {
    screen: DoctorsLogin
  },

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
      screen: HomeScreen
    },
    Consultation: {
      screen: Consultation
    }
  },
  {
    initialRouteName: 'Home',
    drawerPosition: 'Left',
    contentComponent: CustomDrawerContentComponent,
    drawerOpenRoute: 'DrawerOpen',
    drawerCloseRoute: 'DrawerClose',
    drawerToggleRoute: 'DrawerToggle'
  }
);

DrawerStack.navigationOptions = ({ navigation }) => ({
  title: 'Doctor',
  headerLeft: (
    <Icon
      style={{ paddingHorizontal: 10 }}
      name="home"
      ios="ios-menu"
      android="md-menu"
      size={30}
      color={'white'}
      onPress={() => {
        if (navigation.state.index === 0) {
          navigation.navigate('DrawerOpen');
        } else {
          navigation.navigate('DrawerClose');
        }
      }}
    />
  )
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
    drawerToggleRoute: 'DrawerToggle'
  }
);

DrawerPatientStack.navigationOptions = ({ navigation }) => ({
  title: 'Patient',
  headerLeft: (
    <Icon
      style={{ paddingHorizontal: 10 }}
      name="home"
      ios="ios-menu"
      android="md-menu"
      size={30}
      color={'white'}
      onPress={() => {
        if (navigation.state.index === 0) {
          navigation.navigate('DrawerOpen');
        } else {
          navigation.navigate('DrawerClose');
        }
      }}
    />
  )
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
    backgroundColor: 'white'
  },
  drawerImage: {
    height: 150,
    width: 150,
    borderRadius: 75
  }
});

export default Router;
