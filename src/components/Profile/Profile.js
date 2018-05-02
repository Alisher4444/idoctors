import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Image,
  Text,
  View,
  TouchableOpacity
} from "react-native";
import {
  Icon,
  Button,
  Container,
  Header,
  Content,
  Left,
  Body,
  Title,
  Card,
  CardItem
} from "native-base";

export default class Profile extends Component {
  static navigationOptions = {
    title: "Profile",
    tabBarVisible: false,
    header: null
  };
  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Icon
              name="arrow-back"
              onPress={() => this.props.navigation.navigate("Login")}
            />
          </Left>
          <Body>
            <Title>Header</Title>
          </Body>
        </Header>
        <Content
          contentContianerStyle={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Text>SettingScreen</Text>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  logoContainer: {
    alignItems: "center",
    flexGrow: 1,
    justifyContent: "center",
    marginTop: 80
  },
  logo: {
    marginBottom: 50
  },
  title: {
    color: "#212121",
    fontSize: 25,
    marginBottom: 20
  },
  button: {
    marginBottom: 10,
    width: 350,
    height: 60,
    backgroundColor: "#0091EA",
    paddingVertical: 17,
    borderRadius: 50
  },
  btnText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 18
  }
});
