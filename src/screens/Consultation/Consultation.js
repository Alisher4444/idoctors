import React, { Component } from 'react';
import { Image, Text, TouchableOpacity } from 'react-native';
import ScrollTabView from 'react-native-scrollable-tab-view';
import Completed from '../Completed/Completed';
import Upcoming from '../Upcoming/Upcoming';
import Canceled from '../Canceled/Canceled';

export default class Consultation extends Component {
  static navigationOptions = {
    title: 'Consultation',

    drawerIcon: (
      <Image
        source={require('../../../assets/home.png')}
        style={{ height: 24, width: 24 }}
      />
    )
  };
  render() {
    const { navigation } = this.props;
    return (
      <ScrollTabView>
        <Completed tabLabel="Completed" navigation={navigation} />
        <Upcoming tabLabel="Upcoming" navigation={navigation} />
        <Canceled tabLabel="Canceled" navigation={navigation} />
      </ScrollTabView>
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
