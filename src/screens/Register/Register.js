import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity
} from 'react-native';

export default class Register extends Component {
  static navigationOptions = {
    title: 'Register',
    header: null
  };
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Text style={styles.title}>SIGN UP</Text>
          <TextInput
            placeholder="Firstname"
            underlineColorAndroid="transparent"
            placeholderTextColor="#E0E0E0"
            style={styles.input}
          />
          <TextInput
            placeholder="Lastname"
            underlineColorAndroid="transparent"
            placeholderTextColor="#E0E0E0"
            style={styles.input}
          />
          <TextInput
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
          />

          <TouchableOpacity style={styles.button}>
            <Text style={styles.btnText}>LOGIN</Text>
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
    color: '#FFF',
    paddingHorizontal: 10,
    borderRadius: 40,
    borderWidth: 0.5,
    borderColor: '#E0E0E0',
    paddingLeft: 40
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
