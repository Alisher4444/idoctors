import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image
} from 'react-native';

import {
  Icon,
  Container,
  Content,
  Left,
  Body,
  // Thumbnail,
  Card,
  CardItem,
  Right
} from 'native-base';

export default class User extends Component {
  static navigationOptions = {
    title: 'User',
    tabBarVisible: false
  };

  render() {
    const {
      photo,
      uinfo,
      name,
      spec,
      button,
      btnText,
      cardView,
      card,
      bdyText,
      btnsBttm,
      call,
      message,
      all,
      det,
      icons,
      cardItem,
      left,
      content,
      right,
      btnTextBottom
    } = styles;
    return (
      <ScrollView>
        <Container>
          <Content
            contentContianerStyle={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <View style={all}>
              <Image
                style={photo}
                source={require('../../../assets/download.jpeg')}
              />
              <View style={uinfo}>
                <Text style={name}>Alisher Bazarkhanov</Text>
                <Text style={spec}>23 years old</Text>
                <Text style={det}>last call at 12 March 12:00</Text>
              </View>
            </View>
            <TouchableOpacity style={button} onPress={this.onPress}>
              <Text style={btnText}> Next call 13 March 13:00 </Text>
            </TouchableOpacity>
            <View style={cardView}>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Information')}
              >
                <Card style={card}>
                  <CardItem style={cardItem}>
                    <Left style={left}>
                      <Icon name="account" style={icons} />
                    </Left>
                    <Body style={content}>
                      <Text style={bdyText}>Personal Information</Text>
                    </Body>
                    <Right style={right}>
                      <Icon name="arrow-forward" />
                    </Right>
                  </CardItem>
                </Card>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Information')}
              >
                <Card style={card}>
                  <CardItem style={cardItem}>
                    <Left style={left}>
                      <Icon name="ios-time-outline" style={icons} />
                    </Left>
                    <Body style={content}>
                      <Text style={bdyText}>Call history</Text>
                    </Body>
                    <Right style={right}>
                      <Icon name="arrow-forward" />
                    </Right>
                  </CardItem>
                </Card>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Information')}
              >
                <Card style={card}>
                  <CardItem style={cardItem}>
                    <Left style={left}>
                      <Icon name="ios-clipboard-outline" style={icons} />
                    </Left>
                    <Body style={content}>
                      <Text style={bdyText}>Doctor's Notes</Text>
                    </Body>
                    <Right style={right}>
                      <Icon name="arrow-forward" />
                    </Right>
                  </CardItem>
                </Card>
              </TouchableOpacity>
            </View>
          </Content>
          <View style={btnsBttm}>
            <TouchableOpacity style={call} onPress={this.onPress}>
              <Text style={btnTextBottom}>  Позвонить </Text>
            </TouchableOpacity>

            <TouchableOpacity style={message} onPress={this.onPress}>
              <Text style={btnTextBottom}> Написать </Text>
            </TouchableOpacity>
          </View>
        </Container>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  photo: {
    marginLeft: 'auto',
    marginRight: 'auto',
    width: 155,
    borderRadius: 80,
    height: 160,
    marginTop: 20
  },
  icons: {
    color: '#0199dd'
  },
  all: {
    width: '100%',
    zIndex: 2
  },
  uinfo: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 29
  },
  name: {
    color: 'black',
    fontSize: 18,
    fontWeight: '400',
    marginTop: 19
  },
  spec: {
    color: '#3b3b3b',
    marginLeft: 'auto',
    marginRight: 'auto',
    fontSize: 14,
    fontWeight: '300',
    marginTop: 5
  },
  det: {
    color: '#3b3b3b',
    fontSize: 16,
    fontWeight: '300',
    marginTop: 18
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#10A1E5',
    padding: 14,
    borderRadius: 50,
    marginLeft: 20,
    marginRight: 20,
    shadowColor: '#fff'
  },
  cardView: {
    marginTop: 20
  },
  card: {
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 10
  },
  cardItem: {
    borderRadius: 10
  },
  left: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 10
  },
  content: {
    flex: 5,
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderLeftWidth: 1,
    borderLeftColor: '#d6d6d6',
    paddingLeft: 20
  },
  right: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '300'
  },
  btnTextBottom: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500'
  },
  bdyText: {
    color: '#3b3b3b',
    fontSize: 14,
    fontWeight: '300'
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
    alignItems: 'center',
    backgroundColor: '#27AE60',
    padding: 30
  },
  message: {
    width: '50%',
    padding: 30,
    alignItems: 'center',
    backgroundColor: '#F39C12'
  }
});
