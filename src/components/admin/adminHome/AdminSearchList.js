import React from 'react';
import {FlatList, StyleSheet, Keyboard} from 'react-native';
import AdminSearchCard from './AdminSearchCard';


const extractKey = ({id}) => id;

export default class AdminSearchList extends React.Component {
  renderItem = ({item}) => {
    const {navigation, type} = this.props;
    return <AdminSearchCard item={item} navigation={navigation} type={type} />;
  };

  render() {
    const {data} = this.props;
    return (
      <FlatList
        styles={styles.container}
        data={data}
        keyExtractor={extractKey}
        alwaysBounceHorizontal={false}
        keyboardShouldPersistTaps={'handled'}
        showsVerticalScrollIndicator={false}
        renderItem={this.renderItem}
        onScroll={() => Keyboard.dismiss()}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: 20,
  },
});
