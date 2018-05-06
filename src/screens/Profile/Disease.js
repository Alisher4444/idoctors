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
  Right
} from 'native-base';

export default class Disease extends Component {
  static navigationOptions = {
    title: 'Disease"s Profile',
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
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  photo: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 50,
    width: 100,
    height: 100,
    borderRadius: 100
  },
  uinfo: {
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  name: {
    color: 'black',
    fontSize: 23
  },
  spec: {
    color: 'black',
    marginLeft: 'auto',
    marginRight: 'auto',
    fontSize: 15
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#10A1E5',
    padding: 10,
    borderRadius: 50,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 30
  },
  cardView: {
    marginTop: 50
  },
  card: {
    marginLeft: 10,
    marginRight: 10
  },
  btnText: {
    color: 'white',
    fontSize: 20
  },
  bdyText: {
    fontSize: 20
  },
  btnsBttm: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flex: 1,
    flexDirection: 'row'
  },
  call: {
    width: '50%',
    height: 50,
    alignItems: 'center',
    backgroundColor: '#27AE60',
    padding: 10
  },
  message: {
    width: '50%',
    height: 50,
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#F39C12'
  }
});
