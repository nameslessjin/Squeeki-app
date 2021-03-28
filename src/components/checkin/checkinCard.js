import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import {timeDifferentInMandS, countDownFormat} from '../../utils/time';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default class CheckinCard extends React.Component {

  state = {
    time: false
  }

  componentDidMount() {
    const {endAt} = this.props.item
    const self = this
    this.interval = setInterval(() => {
      const time = timeDifferentInMandS(endAt);
      self.setState({time})
    }, 1000)
  }

  componentDidUpdate(){
    if (!this.state.time){
      clearInterval(this.interval)
    }
  }

  componentWillUnmount(){
    clearInterval(this.interval)
  }

  onDelete = () => {
    const {onDeleteCheckIn, item} = this.props;
    const {id} = item;

    Alert.alert('Delete check-in', null, [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Confirm',
        onPress: () => onDeleteCheckIn(id),
        style: 'destructive',
      },
    ]);
  };

  render() {
    const {
      onCheckInPress,
      currentUserId,
      auth,
      item,
      rank_required,
      onResultPress,
    } = this.props;
    const {
      name,
      content,
      point,
      location,
      hasPassword,
      endAt,
      id,
      count,
      checked,
      userId,
    } = item;
    const {time} = this.state
    const timeDisplay = countDownFormat(time);
    const allowToCheckResult = checked || auth.rank <= rank_required
    return (
      <TouchableWithoutFeedback>
        <View style={styles.card}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={[styles.name, styles.text]}>{name}</Text>
            {currentUserId == userId || auth.rank <= rank_required ? (
              <TouchableOpacity onPress={this.onDelete}>
                <Text
                  style={[
                    styles.name,
                    styles.text,
                    {color: 'red', marginLeft: 3},
                  ]}>
                  X
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
          <Text
            numberOfLines={3}
            ellipsizeMode={'tail'}
            style={[styles.text, {color: 'grey'}]}>
            {content.slice(0, 100)} {content.length > 100 ? '...' : null}
          </Text>
          <Text style={styles.text}>Local: {location ? 'ON' : 'OFF'}</Text>
          <Text style={styles.text}>Attended: {count}</Text>
          {/* <Text style={styles.text}>Points: {point}</Text> */}
          <Text style={styles.text}>End At: {timeDisplay}</Text>

          <View style={styles.checkin}>
            {(checked && time) || (!time && allowToCheckResult) ? (
              <TouchableOpacity onPress={() => onResultPress({checkin_id: id, userId: userId})}>
                <View>
                  <Text style={[styles.checkinText]}>Result</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                disabled={!time}
                onPress={() =>
                  onCheckInPress({checkinId: id, hasPassword: hasPassword})
                }>
                <View style={{flexDirection: 'row'}}>
                  {hasPassword ? (
                    time ? (
                      <MaterialIcons name={'lock'} size={15} />
                    ) : null
                  ) : null}
                  <Text
                    style={[
                      styles.checkinText,
                      {color: time ? '#74b9ff' : 'grey'},
                    ]}>
                    {time ? 'Check In' : 'Closed'}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    // width: '100%',
    margin: 8,
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    padding: 10,
  },
  name: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  text: {
    marginVertical: 3,
  },
  checkin: {
    borderTopWidth: StyleSheet.hairlineWidth,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    marginTop: 5,
  },
  checkinText: {
    fontWeight: 'bold',
    color: '#74b9ff',
  },
});
