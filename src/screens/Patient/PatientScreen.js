import React, { Component } from 'react';
import { Image, Text, TouchableOpacity } from 'react-native';
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

export default class PatientScreen extends Component {
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
                  </Body>
                </Left>
              </CardItem>
            </Card>
          </TouchableOpacity>
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
