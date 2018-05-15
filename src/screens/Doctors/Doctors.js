import React, { Component } from 'react';
<<<<<<< HEAD
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
=======
import { View, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
>>>>>>> 1ab18cf455540efa5a2f303a5480a7c671c4ee92

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
<<<<<<< HEAD
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
=======
    const { cardItemStyle, cardStyle, personalInfoStyle, nameStyle,
      time, avatarStyle, allInfoContainer,
      right, left, add } = styles;
    return (
      <Container>
        <Content
          contentContianerStyle={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            
          }}
        >
        <ScrollView>
        <View style={{ marginTop: 10 }}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('HelpDeskProfile')}
          >
            <Card style={cardStyle}>
              <CardItem style={cardItemStyle}>
                <Left style={left}>
                  <Image 
                    style={avatarStyle}
                    source={require('../../../assets/download.jpeg')}
                  />
                  
                </Left>
                <Body style={allInfoContainer}>
                    <Text style={nameStyle}>
                      Alisher Bazarkhanov
                    </Text>
                    <Text note style={personalInfoStyle}>Name of Disease</Text>
                    
                  </Body>
                  <Right style={right}> 
                    <Text style={time}>12.02.2018</Text>
                  </Right>
              </CardItem>
            </Card>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('HelpDeskProfile')}
          >
          <Card style={cardStyle}>
              <CardItem style={cardItemStyle}>
                <Left style={left}>
                  <Image 
                    style={avatarStyle}
                    source={require('../../../assets/download.jpeg')}
                  />
                  
                </Left>
                <Body style={allInfoContainer}>
                    <Text style={nameStyle}>
                      Alisher Bazarkhanov
                    </Text>
                    <Text note style={personalInfoStyle}>Name of Disease</Text>
                    
                  </Body>
                  <Right style={right}> 
                    <Text style={time}>12.02.2018</Text>
                  </Right>
>>>>>>> 1ab18cf455540efa5a2f303a5480a7c671c4ee92
              </CardItem>
            </Card>
          </TouchableOpacity>
          <TouchableOpacity
<<<<<<< HEAD
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
=======
            onPress={() => this.props.navigation.navigate('HelpDeskProfile')}
          >
          <Card style={cardStyle}>
              <CardItem style={cardItemStyle}>
                <Left style={left}>
                  <Image 
                    style={avatarStyle}
                    source={require('../../../assets/download.jpeg')}
                  />
                  
                </Left>
                <Body style={allInfoContainer}>
                    <Text style={nameStyle}>
                      Alisher Bazarkhanov
                    </Text>
                    <Text note style={personalInfoStyle}>Name of Disease</Text>
                    
                  </Body>
                  <Right style={right}> 
                    <Text style={time}>12.02.2018</Text>
                  </Right>
              </CardItem>
            </Card>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('HelpDeskProfile')}
          >
          <Card style={cardStyle}>
              <CardItem style={cardItemStyle}>
                <Left style={left}>
                  <Image 
                    style={avatarStyle}
                    source={require('../../../assets/download.jpeg')}
                  />
                  
                </Left>
                <Body style={allInfoContainer}>
                    <Text style={nameStyle}>
                      Alisher Bazarkhanov
                    </Text>
                    <Text note style={personalInfoStyle}>Name of Disease</Text>
                    
                  </Body>
                  <Right style={right}> 
                    <Text style={time}>12.02.2018</Text>
                  </Right>
>>>>>>> 1ab18cf455540efa5a2f303a5480a7c671c4ee92
              </CardItem>
            </Card>
          </TouchableOpacity>
          <TouchableOpacity
<<<<<<< HEAD
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
=======
            onPress={() => this.props.navigation.navigate('HelpDeskProfile')}
          >
          <Card style={cardStyle}>
              <CardItem style={cardItemStyle}>
                <Left style={left}>
                  <Image 
                    style={avatarStyle}
                    source={require('../../../assets/download.jpeg')}
                  />
                  
                </Left>
                <Body style={allInfoContainer}>
                    <Text style={nameStyle}>
                      Alisher Bazarkhanov
                    </Text>
                    <Text note style={personalInfoStyle}>Name of Disease</Text>
                    
                  </Body>
                  <Right style={right}> 
                    <Text style={time}>12.02.2018</Text>
                  </Right>
              </CardItem>
            </Card>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('HelpDeskProfile')}
          >
          <Card style={cardStyle}>
              <CardItem style={cardItemStyle}>
                <Left style={left}>
                  <Image 
                    style={avatarStyle}
                    source={require('../../../assets/download.jpeg')}
                  />
                  
                </Left>
                <Body style={allInfoContainer}>
                    <Text style={nameStyle}>
                      Alisher Bazarkhanov
                    </Text>
                    <Text note style={personalInfoStyle}>Name of Disease</Text>
                    
                  </Body>
                  <Right style={right}> 
                    <Text style={time}>12.02.2018</Text>
                  </Right>
>>>>>>> 1ab18cf455540efa5a2f303a5480a7c671c4ee92
              </CardItem>
            </Card>
          </TouchableOpacity>
          <TouchableOpacity
<<<<<<< HEAD
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
=======
            onPress={() => this.props.navigation.navigate('HelpDeskProfile')}
          >
          <Card style={cardStyle}>
              <CardItem style={cardItemStyle}>
                <Left style={left}>
                  <Image 
                    style={avatarStyle}
                    source={require('../../../assets/download.jpeg')}
                  />
                  
                </Left>
                <Body style={allInfoContainer}>
                    <Text style={nameStyle}>
                      Alisher Bazarkhanov
                    </Text>
                    <Text note style={personalInfoStyle}>Name of Disease</Text>
                    
                  </Body>
                  <Right style={right}> 
                    <Text style={time}>12.02.2018</Text>
                  </Right>
              </CardItem>
            </Card>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('HelpDeskProfile')}
          >
          <Card style={cardStyle}>
              <CardItem style={cardItemStyle}>
                <Left style={left}>
                  <Image 
                    style={avatarStyle}
                    source={require('../../../assets/download.jpeg')}
                  />
                  
                </Left>
                <Body style={allInfoContainer}>
                    <Text style={nameStyle}>
                      Alisher Bazarkhanov
                    </Text>
                    <Text note style={personalInfoStyle}>Name of Disease</Text>
                    
                  </Body>
                  <Right style={right}> 
                    <Text style={time}>12.02.2018</Text>
                  </Right>
              </CardItem>
            </Card>
          </TouchableOpacity>
          
          </View>
          </ScrollView>
          <TouchableOpacity style={add}>
            <Icon
              name="ios-add"
              ios="ios-add"
              android="md-add"
              style={{ fontSize: 22, fontWeight: '500', color: '#fff' }}
            />
          </TouchableOpacity>
>>>>>>> 1ab18cf455540efa5a2f303a5480a7c671c4ee92
        </Content>
      </Container>
    );
  }
}
<<<<<<< HEAD
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
  add: {
    position: 'absolute',
    bottom: 20,
    right: 10,
    backgroundColor: '#0194d6',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    width: 60,
  },
  nameStyle: {
    color: '#000',
    fontSize: 18,
    fontWeight: '400',
    marginTop: 10,
    marginBottom: 7,
    
  },
  time: {
    fontSize: 12,
    fontWeight: '300',
    color: '#019ae8'
  },
  allInfoContainer: {
    flex: 4,
    marginLeft: 20
  },
  avatarStyle: {
    width: 75,
    borderRadius: 40,
    height: 80
  },
  left: {
    flex: 2,
  },
  right: {
    flex: 2,
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
  },
  personalInfoStyle: {
    color: '#3b3b3b',
    fontSize: 14,
    fontWeight: '200',
    marginBottom: 15,
  },
});
>>>>>>> 1ab18cf455540efa5a2f303a5480a7c671c4ee92
