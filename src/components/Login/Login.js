import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Image,
  Text,
  View,
  TextInput,
  TouchableOpacity
} from "react-native";
import LoginForm from "./LoginForm";

export default class Login extends Component {
  static navigationOptions = {
    title: "Login",
    header: null
  };
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={require("../../../assets/logo.png")}
          />
          <Text style={styles.title}>SIGN IN</Text>

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
            onPress={() => this.props.navigation.navigate("Home")}
            style={styles.button}
          >
            <Text style={styles.btnText}>LOGIN</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.signupTextCont}>
          <Text style={styles.signupText}> Don't have an account yet?</Text>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("Register")}
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
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center"
  },
  logoContainer: {
    alignItems: "center",
    flexGrow: 1,
    justifyContent: "center"
  },
  logo: {
    marginBottom: 50
  },
  title: {
    color: "#212121",
    fontSize: 30,
    marginBottom: 20
  },
  signupTextCont: {
    flexGrow: 1,
    justifyContent: "flex-end",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 50
  },
  signupText: {},
  signup: {
    fontWeight: "bold",
    color: "#0D47A1"
  },
  input: {
    width: 300,
    height: 50,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginBottom: 20,
    color: "#FFF",
    paddingHorizontal: 10,
    borderRadius: 40,
    borderWidth: 0.5,
    borderColor: "#E0E0E0",
    color: "#E0E0E0",
    paddingLeft: 40
  },
  button: {
    height: 50,
    width: 300,
    backgroundColor: "#0091EA",
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 40
  },
  btnText: {
    color: "#fff"
  }
});
