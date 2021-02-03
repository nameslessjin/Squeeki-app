import React from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const extractKey = ({id}) => id;

export default class ChatList extends React.Component {
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

  renderItem = ({item}) => {
    const {name, icon, rank_req, id} = item;
    const {icon_option} = this.state;
    const {onChatPress} = this.props
    return (
      <TouchableOpacity onPress={() => onChatPress(item)}>
        <View style={[styles.chat_container]}>
          <View style={{width: '80%', flexDirection: 'row'}}>
            <View style={styles.imgHolder}>
              {icon != null ? (
                <Image source={{uri: icon.uri}} style={styles.imageStyle} />
              ) : (
                <MaterialIcons name={icon_option} size={90} />
              )}
            </View>
            <View style={styles.rightStyle}>
              <Text style={styles.chat_name_style}>{name}</Text>
            </View>
            <View style={styles.side}>
                <Text style={styles.side_text}>Rank: {rank_req}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const {onRefresh, refreshing, onEndReached, chat} = this.props;

    return (
      <FlatList
        style={styles.container}
        data={chat}
        keyExtractor={extractKey}
        alwaysBounceHorizontal={false}
        renderItem={this.renderItem}
        onRefresh={onRefresh}
        refreshing={refreshing}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.1}
        keyboardShouldPersistTaps={'handled'}
        showsVerticalScrollIndicator={false}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white'
  },
  chat_container: {
    width: '100%',
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  imageStyle: {
    height: 90,
    aspectRatio: 1,
    borderRadius: 45,
  },
  imgHolder: {
    aspectRatio: 1,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 5,
  },
  rightStyle: {
    paddingLeft: 15,
    height: 100,
    width: '75%',
    justifyContent: 'center',
    // backgroundColor: 'yellow'
  },
  chat_name_style: {
    fontSize: 16,
    fontWeight: '500'
  },
  side: {
      width: '20%',
      height: 100,
      justifyContent: 'center',
      alignItems: 'center'
  },
  side_text: {
      fontSize: 12,
      color: '#95a5a6',
  }
});
