import React, { Component } from 'react';
import { Text } from 'react-native';
import {
  Icon,
  Container,
  Header,
  Content,
  Left,
  Body,
  Title
} from 'native-base';

export default class Profile extends Component {
  static navigationOptions = {
    title: 'Profile',
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
              onPress={() => this.props.navigation.navigate('Login')}
            />
          </Left>
          <Body>
            <Title>Header</Title>
          </Body>
        </Header>
        <Content
          contentContianerStyle={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Text>SettingScreen</Text>
        </Content>
      </Container>
    );
  }
}
