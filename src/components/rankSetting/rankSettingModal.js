import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
  Modal,
  KeyboardAvoidingView,
  Keyboard,
  FlatList,
  Dimensions,
} from 'react-native';

const {width} = Dimensions.get('window');

const extractKey = ({id}) => id;
export default class RankSettingModal extends React.Component {
  state = {
    ranks: [
      {id: '1', value: 1, name: this.props.rankName.rank1Name},
      {id: '2', value: 2, name: this.props.rankName.rank2Name},
      {id: '3', value: 3, name: this.props.rankName.rank3Name},
      {id: '4', value: 4, name: this.props.rankName.rank4Name},
      {id: '5', value: 5, name: this.props.rankName.rank5Name},
      {id: '6', value: 6, name: this.props.rankName.rank6Name},
      {id: '7', value: 7, name: this.props.rankName.rank7Name},
    ],
  };

  componentDidMount() {
    const {prevRoute, userRank} = this.props;

    if (prevRoute == 'member') {
      this.setState(prevState => {
        return {
          ranks: prevState.ranks.filter(r => r.value > userRank),
        };
      });
    }
    if (prevRoute == 'chatSetting'){
      this.setState(prevState => {
        return {
          ranks: prevState.ranks.filter(r => r.value >= userRank),
        };
      });
    }
  }

  onBackdropPress = () => {
    const {onBackdropPress} = this.props;
    onBackdropPress();
  };

  onRankChange = value => {
    const {onRankChange, type, onBackdropPress} = this.props;
    onRankChange(type, value);
    onBackdropPress();
  };

  renderItem = i => {
    const {index, item} = i;
    const {name, value} = item;
    const {ranks} = this.state;
    const {theme} = this.props
    // {color: '#3498db'}
    return (
      <View style={styles.rank}>
        <TouchableOpacity onPress={() => this.onRankChange(value)}>
          <View style={[styles.rank]}>
            <Text style={theme.textColor}>{name}</Text>
          </View>
        </TouchableOpacity>
        {index != ranks.length - 1 ? <View style={[styles.underline, theme.underLineColor]} /> : null}
      </View>
    );
  };

  render() {
    const {modalVisible, onBackdropPress} = this.props;
    const {ranks, theme} = this.state;
    return (
      <View style={styles.centeredView}>
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <TouchableWithoutFeedback onPress={onBackdropPress}>
            <View style={styles.centeredView}>
              <TouchableWithoutFeedback>
                <KeyboardAvoidingView style={[styles.view, theme.backgroundColor, theme.shadowColor]}>
                  <View style={styles.rank_display}>
                    <View style={styles.header}>
                      <Text style={theme.textColor}>Minimum rank required</Text>
                    </View>
                    <FlatList
                      data={ranks}
                      renderItem={this.renderItem}
                      alwaysBounceVertical={false}
                      alwaysBounceHorizontal={false}
                      showsVerticalScrollIndicator={false}
                      keyExtractor={extractKey}
                    />
                  </View>
                </KeyboardAvoidingView>
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
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
  },
  view: {
    backgroundColor: 'white',
    width: '75%',
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
  rank: {
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.75,
    height: 45,
  },
  rank_display: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
  },
  underline: {
    width: width * 0.7,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'grey',
  },
});
