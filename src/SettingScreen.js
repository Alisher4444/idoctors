import React, { Component } from "react";
import { Platform, StyleSheet, Image, Text, View } from "react-native";
import {
  Icon,
  Button,
  Container,
  Header,
  Content,
  Left,
  Body,
  Title
} from "native-base";

export default class SettingScreen extends Component {
  static navigationOptions = {
    drawerIcon: (
      <Image
        source={require("../assets/home.png")}
        style={{ height: 24, width: 24 }}
      />
    )
  };
  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Icon
              name="menu"
              onPress={() => this.props.navigation.navigate("DrawerOpen")}
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
