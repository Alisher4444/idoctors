
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Image,
  TextInput,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Login from '../Login/Login';
import Switch from './Switch';

export default class SwitchForm extends Component {
    static navigationOptions = {
        title: 'Switch',
      };
  render() {
    
      
    return (
        <View style={styles.container}>
           <TouchableOpacity onPress={
               ()=> this.props.navigation.navigate("Login")
           } style={styles.button}>
                <Text style={styles.btnText}>DOCTOR</Text>
           </TouchableOpacity>
           <TouchableOpacity style={styles.button}>
                <Text style={styles.btnText}>PATIENT</Text>
           </TouchableOpacity>
        </View>
    );
  }
}
const styles = StyleSheet.create({
    container:{
        marginBottom:10,
        padding:20

    },

    button:{
        marginBottom:10,
        width:350,
        height:60,
        backgroundColor:'#0091EA',
        paddingVertical:17,
        borderRadius:50

    },
    btnText:{
        textAlign:'center',
        color:'#fff',
        fontWeight:'bold',
        fontSize:18
    }
    
})