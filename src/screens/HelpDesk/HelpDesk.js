import React, { Component } from 'react';
<<<<<<< HEAD
import { Image, Text, Button, TouchableOpacity } from 'react-native';
=======
import { Image, Text, View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
>>>>>>> 1ab18cf455540efa5a2f303a5480a7c671c4ee92
import {
  Icon,
  Container,
  Content,
  Left,
  Body,
  Card,
  CardItem,
  Thumbnail,
  Right
} from 'native-base';

export default class HelpDesk extends Component {
  render() {
<<<<<<< HEAD
=======
    const { cardItemStyle, cardStyle, personalInfoStyle, nameStyle,
      time, avatarStyle, allInfoContainer,
      right, left, add } = styles;
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
            onPress={() => this.props.navigation.navigate('HelpDeskProfile')}
          >
            <Card style={{ flex: 0, marginLeft: 5, marginRight: 5 }}>
              <CardItem>
                <Left>
                  <Thumbnail
                    source={{
                      uri:
                        'https://www.jamsadr.com/images/neutrals/person-donald-900x1080.jpg'
                    }}
                  />
                  <Body>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        color: 'black',
                        fontSize: 14.5
                      }}
                    >
                      Alisher Alisherov
                    </Text>
                    <Text>Name of disease</Text>
                  </Body>
                </Left>
                <Right>
                  <Text style={{ color: '#30A1FF', marginBottom: 50 }}>
                    12.12.12
                  </Text>
                </Right>
=======
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
            onPress={() => this.props.navigation.navigate('Login')}
          >
            <Card style={{ flex: 0, marginLeft: 5, marginRight: 5 }}>
              <CardItem>
                <Left>
                  <Thumbnail
                    source={{
                      uri:
                        'https://www.jamsadr.com/images/neutrals/person-donald-900x1080.jpg'
                    }}
                  />
                  <Body>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        color: 'black',
                        fontSize: 14.5
                      }}
                    >
                      Alisher Alisherov
                    </Text>
                    <Text>Name of disease</Text>
                  </Body>
                </Left>
                <Right>
                  <Text style={{ color: '#30A1FF', marginBottom: 50 }}>
                    12.12.12
                  </Text>
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
            onPress={() => this.props.navigation.navigate('Login')}
          >
            <Card style={{ flex: 0, marginLeft: 5, marginRight: 5 }}>
              <CardItem>
                <Left>
                  <Thumbnail
                    source={{
                      uri:
                        'https://www.jamsadr.com/images/neutrals/person-donald-900x1080.jpg'
                    }}
                  />
                  <Body>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        color: 'black',
                        fontSize: 14.5
                      }}
                    >
                      Alisher Alisherov
                    </Text>
                    <Text>Name of disease</Text>
                  </Body>
                </Left>
                <Right>
                  <Text style={{ color: '#30A1FF', marginBottom: 50 }}>
                    12.12.12
                  </Text>
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
