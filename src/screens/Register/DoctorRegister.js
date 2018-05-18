import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import firebase from 'firebase';
import { Button, Input } from '../../commons';

class DoctorRegister extends Component {
  static navigationOptions = {
    title: 'Doctor Register',
    header: null
  };

  constructor() {
    super();
    this.signupPress = this.signupPress.bind(this);
  }

  state = {
    email: '',
    password: '',
    firstname: '',
    lastname: '',
    errorMessage: '',
    loading: false
  };

  onSignupSuccsteess(user) {
    const { alert } = Alert;
    this.setState({
      email: '',
      password: '',
      firstname: '',
      lastname: '',
      errorMessage: '',
      loading: false
    });
    alert('SignUp!', user.email);
  }

  signupPress(navigate) {
    const { email, password, firstname, lastname } = this.state;
    const { alert } = Alert;
    this.setState({ loading: true });
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(user => {
        firebase
          .database()
          .ref('users/doctors/' + firebase.auth().currentUser.uid)
          .set({
            email: email,
            password: password,
            firstname: firstname,
            lastname: lastname,
            client: false,
            doctor: true
          });
      })

      .then(user => {
        navigate('DoctorsLogin');
      })
      .catch(() => {
        alert('Error Signup');
      });
  }

  render() {
    const { navigate } = this.props.navigation;
    const {
      resetContainer,
      container,
      title,
      questionText,
      link,
      signupTextCont,
      contentContainer
    } = styles;
    return (
      <View style={container}>
        <ScrollView contentContainerStyle={contentContainer}>
          <Text style={title}>SIGN UP DOCTORS</Text>
          <Input
            placeholder="Last Name"
            label={require('../../../assets/user.png')}
            placeholderTextColor={'#c1c1c1'}
            height={70}
            width={70}
            value={this.state.lastname}
            onChangeText={lastname => this.setState({ lastname })}
          />
          <Input
            placeholder="First Name"
            label={require('../../../assets/user.png')}
            placeholderTextColor={'#c1c1c1'}
            height={70}
            width={70}
            value={this.state.firstname}
            onChangeText={firstname => this.setState({ firstname })}
          />
          <Input
            placeholder="Phone Number"
            label={require('../../../assets/telephone.png')}
            placeholderTextColor={'#c1c1c1'}
            height={70}
            width={70}
            value={this.state.email}
            onChangeText={email => this.setState({ email })}
          />
          <Input
            placeholder="Password"
            label={require('../../../assets/pas.png')}
            height={65}
            width={50}
            value={this.state.password}
            onChangeText={password => this.setState({ password })}
          />

          <Button onPress={() => this.signupPress(navigate)}>SIGN UP</Button>
        </ScrollView>
        <View style={signupTextCont}>
          <Text style={questionText}> Have an account? </Text>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Login')}
          >
            <Text style={link}> SIGN IN </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    position: 'relative'
  },
  title: {
    fontSize: 30,
    fontWeight: '600',
    marginBottom: 50,
    marginTop: 100,
    alignSelf: 'center'
  },
  contentContainer: {},
  resetContainer: {
    marginLeft: 30,
    flex: 1,
    flexDirection: 'row',
    marginBottom: 30
  },
  questionText: {
    fontSize: 14,
    fontWeight: '200',
    color: '#e1e1e1',
    marginRight: 15
  },
  link: {
    fontSize: 14,
    fontWeight: '200',
    color: '#029adf'
  },
  signupTextCont: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    flexShrink: 1,
    backgroundColor: '#fff',
    flexDirection: 'row',
    paddingTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20
  }
});
export default DoctorRegister;
