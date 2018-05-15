import React, { Component } from 'react';
import {
  StyleSheet,
<<<<<<< HEAD
  Image,
  Text,
  View,
  TextInput,
  TouchableOpacity
} from 'react-native';

export default class Doctors extends Component {
=======
  Text,
  View,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { Button, Input } from '../../commons';

class Login extends Component {
>>>>>>> 1ab18cf455540efa5a2f303a5480a7c671c4ee92
  static navigationOptions = {
    title: 'Login',
    header: null
  };
  render() {
<<<<<<< HEAD
    return (
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={require('../../../assets/logo.png')}
          />
          <Text style={styles.title}>Doctors Sign In</Text>

          <TextInput
            placeholder="Username"
            placeholderTextColor="#E0E0E0"
            style={styles.input}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#E0E0E0"
            style={styles.input}
          />
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Home')}
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
=======
    const { resetContainer, container, title, 
      questionText, link, signupTextCont, contentContainer } = styles;
    return (
      <View style={container}>
        <ScrollView 
        contentContainerStyle={contentContainer}
        >
            <Text style={title}>SIGN IN</Text>
            <Input 
            placeholder="Phone Number"
            label={require('../../../assets/telephone.png')} 
            placeholderTextColor={'#c1c1c1'}
            height={70}
            width={70}
            />
            <Input 
            placeholder="Password"
            label={require('../../../assets/pas.png')}
            height={65}
            width={50}
            />
            <View style={resetContainer}>
              <Text style={questionText}>Forget Password?</Text>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('Home')} >
              <Text style={link}>Reset it</Text></TouchableOpacity>
            </View>
            <Button
              onPress={() => this.props.navigation.navigate('Home')}
            >
              SIGN IN
            </Button>
           
        </ScrollView>
        <View style={signupTextCont}>
              <Text style={questionText}> Don't have an account yet?</Text>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Register')}
              >
                <Text style={link}> SignUp </Text>
              </TouchableOpacity>
          </View>
      </View>
      
>>>>>>> 1ab18cf455540efa5a2f303a5480a7c671c4ee92
    );
  }
}
const styles = StyleSheet.create({
  container: {
<<<<<<< HEAD
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
=======
    backgroundColor: '#fff',
    flex: 1,
    position: 'relative',
  },
  title: {
    fontSize: 30,
    fontWeight: '600',
    marginBottom: 50,
    marginTop: 100,
    alignSelf: 'center'
  },
  contentContainer: {
    
  
  },
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
    paddingBottom: 20,
    
  }
});
export default Login;
>>>>>>> 1ab18cf455540efa5a2f303a5480a7c671c4ee92
