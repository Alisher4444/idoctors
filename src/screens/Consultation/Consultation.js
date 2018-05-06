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
  Right,
  Thumbnail
} from 'native-base';

export default class Consultation extends Component {
  static navigationOptions = {
    title: 'Canceled',
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
          <TouchableOpacity
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
          <TouchableOpacity
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
