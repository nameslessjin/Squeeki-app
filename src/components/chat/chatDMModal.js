import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
  Modal,
  FlatList,
  Dimensions,
  Image,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const extractKey = ({id}) => id.toString();
export default class ChatDMModal extends React.Component {
  onPress = type => {
    const {onPress, onBackdropPress} = this.props;
    // onBackdropPress();
    onPress(type);
  };

  renderOptions = i => {
    const {item} = i;
    const {name, icon, type, on, id, icon_2} = item;
    const {theme} = this.props

    return (
      <View style={[styles.options]}>
        <TouchableOpacity onPress={() => this.onPress(type)}>
          <View
            style={{
              height: '100%',
              width: '100%',
              flexDirection: 'row',
            }}>
            <MaterialIcons
              name={icon}
              size={35}
              color={id == 0 ? (on ? 'grey' : 'red') : on ? 'red' : 'grey'}
            />
            <View style={[styles.underline, styles.modalTextView, theme.underline]}>
              <Text
                style={[
                  styles.modalText,
                  {
                    color:
                      id == 0
                        ? on
                          ? 'grey'
                          : 'red'
                        : on
                        ? 'red'
                        : 'grey',
                  },
                ]}>
                {name}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    const {
      modalVisible,
      onBackdropPress,
      name,
      icon_url,
      status,
      user_relation,
      theme
    } = this.props;
    const random = Math.floor(Math.random() * 5);
    const icon_options = [
      'emoticon-cool-outline',
      'emoticon-poop',
      'emoticon-kiss-outline',
      'emoticon-wink-outline',
      'emoticon-tongue-outline',
    ];

    let options = [
      {
        id: 1,
        name: 'Block',
        icon: 'cancel',
        type: 'block',
        on: user_relation.to.is_dm_blocked,
      },
    ];

    if (status.timeout) {
      const notification = [
        {
          id: 0,
          name: 'Mute',
          icon: 'bell-off',
          icon_2: 'bell',
          type: 'notification',
          on: status.notification,
        },
      ];
      options = notification.concat(options)
    }

    const icon_option = icon_options[random];
    const icon =
      icon_url == null ? (
        <MaterialIcons name={icon_option} size={30} />
      ) : (
        <Image source={{uri: icon_url}} style={styles.imageStyle} />
      );

    return (
      <View style={[styles.centeredView]}>
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <TouchableWithoutFeedback onPress={onBackdropPress}>
            <View style={[styles.centeredView]}>
              <TouchableWithoutFeedback>
                <View style={[styles.modalView, theme.greyArea, theme.shadowColor]}>
                  <View style={[styles.modalHeader, styles.underline, theme.underLineColor]}>
                    {icon}
                    <Text
                      style={[{fontWeight: 'bold', fontSize: 16, marginLeft: 5}, theme.textColor]}>
                      {name}
                    </Text>
                  </View>

                  <FlatList
                    data={options}
                    keyExtractor={extractKey}
                    renderItem={this.renderOptions}
                    scrollEnabled={false}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 0,
  },
  modalView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 10,
    width: '100%',
    paddingBottom: 50,
  },
  modalTextView: {
    marginLeft: 5,
    height: 40,
    justifyContent: 'center',
  },
  modalText: {
    fontSize: 14,
  },
  modalHeader: {
    height: 60,
    width: '100%',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  underline: {
    width: '100%',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'silver',
  },
  button: {
    width: 300,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
  },
  options: {
    height: 50,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 8,
    // backgroundColor: 'grey'
  },
  view: {
    backgroundColor: 'white',
    width: 300,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 100,
  },
  imageStyle: {
    height: 30,
    aspectRatio: 1,
    borderRadius: 37,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
