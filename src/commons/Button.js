import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

const Button = ({ onPress, children }) => {
    const { button, btnText } = styles;
    return (
        <TouchableOpacity onPress={onPress} style={button}>
            <Text style={btnText}>
                {children}
            </Text>
        </TouchableOpacity>
    );
};
const styles = {
    button: {
        flex: 1,
        marginTop: 30,
        marginBottom: 30,
        marginLeft: 20,
        marginRight: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#029adf',
        borderRadius: 40,
        height: 60,
    },
    btnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '300',
    }
};
export { Button };
