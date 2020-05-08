import React, { Component } from 'react';
import { View, Text,Image } from 'react-native';
import { Card,CardItem, Body, Header } from 'native-base';

export default class ListFeed extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View>
          <Card>
              <CardItem style={{width:"100%"}}>
               <Image style={{width:"100%",top:0}} source={require('../img/descarga.png')} />
              </CardItem>
              <CardItem header>
                <Text>Header card</Text>
              </CardItem>
              <CardItem>
                  <Body>
                    <Text>
                        Card body
                    </Text>
                  </Body>
              </CardItem>
          </Card>
      </View>
    );
  }
}
