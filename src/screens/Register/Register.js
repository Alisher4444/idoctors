import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert
} from 'react-native';
import firebase from 'firebase';

export default class Register extends Component {
  static navigationOptions = {
    title: 'Register',
    header: null
  };
  constructor() {
    super();
    this.signupOnPress = this.signupOnPress.bind(this);
  }

  state = {
    email: '',
    password: '',
    errorMessage: '',
    loading: false
  };

  onsignUpSuccess(user) {
    const { alert } = Alert;
    this.setState({
      email: '',
      password: '',
      errorMessage: '',
      loading: false
    });
    alert('SignUp', user.email);
  }

  signupOnPress(navigate) {
    const { email, password } = this.state;
    const { alert } = Alert;
    this.setState({
      loading: true
    });
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(user => {
        navigate('Login');
      })
      .catch(() => {
        alert('Error brat');
      });
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Text style={styles.title}>SIGN UP</Text>
          <TextInput
            placeholder="Email"
            underlineColorAndroid="transparent"
            placeholderTextColor="#E0E0E0"
            style={styles.input}
            value={this.state.email}
            onChangeText={email => this.setState({ email })}
          />
          <TextInput
            placeholder="Password"
            underlineColorAndroid="transparent"
            placeholderTextColor="#E0E0E0"
            style={styles.input}
            value={this.state.password}
            onChangeText={password => this.setState({ password })}
          />
          {/* <TextInput
            placeholder="Phone Number"
            underlineColorAndroid="transparent"
            placeholderTextColor="#E0E0E0"
            style={styles.input}
          />
          <TextInput
            placeholder="Password"
            underlineColorAndroid="transparent"
            placeholderTextColor="#E0E0E0"
            style={styles.input}
          /> */}

          <TouchableOpacity
            style={styles.button}
            onPress={() => this.signupOnPress(navigate)}
          >
            <Text style={styles.btnText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.signupTextCont}>
          <Text style={styles.signupText}> Do have an account ?</Text>
          <Text style={styles.signup}> Sign In </Text>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  },
  logoContainer: {
    alignItems: 'center',
    flexGrow: 3,
    justifyContent: 'center'
  },
  input: {
    width: 300,
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginBottom: 5,

    paddingHorizontal: 10,
    borderRadius: 40,
    borderWidth: 0.5,
    borderColor: '#E0E0E0',
    paddingLeft: 40,
    color: 'black'
  },
  button: {
    width: 300,
    height: 50,
    backgroundColor: '#0091EA',
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 40,
    marginTop: 20
  },
  btnText: {
    color: '#fff'
  },
  title: {
    color: '#212121',
    fontSize: 30,
    marginBottom: 40,
    marginTop: 60
  },
  signupTextCont: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 50
  },
  signupText: {},
  signup: {
    fontWeight: 'bold',
    color: '#0D47A1'
  }
});
