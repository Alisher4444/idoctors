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

export default class AppointmentDetails extends Component {
  static navigationOptions = {
    title: 'Review',
    tabBarVisible: false,
    header: null
  };
  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent>
              <Icon name="menu" />
            </Button>
          </Left>
          <Body>
            <Title style={{ alignItems: 'center' }}>Review</Title>
          </Body>
          <Right />
        </Header>
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
              <Right>
                <Button transparent textStyle={{ color: '#87838B' }}>
                  <Icon name="heart" />
                  <Text>1,926 stars</Text>
                </Button>
              </Right>
            </CardItem>
          </Card>
          <Card style={{ flex: 0, marginLeft: 10, marginRight: 10 }}>
            <CardItem>
              <Left>
                <Icon
                  style={{ margin: 5, marginRight: 30, marginLeft: 15 }}
                  name="calendar"
                />

                <Body>
                  <Text>Jan 1, 2018</Text>
                </Body>
              </Left>
            </CardItem>
          </Card>
          <Card style={{ flex: 0, marginLeft: 10, marginRight: 10 }}>
            <CardItem>
              <Left>
                <Icon
                  style={{ margin: 5, marginRight: 30, marginLeft: 15 }}
                  name="clock"
                />

                <Body>
                  <Text>12:00AM - 02:30PM</Text>
                </Body>
              </Left>
            </CardItem>
          </Card>
          <Card style={{ flex: 0, marginLeft: 10, marginRight: 10 }}>
            <CardItem
              style={{
                borderBottomColor: '#ccc',
                borderBottomWidth: 1
              }}
            >
              <Body>
                <Text style={{ fontSize: 20 }}> Order Services</Text>
              </Body>
            </CardItem>
            <CardItem>
              <Left>
                <Body>
                  <Text style={{ fontSize: 18 }}>NativeBase</Text>
                </Body>
              </Left>
              <Right>
                <Button transparent textStyle={{ color: '#87838B' }}>
                  <Text style={{ fontSize: 18 }}>1,926 $</Text>
                </Button>
              </Right>
            </CardItem>
          </Card>
        </Content>
      </Container>
    );
  }
}
