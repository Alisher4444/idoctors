import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';

import {
  Icon,
  Container,
  Header,
  Content,
  Left,
  Body,
  Title,
  Thumbnail,
  Card,
  CardItem,
  Right,
  Button
} from 'native-base';

export default class Disease extends Component {
  static navigationOptions = {
    title: 'Disease"s Profile',
    tabBarVisible: false
  };
  render() {
    return (
      <Container>
        <Content
          contentContianerStyle={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <View
            style={{
              width: '100%',
              height: '100%',
              //backgroundColor: 'rgba(16, 103, 229,0.5)',
              zIndex: 2
            }}
          >
            <Card
              style={{
                flex: 0,
                marginLeft: 10,
                marginRight: 10,
                marginTop: 20
              }}
            >
              <CardItem
                style={{
                  borderBottomColor: '#ccc',
                  borderBottomWidth: 1
                }}
              >
                <Body>
                  <Text style={{ fontSize: 20, color: 'black' }}>
                    {' '}
                    Indigestion
                  </Text>
                </Body>
              </CardItem>
              <CardItem
                style={{
                  borderBottomColor: '#ccc',
                  borderBottomWidth: 1
                }}
              >
                <Body>
                  <Text style={{ fontSize: 15, color: 'black' }}>
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a
                    type specimen book.{' '}
                  </Text>
                </Body>
              </CardItem>
              <CardItem
                style={{
                  borderBottomColor: '#ccc',
                  borderBottomWidth: 1
                }}
              >
                <Body>
                  <Text style={{ fontSize: 20, color: 'black' }}>
                    {' '}
                    Symptoms
                  </Text>
                </Body>
              </CardItem>
              <CardItem>
                <Body>
                  <Text style={{ fontSize: 15, color: 'black' }}>
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a
                    type specimen book.{' '}
                  </Text>
                </Body>
              </CardItem>
            </Card>

            <Text
              style={{
                marginLeft: 10,
                fontSize: 25,
                color: 'black',
                marginTop: 30
              }}
            >
              Specialist
            </Text>
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
          </View>
        </Content>
      </Container>
    );
  }
}
