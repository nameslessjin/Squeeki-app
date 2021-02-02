import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default class RewardSettingInput extends React.Component {
  state = {
    icon_option: 'emoticon-cool-outline',
  };

  componentDidMount() {
    const random = Math.floor(Math.random() * 5);
    const icon_options = [
      'emoticon-cool-outline',
      'emoticon-poop',
      'emoticon-kiss-outline',
      'emoticon-wink-outline',
      'emoticon-tongue-outline',
    ];
    this.setState({icon_option: icon_options[random]});
  }

  render() {
    const {type, value, onInputChange} = this.props;
    const {icon_option} = this.state;
    let title = 'Name';
    if (type == 'type') {
      title = 'Type';
    } else if (type == 'rank') {
      title = 'Rank Required';
    }

    const icon = (
      <TouchableOpacity style={styles.imageStyle}>
        {value && (type == 'icon') != null ? (
          <Image source={{uri: value}} style={styles.imageStyle} />
        ) : (
          <MaterialIcons name={icon_option} size={100} />
        )}
      </TouchableOpacity>
    );

    console.log(type);

    return type == 'icon' ? (
      icon
    ) : (
      <View style={styles.container}>
        <Text style={{color: 'grey'}}>{title}</Text>
        {type == 'type' ? (
          <TouchableOpacity onPress={() => onInputChange(type)}>
            <View style={{marginLeft: 20}}>
              <Text style={{color: 'grey'}}>{value}</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TextInput
            style={styles.textInputStyle}
            value={value ? value : ''}
            onChangeText={v => onInputChange(type, v)}
            keyboardType={type == 'rank' ? 'number-pad' : 'default'}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 45,
    marginTop: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
    padding: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'grey',
  },
  textInputStyle: {
    width: '100%',
    marginLeft: 10,
    color: 'black',
    height: 50,
  },
  imageStyle: {
    height: 100,
    aspectRatio: 1,
    borderRadius: 50,
    backgroundColor: 'white',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#718093',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 15
  },
});
