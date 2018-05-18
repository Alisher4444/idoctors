import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { Button, Input } from '../../commons';

class Login extends Component {
  static navigationOptions = {
    title: 'Doctor Login',
    header: null
  };

  constructor() {
    super();

    this.handlePress = this.handlePress.bind(this);
  }
  state = {
    email: '',
    password: '',
    errorMessage: '',
    loading: false
  };

  handlePress({ email, password }, navigate) {
    const { alert } = Alert;
    this.setState({ loading: true });
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(user => {
        navigate('PatientHome');
      })
      .catch(() => {
        console.log('Error!');
      });
  }

  render() {
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
          <Text style={title}>SIGN IN DOCTORS</Text>
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
          <View style={resetContainer}>
            <Text style={questionText}>Forget Password?</Text>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Home')}
            >
              <Text style={link}>Reset it</Text>
            </TouchableOpacity>
          </View>
          <Button onPress={() => this.props.navigation.navigate('Home')}>
            SIGN IN
          </Button>
        </ScrollView>
        <View style={signupTextCont}>
          <Text style={questionText}> Don't have an account yet?</Text>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('DoctorRegister')}
          >
            <Text style={link}> SignUp </Text>
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
export default Login;
