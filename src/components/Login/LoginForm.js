import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Text,
  View
} from "react-native";

export default class LoginForm extends Component {
  render() {
    return (
      <View style={styles.container}>
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
          onPress={() => this.props.navigation.navigate("SettingScreen")}
          style={styles.button}
        >
          <Text style={styles.btnText}>LOGIN</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    padding: 20
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
    backgroundColor: "#0091EA",
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 40
  },
  btnText: {
    color: "#fff"
  }
});
