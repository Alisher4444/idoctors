import React, { Component } from 'react';
import { StyleSheet, Image, Text, View, TouchableOpacity } from 'react-native';

export default class Switch extends Component {
  static navigationOptions = {
    title: 'Switch',
    header: null
  };
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={require('../../../assets/logo.png')}
          />
          <Text style={styles.title}>WHO YOU ARE</Text>
          <View style={styles.container}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Login')}
              style={styles.button}
            >
              <Text style={styles.btnText}>DOCTOR</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.btnText}>PATIENT</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.containerForm} />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  logoContainer: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
    marginTop: 80
  },
  logo: {
    marginBottom: 50
  },
  title: {
    color: '#212121',
    fontSize: 30,
    marginBottom: 20
  },
  button: {
    marginBottom: 10,
    width: 350,
    height: 60,
    backgroundColor: '#0091EA',
    paddingVertical: 17,
    borderRadius: 50
  },
  btnText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18
  }
});
