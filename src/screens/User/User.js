import React, { Component } from 'react';
<<<<<<< HEAD
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
=======
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Image, } from 'react-native';
>>>>>>> 1ab18cf455540efa5a2f303a5480a7c671c4ee92

import {
  Icon,
  Container,
<<<<<<< HEAD
  Header,
  Content,
  Left,
  Body,
  Title,
  Thumbnail,
=======
  Content,
  Left,
  Body,
  // Thumbnail,
>>>>>>> 1ab18cf455540efa5a2f303a5480a7c671c4ee92
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
<<<<<<< HEAD
    return (
=======
    const { photo, uinfo, name, spec, button, btnText, cardView, card, bdyText,
      btnsBttm, call, message, all, det, icons, cardItem, left, content, right,
      btnTextBottom } = styles;
    return (
      
      <ScrollView>
>>>>>>> 1ab18cf455540efa5a2f303a5480a7c671c4ee92
      <Container>
        <Content
          contentContianerStyle={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
<<<<<<< HEAD
          <View
            style={{
              width: '100%',
              height: 200,
              //backgroundColor: 'rgba(16, 103, 229,0.5)',
              zIndex: 2
            }}
          >
            <Thumbnail
              large
              source={{
                uri:
                  'https://www.jamsadr.com/images/neutrals/person-donald-900x1080.jpg'
              }}
              style={styles.photo}
            />
            <View style={styles.uinfo}>
              <Text style={styles.name}>Alisher Bazarkhanov</Text>
              <Text style={styles.spec}>Developer</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.button} onPress={this.onPress}>
            <Text style={styles.btnText}> Touch Here </Text>
          </TouchableOpacity>
          <View style={styles.cardView}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Information')}
            >
              <Card style={styles.card}>
                <CardItem>
                  <Left>
                    <Icon name="bluetooth" />
                  </Left>
                  <Body>
                    <Text style={styles.bdyText}>Personal Information</Text>
                  </Body>
                  <Right>
=======
          
          <View
            style={all}
          >
            
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
                    <Icon name="account" style={icons} ios="ios-person" />
                  </Left>
                  <Body style={content}>
                    <Text style={bdyText}>Personal Information</Text>
                  </Body>
                  <Right style={right}>
>>>>>>> 1ab18cf455540efa5a2f303a5480a7c671c4ee92
                    <Icon name="arrow-forward" />
                  </Right>
                </CardItem>
              </Card>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Information')}
            >
<<<<<<< HEAD
              <Card style={styles.card}>
                <CardItem>
                  <Left>
                    <Icon name="bluetooth" />
                  </Left>
                  <Body>
                    <Text style={styles.bdyText}>Call history</Text>
                  </Body>
                  <Right>
=======
              <Card style={card}>
                <CardItem style={cardItem}>
                  <Left style={left}>
                    <Icon name="ios-time-outline" style={icons} />
                  </Left>
                  <Body style={content}>
                    <Text style={bdyText}>Call history</Text>
                  </Body>
                  <Right style={right}>
>>>>>>> 1ab18cf455540efa5a2f303a5480a7c671c4ee92
                    <Icon name="arrow-forward" />
                  </Right>
                </CardItem>
              </Card>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Information')}
            >
<<<<<<< HEAD
              <Card style={styles.card}>
                <CardItem>
                  <Left>
                    <Icon name="bluetooth" />
                  </Left>
                  <Body>
                    <Text style={styles.bdyText}>Doctor's Notes</Text>
                  </Body>
                  <Right>
=======
              <Card style={card}>
                <CardItem style={cardItem}>
                  <Left style={left}>
                    <Icon name="ios-clipboard-outline" style={icons} />
                  </Left>
                  <Body style={content}>
                    <Text style={bdyText}>Doctor's Notes</Text>
                  </Body>
                  <Right style={right}>
>>>>>>> 1ab18cf455540efa5a2f303a5480a7c671c4ee92
                    <Icon name="arrow-forward" />
                  </Right>
                </CardItem>
              </Card>
            </TouchableOpacity>
          </View>
        </Content>
<<<<<<< HEAD
        <View style={styles.btnsBttm}>
          <TouchableOpacity style={styles.call} onPress={this.onPress}>
            <Text style={styles.btnText}>  Позвонить </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.message} onPress={this.onPress}>
            <Text style={styles.btnText}> Написать </Text>
          </TouchableOpacity>
        </View>
      </Container>
=======
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
      
>>>>>>> 1ab18cf455540efa5a2f303a5480a7c671c4ee92
    );
  }
}

const styles = StyleSheet.create({
  photo: {
    marginLeft: 'auto',
    marginRight: 'auto',
<<<<<<< HEAD
    marginTop: 50,
    width: 100,
    height: 100,
    borderRadius: 50
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
=======
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
    marginBottom: 29,
  },
  name: {
    color: 'black',
    fontSize: 18,
    fontWeight: '400',
    marginTop: 19,
  },
  spec: {
    color: '#3b3b3b',
    marginLeft: 'auto',
    marginRight: 'auto',
    fontSize: 14,
    fontWeight: '300',
    marginTop: 5,
  },
  det: {
    color: '#3b3b3b',
    fontSize: 16,
    fontWeight: '300',
    marginTop: 18,
>>>>>>> 1ab18cf455540efa5a2f303a5480a7c671c4ee92
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#10A1E5',
<<<<<<< HEAD
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
=======
    padding: 14,
    borderRadius: 50,
    marginLeft: 20,
    marginRight: 20,
    shadowColor: '#fff'
  },
  cardView: {
    marginTop: 20,
  },
  card: {
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 10,
    
  },
  cardItem: {
    borderRadius: 10,
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
    fontWeight: '300',
>>>>>>> 1ab18cf455540efa5a2f303a5480a7c671c4ee92
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
<<<<<<< HEAD
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
=======
    alignItems: 'center',
    backgroundColor: '#27AE60',
    padding: 30,
  },
  message: {
    width: '50%',
    padding: 30,
    alignItems: 'center',
    backgroundColor: '#F39C12',
    
>>>>>>> 1ab18cf455540efa5a2f303a5480a7c671c4ee92
  }
});
