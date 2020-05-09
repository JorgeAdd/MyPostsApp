import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ListFeed from './ListFeed';
import { Icon } from 'native-base';
export default class AppContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View style={{margin:10,flex:1}}>
          <View style={stylesAppContainer.viewLatestPosts}>
            <Text/>
            <Text style={stylesAppContainer.latestPosts}>LATEST POSTS</Text>
          </View>
          <ListFeed/>
      </View>
    );
  }
}
const stylesAppContainer = StyleSheet.create({
    viewLatestPosts: {
        margin:10,
    },
    latestPosts: {
        alignSelf:"center",
        textDecorationLine:"underline",
        color:"#8D919B",
        fontSize:13,
        fontWeight:"bold"
    },
    filterIcon: {
      fontSize:24,
      color:"lightblue"
    }
})
