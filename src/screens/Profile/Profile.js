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

export default class Profile extends Component {
  static navigationOptions = {
    title: 'Profile',
    tabBarVisible: false
  };
  render() {
    return (
      <Container>
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
              <Text style={styles.spec}>Doctor</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.button} onPress={this.onPress}>
            <Text style={styles.btnText}> Book Appointment </Text>
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
                    <Icon name="arrow-forward" />
                  </Right>
                </CardItem>
              </Card>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Review')}
            >
              <Card style={styles.card}>
                <CardItem>
                  <Left>
                    <Icon name="bluetooth" />
                  </Left>
                  <Body>
                    <Text style={styles.bdyText}>Review</Text>
                  </Body>
                  <Right>
                    <Icon name="arrow-forward" />
                  </Right>
                </CardItem>
              </Card>
            </TouchableOpacity>
          </View>
        </Content>
        <View style={styles.btnsBttm}>
          <TouchableOpacity style={styles.call} onPress={this.onPress}>
            <Text style={styles.btnText}>  Позвонить </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.message} onPress={this.onPress}>
            <Text style={styles.btnText}> Написать </Text>
          </TouchableOpacity>
        </View>
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
    fontSize: 15
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
