import React, { Component } from 'react';
import { Text, ScrollView, View, StyleSheet, TouchableOpacity, Image } from 'react-native';

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
    const { photo, uinfo, name, spec, button, btnText, cardView, card, bdyHead,
      bdyText, all, det, cardItem, need } = styles;
    return (
      
      <ScrollView>
      <Container>
        <Content
          contentContianerStyle={{
            flex: 1,
            alignItems: 'center',
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
});
