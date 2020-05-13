import React, { Component } from 'react';
import { View, Image, StyleSheet } from 'react-native';
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
      <View style={{flex:1}}>
          <View style={stylesAppContainer.viewLatestPosts}>
            <Image style={{ width: 100,height:70 }} source={require("../img/mypostsblue.png")} />
          </View>
          <ListFeed/>
      </View>
    );
  }
}
const stylesAppContainer = StyleSheet.create({
    viewLatestPosts: {
      alignItems:"center"
  
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
      color:"#84B5D9"
    }
})
