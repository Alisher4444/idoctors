import React, { Component } from 'react';
import { Image, Text, TouchableOpacity } from 'react-native';
import {
  Icon,
  Container,
  Content,
  Left,
  Body,
  Card,
  CardItem
} from 'native-base';

export default class PatientScreen extends Component {
  static navigationOptions = {
    title: 'My patients',
    header: null,
    drawerIcon: (
      <Image
        source={require('../../../assets/home.png')}
        style={{ height: 24, width: 24 }}
      />
    )
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
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('DrawerOpen')}
          >
            <Card style={{ marginLeft: 20, marginRight: 20, marginTop: 20 }}>
              <CardItem>
                <Left>
                  <Image
                    source={require('../../../assets/kkk.jpg')}
                    style={{ height: 80, width: 80, borderRadius: 100 }}
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
          </TouchableOpacity>
          <Card style={{ marginLeft: 20, marginRight: 20, marginTop: 20 }}>
            <CardItem>
              <Left>
                <Image
                  source={require('../../../assets/kkk.jpg')}
                  style={{ height: 80, width: 80, borderRadius: 100 }}
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
                <Image
                  source={require('../../../assets/kkk.jpg')}
                  style={{ height: 80, width: 80, borderRadius: 100 }}
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
        </Content>
      </Container>
    );
  }
}
/*
<Image source={require('../../assets/kkk.jpg')} style={{height:80, width:80, borderRadius:100}}/>
<Text style={{marginLeft:10,marginBottom:30,fontSize:20,color:'black'}}>
    Alisher Bazarkhanov
</Text>
<Text style={{position:'relative',right:180,top:10}}>
  23 year old
</Text>
<Icon */
