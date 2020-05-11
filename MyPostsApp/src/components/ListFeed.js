import React, { Component } from 'react';
import { View,Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Card,CardItem, Body, Header, Container, Content, Fab, Icon, Footer, Button,Text, Input, Toast } from 'native-base';
import Display from 'react-native-display';
import AsyncStorage from '@react-native-community/async-storage';
export default class ListFeed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      feedDisplay:true,
      newPostDisplay:false,
      feeds:"",
      titleNewPost:"",
      descNewPost:"",
      imageUriNewPost:"../img/descarga.png",
      locationNewPost:"Aguascalientesss Ags MX",
      postKey:0
    };
  }

  componentDidMount(){
    AsyncStorage.removeItem('posts')
    this.loadFeeds();
  }

  async loadFeeds(){
    var stringFeeds = await AsyncStorage.getItem('posts')
     this.setState({feeds:JSON.parse(stringFeeds)})
     console.log("this.state.feeds")
     console.log(this.state.feeds)
  }

  addPostButton(){
    this.setState({feedDisplay:false,newPostDisplay:true})
  }

  async newPostMethod(){
    console.log(this.state.titleNewPost);
    console.log(this.state.descNewPost);
    
    if(this.state.titleNewPost != ""){
      if(this.state.descNewPost != ""){
        this.setState({postKey: this.state.postKey+1})
    
        var newPost = 
        {
          key:""+this.state.postKey,
          title:""+this.state.titleNewPost,
          desc:""+this.state.descNewPost,
          img:""+this.state.imageUriNewPost,
          location:""+this.state.locationNewPost
        }
    
        var posts = await AsyncStorage.getItem('posts')
        if(posts != null){
          posts = JSON.parse(posts);
          posts.push(newPost)
        }else{
          posts = [newPost]
        }
        await AsyncStorage.setItem('posts',JSON.stringify(posts))
        this.loadFeeds()
        this.setState({newPostDisplay:false,feedDisplay:true})
      }else{
        Toast.show({
          text:"Description shouldn't be empty",
          position:'bottom',
          type:'danger',
          duration:5000
        })
      }
    }else{
      Toast.show({
        text:"Title shouldn't be empty",
        position:'bottom',
        type:'danger',
        duration:5000
      })
    }
  }

  cancelNewPost(){
    this.setState({feedDisplay:true,newPostDisplay:false,titleNewPost:"",descNewPost:""})
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
            <Card>
              <CardItem header>
                <Text>Title *</Text>
              </CardItem>
              <CardItem>
                <Input onChangeText={title => this.setState({ titleNewPost: title })} style={stylesListFeed.inputFormat} />
              </CardItem>
              <CardItem>
                <Text>Description *</Text>
              </CardItem>
              <CardItem>
                <Input multiline={true} numberOfLines={20} onChangeText={desc => this.setState({ descNewPost: desc })} style={stylesListFeed.inputFormat} />
              </CardItem>
              <TouchableOpacity>
                <CardItem>
                  <Icon type="FontAwesome" name="image" /><Text> Upload an image</Text>
                </CardItem>
              </TouchableOpacity>
              <CardItem>
                <Text>Location</Text>
              </CardItem>
              <CardItem style={{justifyContent:"space-around"}}>
                <Button style={stylesListFeed.orderSelectedButton} onPress={()=>this.newPostMethod()}>
                  <Text style={stylesListFeed.orderSelectedText}>Post</Text>
                </Button>
                <Button style={stylesListFeed.orderUnselectedButton} onPress={()=>this.cancelNewPost()}>
                  <Text style={stylesListFeed.orderUnselectedText}>Cancel</Text>
                </Button>
              </CardItem>
            </Card>
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
          onPress={() => this.addPostButton()}>
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
  },
  inputFormat: {
    borderColor:"lightblue",
    borderWidth:1,
    borderRadius:5,
    minHeight:50
  }
})
