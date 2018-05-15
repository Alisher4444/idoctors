import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert
} from 'react-native';

import firebase from 'firebase';

export default class Login extends Component {
  static navigationOptions = {
    title: 'Login',
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

  // onLoginSuccess(user) {
  //   const { alert } = Alert;
  //   this.setState({
  //     email: '',
  //     password: '',
  //     errorMessage: '',
  //     loading: false
  //   });
  // }

  handlePress({ email, password }, navigate) {
    const { alert } = Alert;
    this.setState({ loading: true });
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        navigate('Home');
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
          <Image
            style={styles.logo}
            source={require('../../../assets/logo.png')}
          />
          <Text style={styles.title}>SIGN IN</Text>

          <TextInput
            placeholder="Username"
            placeholderTextColor="#E0E0E0"
            style={styles.input}
            value={this.state.email}
            onChangeText={email => this.setState({ email })}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#E0E0E0"
            style={styles.input}
            value={this.state.password}
            onChangeText={password => this.setState({ password })}
          />
          <TouchableOpacity
            onPress={() => this.handlePress({ ...this.state }, navigate)}
            style={styles.button}
          >
            <Text style={styles.btnText}>LOGIN</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.signupTextCont}>
          <Text style={styles.signupText}> Don't have an account yet?</Text>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Register')}
          >
            <Text style={styles.signup}> SignUp </Text>
          </TouchableOpacity>
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
    flexGrow: 1,
    justifyContent: 'center'
  },
  logo: {
    marginBottom: 50
  },
  title: {
    color: '#212121',
    fontSize: 30,
    marginBottom: 20
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
  },
  input: {
    width: 300,
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginBottom: 20,
    color: '#FFF',
    paddingHorizontal: 10,
    borderRadius: 40,
    borderWidth: 0.5,
    borderColor: '#E0E0E0',
    paddingLeft: 40
  },
  button: {
    height: 50,
    width: 300,
    backgroundColor: '#0091EA',
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 40
  },
  btnText: {
    color: '#fff'
  }
});
