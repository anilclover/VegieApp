import React from 'react';
import {TextInput, StyleSheet, TextInputProps} from 'react-native';
import ResponsiveUI from '../utils/Responsive';

interface InputFieldProps extends TextInputProps {
  // Optional extra props can go here
}

const InputField: React.FC<InputFieldProps> = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  style,
  ...rest
}) => {
  return (
    <TextInput
      style={[
        styles.input,
        {
          fontSize: ResponsiveUI.textFontSize(14),
          paddingVertical: ResponsiveUI.padding.vertical(10),
          paddingHorizontal: ResponsiveUI.padding.horizontal(12),
          borderRadius: ResponsiveUI.cardRadius(8),
          width: '100%', // ✅ Full width of parent
        },
        style, // allow overriding styles
      ]}
      placeholder={placeholder}
      placeholderTextColor="#999"
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      {...rest}
    />
  );
};

export default InputField;

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: ResponsiveUI.margin.bottom(10),
  },
});
