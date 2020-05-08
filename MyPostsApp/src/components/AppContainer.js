import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ListFeed from './ListFeed';
export default class AppContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View style={{margin:10}}>
          <View style={styles.viewLatestPosts}>
            <Text/>
            <Text style={styles.latestPosts}>LATEST POSTS</Text>
            <Text style={styles.filterIcon}>Filter</Text>
          </View>
          <ListFeed/>
      </View>
    );
  }
}
const styles = StyleSheet.create({
    viewLatestPosts: {
        margin:10,
        flexDirection:"row",
        justifyContent:"space-between"
    },
    latestPosts: {
        alignSelf:"center",
        textDecorationLine:"underline",
        color:"#8D919B",
        fontSize:13,
        fontWeight:"bold"
    },
    filterIcon: {
    }
})
