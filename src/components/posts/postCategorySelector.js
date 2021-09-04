import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

export default class PostCategorySlection extends React.Component {
  render() {
    const {
      category,
      onPress,
      theme,
      selectedPostCategory,
      onSelectPostCategory,
    } = this.props;

    const title =
      category[0].toUpperCase() + category.substr(1, category.length);

    return (
      <TouchableOpacity
        style={[
          styles.button,
          {
            borderBottomWidth: selectedPostCategory == category ? 1 : 0,
            borderColor: selectedPostCategory == category ? '#EA2027' : null,
          },
        ]}
        disabled={selectedPostCategory == category}
        onPress={() => onSelectPostCategory(category)}>
        <Text
          style={{
            fontWeight: '600',
            color: selectedPostCategory == category ? '#EA2027' : 'grey',
            fontSize: 16,
          }}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    height: 35,
    padding: 5,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
