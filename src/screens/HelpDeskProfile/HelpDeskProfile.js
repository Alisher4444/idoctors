import React, { Component } from 'react';
<<<<<<< HEAD
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
=======
import { Text, ScrollView, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
>>>>>>> 1ab18cf455540efa5a2f303a5480a7c671c4ee92

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

export default class HelpDeskProfile extends Component {
  static navigationOptions = {
    title: 'Profile',
    tabBarVisible: false
  };
  render() {
<<<<<<< HEAD
    return (
=======
    const { photo, uinfo, name, spec, button, btnText, cardView, card, bdyHead,
      bdyText, all, det, cardItem, need } = styles;
    return (
      
      <ScrollView>
>>>>>>> 1ab18cf455540efa5a2f303a5480a7c671c4ee92
      <Container>
        <Content
          contentContianerStyle={{
            flex: 1,
            alignItems: 'center',
<<<<<<< HEAD
            justifyContent: 'center'
          }}
        >
          <View
            style={{
              width: '100%',
              height: 250,
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
              <Text style={styles.spec}>Name of disease</Text>
              <Text style={styles.money}>Need: 500,000тг</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.button} onPress={this.onPress}>
            <Text style={styles.btnText}> Touch Here </Text>
          </TouchableOpacity>
          <Card
            style={{ flex: 0, marginLeft: 10, marginRight: 10, marginTop: 20 }}
          >
            <CardItem
              style={{
                borderBottomColor: '#ccc',
                borderBottomWidth: 1
              }}
            >
              <Body>
                <Text style={{ fontSize: 20, color: 'black' }}> About</Text>
              </Body>
            </CardItem>
            <CardItem>
              <Body>
                <Text style={{ fontSize: 15, color: 'black' }}>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                  specimen book.{' '}
                </Text>
              </Body>
            </CardItem>
          </Card>
          <Card
            style={{ flex: 0, marginLeft: 10, marginRight: 10, marginTop: 20 }}
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
                  Contact Information
                </Text>
              </Body>
            </CardItem>
            <CardItem>
              <Body>
                <Text
                  style={{ fontSize: 15, color: 'black', marginBottom: 10 }}
                >
                  +7(777) 890-76-56
                </Text>
                <Text
                  style={{ fontSize: 15, color: 'black', marginBottom: 10 }}
                >
                  +7(707) 913-13-44
                </Text>
                <Text
                  style={{ fontSize: 15, color: 'black', marginBottom: 10 }}
                >
                  developer@gmail.com
                </Text>
              </Body>
            </CardItem>
          </Card>
        </Content>
      </Container>
=======
            justifyContent: 'center',
            
          }}
        >
          
          <View
            style={all}
          >
            <Image 
               style={photo}
              source={require('../../../assets/download.jpeg')}
            />
            <View style={uinfo}>
              <Text style={name}>Alisher Bazarkhanov</Text>
              <Text style={spec}>Name of Disease</Text>
              <Text style={det}><Text style={need}>Need:</Text> 500 000тг.</Text>
            </View>
            </View>
          <TouchableOpacity style={button} onPress={this.onPress}>
            <Text style={btnText}> Donate. Now 345 000/500 000 тг.</Text>
          </TouchableOpacity>
          <View style={cardView}>
              <Card style={card}>
                <CardItem style={cardItem}>
                  <Text style={bdyHead}>About</Text>
                  <Text style={bdyText}>Lorem Ipsum is simply dummy text of the printing and
                     typesetting industry. Lorem Ipsum has been the industry's standard
                      dummy text ever since the 1500s, when an unknown printer took a galley
                       of type and scrambled it to make a type specimen book. </Text>
                </CardItem>
              </Card>
            
              <Card style={card}>
                <CardItem style={cardItem}>
                <Text style={bdyHead}>Contact Information</Text>
                
                <Text style={bdyText}>+ 7 777 890 76 56</Text>
                 <Text style={bdyText}>+7 701 678 90 87</Text>
                 <Text style={bdyText}> example@gmail.com</Text>
                </CardItem>
              </Card>
            
          </View>
        </Content>
       
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
    backgroundColor: '#1EBE36',
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
  },
  money: {
    color: 'green',
    marginLeft: 'auto',
    marginRight: 'auto',
    fontSize: 15
  }
=======
    width: 155,
    borderRadius: 80,
    height: 160,
    marginTop: 20
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
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#4caf50',
    padding: 14,
    borderRadius: 50,
    marginLeft: 20,
    marginRight: 20,
    shadowColor: '#fff'
  },
  cardView: {
    marginTop: 20,
    marginBottom: 40
  },
  card: {
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 10,
    
  },
  cardItem: {
    borderRadius: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  btnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '300'
  },
  bdyHead: {
    color: '#000',
    fontSize: 18,
    fontWeight: '400',
    marginBottom: 15
  },
  bdyText: {
    color: '#3b3b3b',
    fontSize: 12,
    fontWeight: '200',
    marginBottom: 10
  },
>>>>>>> 1ab18cf455540efa5a2f303a5480a7c671c4ee92
});
