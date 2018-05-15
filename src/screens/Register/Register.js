import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
<<<<<<< HEAD
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
=======
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { Button, Input } from '../../commons';

class Login extends Component {
  static navigationOptions = {
    title: 'Login',
    header: null
  };
  render() {
    const { resetContainer, container, title, 
      questionText, link, signupTextCont, contentContainer } = styles;
    return (
      <View style={container}>
        <ScrollView 
        contentContainerStyle={contentContainer}
        >
            <Text style={title}>SIGN UP</Text>
            <Input 
            placeholder="Last Name"
            label={require('../../../assets/user.png')} 
            placeholderTextColor={'#c1c1c1'}
            height={70}
            width={70}
            />
            <Input 
            placeholder="First Name"
            label={require('../../../assets/user.png')} 
            placeholderTextColor={'#c1c1c1'}
            height={70}
            width={70}
            />
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
            
            <Button
              onPress={() => this.props.navigation.navigate('Home')}
            >
              SIGN UP
            </Button>
           
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
