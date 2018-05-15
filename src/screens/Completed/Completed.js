import React, { Component } from 'react';
import { Image, ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import {
  Icon,
  Container,
  Content,
  Left,
  Body,
  Card,
  CardItem,
  Thumbnail
} from 'native-base';

export default class Completed extends Component {
  static navigationOptions = {
    title: 'Completed',

    drawerIcon: (
      <Image
        source={require('../../../assets/home.png')}
        style={{ height: 24, width: 24 }}
      />
    )
  };
  render() {
    const { cardItemStyle, cardStyle, personalInfoStyle, nameStyle,
      detailedInfoStyle, detailedContainerStyle, avatarStyle, allInfoContainer,
      statusText, statusContainer } = styles;
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
            onPress={() => this.props.navigation.navigate('AppointmentDetails')}
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
              <View style={statusContainer}>
                  <Text style={statusText}>12 April, Monday, 12:00</Text>
                </View>
            </Card>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('AppointmentDetails')}
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
            <View style={statusContainer}>
                  <Text style={statusText}>12 April, Monday, 12:00</Text>
                </View>
          </Card>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('AppointmentDetails')}
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
            <View style={statusContainer}>
                  <Text style={statusText}>12 April, Monday, 12:00</Text>
                </View>
          </Card>
          </TouchableOpacity>
          </View>
          </ScrollView>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  cardStyle: {
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 5
  },
  statusContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#dddddd',
    paddingTop: 10,
    paddingBottom: 10
  },
  statusText: {
    fontSize: 14,
    fontWeight: '300',
    color: '#019ae8'
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
