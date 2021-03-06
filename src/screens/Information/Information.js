import React, { Component } from 'react';
import { Text } from 'react-native';

import {
  Container,
  Header,
  Content,
  Card,
  CardItem,
  Button,
  Icon,
  Left,
  Body,
  Title,
  Right
} from 'native-base';

export default class Information extends Component {
  static navigationOptions = {
    title: 'Information',
    tabBarVisible: false
  };
  render() {
    return (
      <Container>
        <Content>
          <Card style={{ flex: 0, marginLeft: 10, marginRight: 10 }}>
            <Text
              style={{
                marginLeft: 15,
                marginTop: 15,
                fontSize: 20,
                color: 'black'
              }}
            >
              About
            </Text>
            <CardItem>
              <Body>
                <Text>Your text here</Text>
              </Body>
            </CardItem>
          </Card>
        </Content>
      </Container>
    );
  }
}
