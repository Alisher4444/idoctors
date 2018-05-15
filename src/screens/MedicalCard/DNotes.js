import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';

import {
  Container,
  Header,
  Content,
  Card,
  CardItem,
  Thumbnail,
  Button,
  Icon,
  Left,
  Body,
  Title,
  Right
} from 'native-base';

export default class DNotes extends Component {
  static navigationOptions = {
    title: 'Doctor`s Notes',
    tabBarVisible: false
  };
  render() {
    return (
      <Container>
        <Content>
          <Card style={{ flex: 0, marginLeft: 10, marginRight: 10 }}>
            <CardItem>
              <Left>
                <Thumbnail
                  source={{
                    uri:
                      'https://www.jamsadr.com/images/neutrals/person-donald-900x1080.jpg'
                  }}
                />
                <Body>
                  <Text>NativeBase</Text>
                  <Text note>April 15, 2016</Text>
                </Body>
              </Left>
            </CardItem>
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
