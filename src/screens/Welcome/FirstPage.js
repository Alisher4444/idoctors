import React, { Component } from 'react';
import { StyleSheet, Image, Text, View, TouchableOpacity } from 'react-native';
import { Pages } from 'react-native-pages';

export default class FirstPage extends Component {
  static navigationOptions = {
    title: 'Welcome',
    header: null
  };
  render() {
    return (
      <Pages>
        <View style={styles.container}>
          <Image
            source={require('../../../assets/doc.png')}
            style={styles.image}
          />
          <Text style={styles.text}> Hello, Welcome to iDoctor</Text>
        </View>
        <View style={styles.container1}>
          <Image
            source={require('../../../assets/doc.png')}
            style={styles.image}
          />
          <Text style={styles.text}> Hello, Welcome to iDoctor</Text>
        </View>
        <View style={styles.container2}>
          <Image
            source={require('../../../assets/doc.png')}
            style={styles.image}
          />
          <Text style={styles.text}> Hello, Welcome to iDoctor</Text>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Switch')}
            style={styles.button}
          >
            <Text style={styles.btnText}>START</Text>
          </TouchableOpacity>
        </View>
      </Pages>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0D47A1',
    width: '100%',
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container1: {
    backgroundColor: 'green',
    width: '100%',
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container2: {
    backgroundColor: 'orange',
    width: '100%',
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 30,
    color: 'white',
    fontWeight: '700',
    textAlign: 'center'
  },
  image: {
    width: 100,
    height: 200
  },
  button: {
    width: 200,
    height: 60,
    backgroundColor: '#5cacee',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    position: 'absolute',
    bottom: 100
  },
  btnText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700'
  }
});
