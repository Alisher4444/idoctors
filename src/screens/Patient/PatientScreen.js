import React, { Component } from 'react';
<<<<<<< HEAD
import { Image, Text, TouchableOpacity } from 'react-native';
=======
import { Image, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
>>>>>>> 1ab18cf455540efa5a2f303a5480a7c671c4ee92
import {
  Icon,
  Container,
  Content,
  Left,
  Body,
  Card,
  CardItem,
<<<<<<< HEAD
  Thumbnail
=======
  // Thumbnail
>>>>>>> 1ab18cf455540efa5a2f303a5480a7c671c4ee92
} from 'native-base';

export default class PatientScreen extends Component {
  render() {
<<<<<<< HEAD
=======
    const { cardItemStyle, cardStyle, personalInfoStyle, nameStyle,
      detailedInfoStyle, detailedContainerStyle, avatarStyle, allInfoContainer } = styles;
>>>>>>> 1ab18cf455540efa5a2f303a5480a7c671c4ee92
    return (
      <Container>
        <Content
          contentContianerStyle={{
            flex: 1,
            alignItems: 'center',
<<<<<<< HEAD
            justifyContent: 'center'
          }}
        >
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('User')}
          >
            <Card style={{ marginLeft: 20, marginRight: 20, marginTop: 20 }}>
              <CardItem>
                <Left>
                  <Thumbnail
                    source={{
                      uri:
                        'https://www.jamsadr.com/images/neutrals/person-donald-900x1080.jpg'
                    }}
                  />
                  <Body>
                    <Text style={{ fontSize: 20, color: 'black' }}>
                      Alisher Bazarkhanov
                    </Text>
                    <Text note>23 year old</Text>
                    <Text note>
                      <Icon
                        name="alarm"
                        ios="ios-alarm"
                        android="md-alarm"
                        style={{ fontSize: 20, color: '#ccc' }}
                      />23 year old
                    </Text>
=======
            justifyContent: 'center',
            
          }}
        >
        <ScrollView>
        <View style={{ marginTop: 10 }}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('User')}
          >
            <Card style={cardStyle}>
              <CardItem style={cardItemStyle}>
                <Left>
                  <Image 
                    style={avatarStyle}
                    source={require('../../../assets/download.jpeg')}
                  />
                  <Body style={allInfoContainer}>
                    <Text style={nameStyle}>
                      Alisher Bazarkhanov
                    </Text>
                    <Text note style={personalInfoStyle}>23 year old</Text>
                    <View style={detailedContainerStyle}>
                      <Icon
                        name="clock"
                        ios="ios-clock"
                        android="md-clock"
                        style={{ fontSize: 20, color: '#ccc' }}
                      />
                      <Text note style={detailedInfoStyle}>last call 12 March 12:00</Text>
                    </View>
>>>>>>> 1ab18cf455540efa5a2f303a5480a7c671c4ee92
                  </Body>
                </Left>
              </CardItem>
            </Card>
          </TouchableOpacity>
<<<<<<< HEAD
          <Card style={{ marginLeft: 20, marginRight: 20, marginTop: 20 }}>
            <CardItem>
              <Left>
                <Thumbnail
                  source={{
                    uri:
                      'https://www.jamsadr.com/images/neutrals/person-donald-900x1080.jpg'
                  }}
                />
                <Body>
                  <Text style={{ fontSize: 20, color: 'black' }}>
                    Alisher Bazarkhanov
                  </Text>
                  <Text note>23 year old</Text>
                  <Text note>
                    <Icon
                      name="alarm"
                      ios="ios-alarm"
                      android="md-alarm"
                      style={{ fontSize: 20, color: '#ccc' }}
                    />23 year old
                  </Text>
                </Body>
              </Left>
            </CardItem>
          </Card>
          <Card style={{ marginLeft: 20, marginRight: 20, marginTop: 20 }}>
            <CardItem>
              <Left>
                <Thumbnail
                  source={{
                    uri:
                      'https://www.jamsadr.com/images/neutrals/person-donald-900x1080.jpg'
                  }}
                />
                <Body>
                  <Text style={{ fontSize: 20, color: 'black' }}>
                    Alisher Bazarkhanov
                  </Text>
                  <Text note>23 year old</Text>
                  <Text note>
                    <Icon
                      name="alarm"
                      ios="ios-alarm"
                      android="md-alarm"
                      style={{ fontSize: 20, color: '#ccc' }}
                    />23 year old
                  </Text>
                </Body>
              </Left>
            </CardItem>
          </Card>
=======
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('User')}
          >
          <Card style={cardStyle}>
            <CardItem style={cardItemStyle}>
              <Left>
                
                  <Image 
                    style={avatarStyle}
                    source={require('../../../assets/kkk.jpg')}
                  />
                <Body style={allInfoContainer}>
                    <Text style={nameStyle}>
                      Alisher Bazarkhanov
                    </Text>
                    <Text note style={personalInfoStyle}>23 year old</Text>
                    <View style={detailedContainerStyle}>
                      <Icon
                        name="clock"
                        ios="ios-clock"
                        android="md-clock"
                        style={{ fontSize: 20, color: '#ccc' }}
                      />
                      <Text note style={detailedInfoStyle}>last call 12 March 12:00</Text>
                    </View>
                  </Body>
              </Left>
            </CardItem>
          </Card>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('User')}
          >
          <Card style={cardStyle}>
            <CardItem style={cardItemStyle}>
              <Left>
                
                  <Image 
                    style={avatarStyle}
                    source={require('../../../assets/download.jpeg')}
                  />
                <Body style={allInfoContainer}>
                    <Text style={nameStyle}>
                      Alisher Bazarkhanov
                    </Text>
                    <Text note style={personalInfoStyle}>23 year old</Text>
                    <View style={detailedContainerStyle}>
                      <Icon
                        name="clock"
                        ios="ios-clock"
                        android="md-clock"
                        style={{ fontSize: 20, color: '#ccc' }}
                      />
                      <Text note style={detailedInfoStyle}>last call 12 March 12:00</Text>
                    </View>
                  </Body>
              </Left>
            </CardItem>
          </Card>
          </TouchableOpacity>
          </View>
          </ScrollView>
>>>>>>> 1ab18cf455540efa5a2f303a5480a7c671c4ee92
        </Content>
      </Container>
    );
  }
}
<<<<<<< HEAD
/*
<Image source={require('../../assets/kkk.jpg')} style={{height:80, width:80, borderRadius:100}}/>
<Text style={{marginLeft:10,marginBottom:30,fontSize:20,color:'black'}}>
    Alisher Bazarkhanov
</Text>
<Text style={{position:'relative',right:180,top:10}}>
  23 year old
</Text>
<Icon */
=======

const styles = StyleSheet.create({
  cardStyle: {
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 5
  },
  cardItemStyle: {
    borderRadius: 5
  },
  nameStyle: {
    color: '#000',
    fontSize: 18,
    fontWeight: '400',
    marginTop: 10,
    marginBottom: 7,
    
  },
  allInfoContainer: {
    flex: 6,
  },
  avatarStyle: {
    flex: 2,
    width: 85,
    borderRadius: 40,
    height: 80
  },
  personalInfoStyle: {
    color: '#3b3b3b',
    fontSize: 14,
    fontWeight: '200',
    marginBottom: 15,
  },
  detailedContainerStyle: {
    flex: 1,
    flexDirection: 'row'
  },
  detailedInfoStyle: {
    color: '#3b3b3b',
    fontSize: 14,
    fontWeight: '300',
    marginLeft: 7,
    marginBottom: 10
  }
});
>>>>>>> 1ab18cf455540efa5a2f303a5480a7c671c4ee92
