/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React,{Component} from 'react';
import {
  StyleSheet,
  StatusBar,
  SafeAreaView,
  YellowBox
} from 'react-native';
YellowBox.ignoreWarnings(['Warning: componentWillUpdate has been renamed'])
YellowBox.ignoreWarnings(['Warning: componentWillReceiveProps has been renamed'])
YellowBox.ignoreWarnings(['Warning: componentWillMount has been renamed'])
YellowBox.ignoreWarnings(['Animated: `useNativeDriver` was not specified.'])
import AppContainer from './src/components/AppContainer';

export default class App extends Component {
  render(){ 
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.safeAreaView}>
          <AppContainer/>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex:1
  }
});
