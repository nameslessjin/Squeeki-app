import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default class Input extends React.Component {
  render() {
    const {type, value, onInputChange} = this.props;
    let display = <View />;
    let title = 'Name';
    if (type == 'post') {
      title = 'Post';
    } else if (type == 'local') {
      title = 'Local';
    } else if (type == 'password') {
      title = 'Password';
    } else if (type == 'duration') {
      title = 'Duration (mins)';
    }

    if (type == 'post') {
      display = (
        <View style={styles.container}>
          <Text>{title}</Text>
          <View style={styles.postSelection}>
            <TouchableOpacity onPress={() => onInputChange(type)}>
              <View style={styles.subContainer}>
                {value.id ? (
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{color: 'grey'}}>
                    {value.content.slice(0, 40)} ...
                  </Text>
                ) : (
                  <Text style={{color: 'grey'}}>Not Selected</Text>
                )}
                <MaterialIcons name={'chevron-right'} size={30} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else if (type == 'local') {
      display = (
        <View style={[styles.container, {justifyContent: 'space-between'}]}>
          <Text>{title}</Text>
          <TouchableWithoutFeedback disabled={true} onPress={() => onInputChange(type)}>
            <MaterialIcons
              name={value ? 'toggle-switch' : 'toggle-switch-off-outline'}
              size={45}
              color={value ? 'green' : 'grey'}
            />
          </TouchableWithoutFeedback>
        </View>
      );
    } else {
      display = (
        <View style={styles.container}>
          <Text>{title}</Text>
          <TextInput
            style={styles.textInputStyle}
            value={value.toString()}
            keyboardType={type == 'duration' ? 'numeric' : null}
            onChangeText={t => onInputChange(type, t)}
            placeholder={type == 'password' ? 'Optional' : type == 'duration' ? '1 to 3000' : 'Check-in name'}
            placeholderTextColor={'#7f8fa6'}
            maxLength={type == 'name' ? 40 : 30}
          />
        </View>
      );
    }

    return display;
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
    marginLeft: 20,
    color: 'grey',
    height: 50,
  },
  postSelection: {
    height: '100%',
    paddingRight: 25,
  },
  subContainer: {
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    // backgroundColor: 'orange',
    width: '100%' ,
    paddingLeft: 20,
  },
});
