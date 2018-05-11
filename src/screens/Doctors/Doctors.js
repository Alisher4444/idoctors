import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';

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
  Right,
  Text
} from 'native-base';

export default class Doctors extends Component {
  static navigationOptions = {
    title: 'Doctors',
    header: null,
    drawerIcon: (
      <Image
        source={require('../../../assets/home.png')}
        style={{ height: 24, width: 24 }}
      />
    )
  };
  render() {
    return (
      <Container>
        <Content>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('DoctorProfile')}
            textStyle={{ color: '#87838B' }}
          >
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
                    <Text>April 15, 2016</Text>
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
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('DoctorProfile')}
            textStyle={{ color: '#87838B' }}
          >
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
                    <Text>April 15, 2016</Text>
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
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('DoctorProfile')}
            textStyle={{ color: '#87838B' }}
          >
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
                    <Text>April 15, 2016</Text>
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
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('DoctorProfile')}
            textStyle={{ color: '#87838B' }}
          >
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
                    <Text>April 15, 2016</Text>
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
          </TouchableOpacity>
        </Content>
      </Container>
    );
  }
}
