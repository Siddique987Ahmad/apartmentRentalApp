import React from 'react';
import { View, TextInput, TouchableOpacity,ActivityIndicator,Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { styles } from './authStyles';

export const InputField = ({ icon, showPassword, onTogglePassword, ...props }) => (
  <View style={styles.inputContainer}>
    <Icon name={icon} size={20} color="#fff" style={styles.icon} />
    <TextInput style={styles.input} placeholderTextColor="#ccc" {...props} />
    {onTogglePassword && (
      <TouchableOpacity onPress={onTogglePassword}>
        <Icon
          name={showPassword ? 'eye-slash' : 'eye'}
          size={20}
          color="#fff"
          style={styles.icon}
        />
      </TouchableOpacity>
    )}
  </View>
);

export const AuthButton = ({ loading, onPress, text }) => (
  <>
    {loading ? (
      <ActivityIndicator size="large" color="#fff" />
    ) : (
      <TouchableOpacity style={styles.authButton} onPress={onPress}>
        <Text style={styles.authButtonText}>{text}</Text>
      </TouchableOpacity>
    )}
  </>
);

export const AuthLink = ({ navigation, text, linkText, screen }) => (
  <TouchableOpacity onPress={() => navigation.navigate(screen)}>
    <Text style={styles.linkText}>
      {text} <Text style={styles.link}>{linkText}</Text>
    </Text>
  </TouchableOpacity>
);