import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';

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
    title: 'Appointment Details',
    tabBarVisible: false
  };
  render() {
    const { avatarStyle, cardStyle, cardItemStyle, specItemStyle,
      orderHead, all, consultationHead, consultationPrice, name,
      spec, left, body, right, time, timeTxt } = styles;
    return (
      <ScrollView>
      <Container>
        <Content>
          <View style={all}>
          <Card style={cardStyle}>
            <CardItem style={cardItemStyle}>
              <Left style={left}>
                <Image 
                  style={avatarStyle}
                  source={require('../../../assets/kkk.jpg')}
                />
                
              </Left>
              <Body style={body}>
                  <Text style={name}>Beverly Mash</Text>
                  <Text style={spec} note>Speciality</Text>
                </Body>
              <Right style={right}>
                <Button transparent textStyle={{ color: '#87838B' }}>
                  <Icon style={{ color: '#3d83c4' }} name="ios-star-outline" />
                  <Text style={{ color: '#3d83c4', marginLeft: 5 }}>5.0</Text>
                </Button>
              </Right>
            </CardItem>
          </Card>
          <Card style={cardStyle}>
            <CardItem style={cardItemStyle}>
              <Left style={time}>
                <Icon
                  style={{ marginRight: 10, marginLeft: 15 }}
                  name="calendar"
                />

                
              </Left>
              <Right style={timeTxt}>
              
                  <Text>Jan 1, 2018</Text>
                
                </Right>
            </CardItem>
          </Card>
          <Card style={cardStyle}>
            <CardItem style={cardItemStyle}>
              <Left style={time}>
                <Icon
                  style={{ 
                    marginRight: 10,
                    marginLeft: 15 }}
                    name="clock"
                />

               
              </Left>
              <Right style={timeTxt}>
                  <Text>12:00AM - 02:30PM</Text>
                </Right>
            </CardItem>
          </Card>
          <Card style={cardStyle}>
            <CardItem
              style={specItemStyle}
            >
              <Body>
                <Text style={orderHead}> Order Services</Text>
              </Body>
            </CardItem>
            <CardItem style={cardItemStyle}>
              <Left>
                <Body>
                  <Text style={consultationHead}>Consultation</Text>
                </Body>
              </Left>
              <Right>
                <Button transparent textStyle={{ color: '#87838B' }}>
                  <Text style={consultationPrice}>1,926 $</Text>
                </Button>
              </Right>
            </CardItem>
          </Card>
          </View>
        </Content>
      </Container>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  avatarStyle: {
    width: 55,
    borderRadius: 30,
    height: 60
  },
  time: {
    borderRightWidth: 1,
    borderRightColor: '#d6d6d6',
    flex: 1,
  },
  timeTxt: {
    flex: 5,
    alignItems: 'flex-start',
    paddingLeft: 10
  },
  right: {
    flex: 2,
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  left: {
    flex: 1
  },
  body: {
    flex: 5,
    paddingLeft: 40
  },
  orderHead: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000'
  },
  all: {
    marginTop: 20
  },
  spec: {
    fontSize: 14,
    fontWeight: '300',
    color: '#3b3b3b',
    marginTop: 7
  },
  name: {
    fontSize: 18,
    fontWeight: '400',
    color: '#000',
  },
  cardStyle: {
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 10,
    marginBottom: 15,
  },
  consultationHead: {
    fontSize: 16,
    color: '#3b3b3b',
    fontWeight: '200'
  },
  consultationPrice: {
    fontSize: 16,
    color: '#3b3b3b',
    fontWeight: '300'
  },
  cardItemStyle: {
    borderRadius: 10
  },
  specItemStyle: {
    borderRadius: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1
  }
});
