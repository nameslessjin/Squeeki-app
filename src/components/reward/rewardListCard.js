import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RewardEntryList from './rewardEntryList';
import {Swipeable} from 'react-native-gesture-handler';

const {width, height} = Dimensions.get('screen');

export default class RewardListCard extends React.Component {
  onPress = entry => {
    const {navigation} = this.props;
    console.log(entry)
    navigation.navigate('RewardDetailView', {
      ...entry,
    });
  };

  render() {
    const {onSettingPress, item} = this.props;
    const {
      listName,
      type,
      rewardEntryList,
      redeemRewardEntryList,
    } = item;
    return (
      //   <Swipeable>
      <View
        style={{
          width: width,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerSide} />
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerText}>{listName}</Text>
            </View>
            <View style={styles.headerSide}>
              <TouchableOpacity onPress={() => onSettingPress(item)}>
                <MaterialIcons name={'cog'} size={20} color={'#EA2027'} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.list}>
            <RewardEntryList
              rewardEntryList={
                rewardEntryList ? rewardEntryList : redeemRewardEntryList
              }
              type={type}
              onPress={this.onPress}
            />
          </View>
          {type == 'loot' ? (
            <TouchableOpacity>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Loot</Text>
              </View>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
      //   </Swipeable>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 0.9 * width,
    height: '95%',
    borderRadius: 25,
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  header: {
    minHeight: 60,
    maxHeight: 70,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerSide: {
    height: '100%',
    width: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTextContainer: {
    height: '100%',
    width: width * 0.9 - 70,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'silver',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  list: {
    width: '100%',
    minHeight: height * 0.95 - 70 - 220,
    maxHeight: height * 0.95 - 60 - 220,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  button: {
    width: 100,
    height: 50,
    backgroundColor: '#EA2027',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'white',
  },
});
