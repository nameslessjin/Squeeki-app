import React from 'react'
import {FlatList, SectionList} from 'react-native'

const extractKey = ({id}) => id;

export default class rewardItemList extends React.Component {

    renderItem = ({item}) => {
        console.log(item)
    }

    return () {
        const {rewardItemList} = this.props
        return <SectionList
            data={rewardItemList}
            keyExtractor={extractKey}
            renderItem={this.renderItem}
            showsVerticalScrollIndicator={false}
        />
    }


}

