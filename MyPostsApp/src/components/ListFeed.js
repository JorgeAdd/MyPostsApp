import React, { Component } from 'react';
import { View,Image, StyleSheet } from 'react-native';
import { Card,CardItem, Body, Header, Container, Content, Fab, Icon, Footer, Button,Text } from 'native-base';
import Display from 'react-native-display';
export default class ListFeed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      feedDisplay:true,
      newPostDisplay:false,
    };
  }

  render() {
    return (
      <Container>
        <Content padder>
          <Display enable={this.state.feedDisplay}>
            <Card>
              <Icon type="FontAwesome" name="trash" style={stylesListFeed.trashIcon} />
              <CardItem style={{ width: "100%" }}>
                <Image style={{ width: "100%" }} source={require('../img/descarga.png')} />
              </CardItem>
              <CardItem header>
                <Text style={stylesListFeed.headerPost}>First post!</Text>
              </CardItem>
              <CardItem style={{ flexDirection: "column" }}>
                <Body>
                  <Text style={stylesListFeed.descPost}>
                    This is my 1st post ever, you can see that I ran out of ideas to write something interesting.
                </Text>
                  <Text style={stylesListFeed.datePost}>
                    16/02/20
                </Text>
                </Body>
              </CardItem>
              <CardItem footer style={{ justifyContent: "center" }}>
                <Text style={stylesListFeed.footerPost}>
                  Posted in Aguascalientes, Mexico. See in the map.
          </Text>
              </CardItem>
            </Card>
            <Card>
              <CardItem style={{ width: "100%" }}>
                <Image style={{ width: "100%", top: 0 }} source={require('../img/descarga.png')} />
              </CardItem>
              <CardItem header>
                <Text style={stylesListFeed.headerPost}>First post!</Text>
              </CardItem>
              <CardItem>
                <Body>
                  <Text style={stylesListFeed.descPost}>
                    This is my 1st post ever, you can see that I ran out of ideas to write something interesting.
              </Text>
                </Body>
              </CardItem>
              <CardItem footer style={{ justifyContent: "center" }}>
                <Text style={stylesListFeed.footerPost}>
                  Posted in Aguascalientes, Mexico. See in the map.
                </Text>
              </CardItem>
            </Card>
          </Display>
          <Display enable={this.state.newPostDisplay}>
            <Text>New display</Text>
          </Display>
        </Content>

        {this.state.feedDisplay ? 
        <Footer style={{height:20,backgroundColor:"white",width:"100%", marginBottom:0,paddingBottom:0, flexDirection:"column",}}>
          <Text style={{marginTop:10}}>Order by:</Text>
          <View style={{flexDirection:"row",justifyContent:"space-around",width:"75%"}}>
            <Button style={stylesListFeed.orderSelectedButton}>
              <Text style={stylesListFeed.orderSelectedText}>Date</Text>
            </Button>
            <Button style={stylesListFeed.orderUnselectedButton}>
              <Text style={stylesListFeed.orderUnselectedText}>Title</Text>
            </Button>
          </View>
        <Fab
          active={this.state.feedDisplay}
          position="bottomRight"
          style={stylesListFeed.fabButton}
          onPress={() => this.setState({feedDisplay:false,newPostDisplay:true})}>
            <View style={stylesListFeed.fabView}>
            <Icon name="add" style={stylesListFeed.fabIcon}/>
            </View>
        </Fab>
        </Footer>
        :<></>}
        
      </Container>
    );
  }
}
const stylesListFeed = StyleSheet.create({
  trashIcon: {
    alignSelf:"center",
    color:"pink",
    marginTop:5,
    position:"absolute",
    zIndex:1,
    textAlign:"right",
    width:"95%"
  },
  headerPost: {
    fontSize:18,
    fontWeight:"bold"
  },
  descPost: {
    fontSize:16
  },
  datePost: {
    fontSize:12,
    color:"gray",
    textAlign:"left"
  },
  footerPost: {
    fontSize:12
  },
  orderSelectedButton: {
    width:"30%",
    justifyContent:"center",
    backgroundColor:"lightblue",
    borderWidth:1,
    borderColor:"blue"    
  },
  orderUnselectedButton: {
    width:"30%",
    justifyContent:"center",
    backgroundColor:"#FFF",
    borderWidth:1,
    borderColor:"blue"
  },
  orderSelectedText: {
    color:"blue"
  },
  orderUnselectedText: {
    color:"blue"
  },
  fabButton: {
    flex:1,
    backgroundColor:"lightblue",
    justifyContent:"center",
    alignItems:"center",
    alignContent:"center",
    alignSelf:"center"
  },
  fabView: { 
    width:"70%", 
    height:"70%",
    alignItems:"center"
  },
  fabIcon:{
    fontSize:40,
    color:"blue"
  }
})
