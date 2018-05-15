import React, { Component } from 'react';
<<<<<<< HEAD
import { Image } from 'react-native';
import { Container, View, Button, Icon, Fab } from 'native-base';
=======
import { Image, ScrollView, Text, TouchableOpacity } from 'react-native';
import { Container, Header, View, Button, Icon, Fab } from 'native-base';
>>>>>>> 1ab18cf455540efa5a2f303a5480a7c671c4ee92
import ScrollTabView from 'react-native-scrollable-tab-view';
import Completed from '../Completed/Completed';
import Upcoming from '../Upcoming/Upcoming';
import Canceled from '../Canceled/Canceled';

export default class Consultation extends Component {
  static navigationOptions = {
<<<<<<< HEAD
    title: 'Consultation',

    drawerIcon: (
      <Image
        source={require('../../../assets/home.png')}
        style={{ height: 24, width: 24 }}
      />
    )
=======
    title: 'APPOINTMENT',

    // drawerIcon: (
    //   <Image
    //     source={require('../../../assets/home.png')}
    //     style={{ height: 24, width: 24 }}
    //   />
    // )
>>>>>>> 1ab18cf455540efa5a2f303a5480a7c671c4ee92
  };
  constructor() {
    super();
    this.state = {
      active: 'true'
    };
  }
  render() {
    const { navigation } = this.props;
    return (
      <Container>
        <View style={{ flex: 1 }}>
<<<<<<< HEAD
          <ScrollTabView>
=======
          <ScrollTabView
          tabBarUnderlineStyle={{ backgroundColor: '#fff' }}
          tabBarBackgroundColor='#019ae8'
          tabBarInactiveTextColor='#fff'
          tabBarActiveTextColor='#fff'
          tabBarTextStyle={{ fontSize: 16 }}
          >
>>>>>>> 1ab18cf455540efa5a2f303a5480a7c671c4ee92
            <Completed tabLabel="Completed" navigation={navigation} />
            <Upcoming tabLabel="Upcoming" navigation={navigation} />
            <Canceled tabLabel="Canceled" navigation={navigation} />
          </ScrollTabView>

          <Fab
            active={this.state.active}
            direction="up"
            containerStyle={{}}
<<<<<<< HEAD
            style={{ backgroundColor: '#5067FF' }}
=======
            style={{ backgroundColor: '#5067FF', borderLeftWidth: 1, borderLeftColor: 'red' }}
>>>>>>> 1ab18cf455540efa5a2f303a5480a7c671c4ee92
            position="bottomRight"
            onPress={() => this.setState({ active: !this.state.active })}
          >
            <Icon name="share" />
            <Button style={{ backgroundColor: '#34A34F' }}>
              <Icon name="logo-whatsapp" />
            </Button>
            <Button style={{ backgroundColor: '#3B5998' }}>
              <Icon name="logo-facebook" />
            </Button>
            <Button disabled style={{ backgroundColor: '#DD5144' }}>
              <Icon name="mail" />
            </Button>
          </Fab>
        </View>
      </Container>
<<<<<<< HEAD
=======
      
>>>>>>> 1ab18cf455540efa5a2f303a5480a7c671c4ee92
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
