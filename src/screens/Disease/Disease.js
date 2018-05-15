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
  Grid,
  Col
} from 'native-base';

export default class Disease extends Component {
  static navigationOptions = {
    title: 'Disease',
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
        <Content>
          <Grid>
            <Col style={{ height: 200, padding: 10 }}>
              <TouchableOpacity
                style={{ height: 200 }}
                onPress={() => this.props.navigation.navigate('DiseaseProfile')}
              >
                <Card style={{ borderRadius: 10 }}>
                  <CardItem style={{ borderRadius: 10 }}>
                    <Body>
                      <Image
                        source={require('../../../assets/home.png')}
                        style={{
                          height: 100,
                          width: 100,
                          marginLeft: 'auto',
                          marginRight: 'auto'
                        }}
                      />
                      <Text
                        style={{
                          fontSize: 20,
                          color: 'black',
                          marginLeft: 'auto',
                          marginRight: 'auto'
                        }}
                      >
                        Alisher
                      </Text>
                    </Body>
                  </CardItem>
                </Card>
              </TouchableOpacity>
            </Col>

            <Col style={{ height: 200, padding: 10 }}>
              <TouchableOpacity
                style={{ height: 200 }}
                onPress={() => this.props.navigation.navigate('DiseaseProfile')}
              >
                <Card style={{ borderRadius: 10 }}>
                  <CardItem style={{ borderRadius: 10 }}>
                    <Body>
                      <Image
                        source={require('../../../assets/home.png')}
                        style={{
                          height: 100,
                          width: 100,
                          marginLeft: 'auto',
                          marginRight: 'auto'
                        }}
                      />
                      <Text
                        style={{
                          fontSize: 20,
                          color: 'black',
                          marginLeft: 'auto',
                          marginRight: 'auto'
                        }}
                      >
                        Alisher
                      </Text>
                    </Body>
                  </CardItem>
                </Card>
              </TouchableOpacity>
            </Col>
          </Grid>
          <Grid>
            <Col style={{ height: 200, padding: 10 }}>
              <TouchableOpacity
                style={{ height: 200 }}
                onPress={() => this.props.navigation.navigate('DiseaseProfile')}
              >
                <Card style={{ borderRadius: 10 }}>
                  <CardItem style={{ borderRadius: 10 }}>
                    <Body>
                      <Image
                        source={require('../../../assets/home.png')}
                        style={{
                          height: 100,
                          width: 100,
                          marginLeft: 'auto',
                          marginRight: 'auto'
                        }}
                      />
                      <Text
                        style={{
                          fontSize: 20,
                          color: 'black',
                          marginLeft: 'auto',
                          marginRight: 'auto'
                        }}
                      >
                        Alisher
                      </Text>
                    </Body>
                  </CardItem>
                </Card>
              </TouchableOpacity>
            </Col>
            <Col style={{ height: 200, padding: 10 }}>
              <TouchableOpacity
                style={{ height: 200 }}
                onPress={() => this.props.navigation.navigate('DiseaseProfile')}
              >
                <Card style={{ borderRadius: 10 }}>
                  <CardItem style={{ borderRadius: 10 }}>
                    <Body>
                      <Image
                        source={require('../../../assets/home.png')}
                        style={{
                          height: 100,
                          width: 100,
                          marginLeft: 'auto',
                          marginRight: 'auto'
                        }}
                      />
                      <Text
                        style={{
                          fontSize: 20,
                          color: 'black',
                          marginLeft: 'auto',
                          marginRight: 'auto'
                        }}
                      >
                        Alisher
                      </Text>
                    </Body>
                  </CardItem>
                </Card>
              </TouchableOpacity>
            </Col>
          </Grid>
          <Grid>
            <Col style={{ height: 200, padding: 10 }}>
              <TouchableOpacity
                style={{ height: 200 }}
                onPress={() => this.props.navigation.navigate('DiseaseProfile')}
              >
                <Card style={{ borderRadius: 10 }}>
                  <CardItem style={{ borderRadius: 10 }}>
                    <Body>
                      <Image
                        source={require('../../../assets/home.png')}
                        style={{
                          height: 100,
                          width: 100,
                          marginLeft: 'auto',
                          marginRight: 'auto'
                        }}
                      />
                      <Text
                        style={{
                          fontSize: 20,
                          color: 'black',
                          marginLeft: 'auto',
                          marginRight: 'auto'
                        }}
                      >
                        Alisher
                      </Text>
                    </Body>
                  </CardItem>
                </Card>
              </TouchableOpacity>
            </Col>
            <Col style={{ height: 200, padding: 10 }}>
              <TouchableOpacity
                style={{ height: 200 }}
                onPress={() => this.props.navigation.navigate('DiseaseProfile')}
              >
                <Card style={{ borderRadius: 10 }}>
                  <CardItem style={{ borderRadius: 10 }}>
                    <Body>
                      <Image
                        source={require('../../../assets/home.png')}
                        style={{
                          height: 100,
                          width: 100,
                          marginLeft: 'auto',
                          marginRight: 'auto'
                        }}
                      />
                      <Text
                        style={{
                          fontSize: 20,
                          color: 'black',
                          marginLeft: 'auto',
                          marginRight: 'auto'
                        }}
                      >
                        Alisher
                      </Text>
                    </Body>
                  </CardItem>
                </Card>
              </TouchableOpacity>
            </Col>
          </Grid>
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
