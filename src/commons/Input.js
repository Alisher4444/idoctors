import React from 'react';
import { TextInput, View, Image } from 'react-native';

const Input = ({ label, value, onChangeText, placeholder, height, width, 
     secureTextEntry }) => {
    const { labelStyle, containerStyle, inputStyle } = styles;
    return (
        <View style={containerStyle}>
            <Image 
                style={{
                    height,
                    width,
                }}
                style={labelStyle}
                source={label}
                resizeMode="contain"
            />
            <TextInput 
                secureTextEntry={secureTextEntry}
                placeholder={placeholder}
                autoCorrect={false}
                placeholderTextColor={'#c1c1c1'}
                style={inputStyle}
                value={value}
                underlineColorAndroid='transparent'
                onChangeText={onChangeText}
            />
        </View>
    );
};

const styles = {
    containerStyle: {
        flex: 1,
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        borderRadius: 40,
        borderWidth: 0.5,
        borderColor: '#E0E0E0',
        marginLeft: 20,
        marginRight: 20,
    },
    labelStyle: {
        paddingLeft: 20,
        flex: 1,
    },
    inputStyle: {
        color: '#000',
        fontSize: 18,
        paddingRight: 5,
        paddingLeft: 5,
        lineHeight: 23,
        flex: 6,
    }
};

export { Input }; 
