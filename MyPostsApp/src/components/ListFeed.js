import React, { Component } from 'react';
import { View,Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Card,CardItem, Body, Header, Container, Content, Fab, Icon, Footer, Button,Text, Input, Toast } from 'native-base';
import Display from 'react-native-display';
import AsyncStorage from '@react-native-community/async-storage';
import {FlatList} from 'react-native-gesture-handler';
export default class ListFeed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      feedDisplay:true,
      newPostDisplay:false,
      feeds:"",
      titleNewPost:"",
      descNewPost:"",
      imageUriNewPost:require("../img/descarga.png"),
      locationNewPost:"Aguascalientesss Ags MX",
      postKey:0,
      orderBy:"date"
    };
  }

  componentDidMount(){
    //AsyncStorage.removeItem('posts')
    this.loadFeeds();
  }

  async loadFeeds(){
    var stringFeeds = await AsyncStorage.getItem('posts')
     this.setState({feeds:JSON.parse(stringFeeds)})
     console.log("this.state.feeds")
     console.log(this.state.feeds)
     this.setState({postKey:this.state.feeds.length})
  }

  addPostButton(){
    this.setState({feedDisplay:false,newPostDisplay:true})
  }

  async newPostMethod(){
    if(this.state.titleNewPost != ""){
      if(this.state.descNewPost != ""){
        this.setState({postKey: this.state.postKey+1})
    
        var newPost = 
        {
          key:""+this.state.postKey,
          title:""+this.state.titleNewPost,
          desc:""+this.state.descNewPost,
          img:this.state.imageUriNewPost,
          location:""+this.state.locationNewPost,
          datePosted: new Date()
        }
    
        var posts = await AsyncStorage.getItem('posts')
        if(posts != null){
          posts = JSON.parse(posts);
          posts.push(newPost)
        }else{
          posts = [newPost]
        }
        posts.sort(function(a,b){
          return new Date(b.datePosted) - new Date(a.datePosted)
        })
        await AsyncStorage.setItem('posts',JSON.stringify(posts))
        this.loadFeeds()
        this.setState({newPostDisplay:false,feedDisplay:true,titleNewPost:"",descNewPost:""})
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

  dateSort(){
    this.setState({orderBy:"date"})
    var posts = this.state.feeds
    posts.sort(function(a,b){
      return new Date(b.datePosted) - new Date(a.datePosted)
    })
    this.setState({feeds: posts})
  }

  titleSort(){
    this.setState({orderBy:"title"})
    var posts = this.state.feeds
    posts.sort(function(a,b){
      return a.title.localeCompare(b.title)
    })
    this.setState({feeds: posts})
    console.log(this.state.feeds);
    
  }

  render() {
    return (
      <Container>
        <View style={{flex:1}}>
          <Display enable={this.state.feedDisplay}>
            <FlatList data={this.state.feeds} renderItem={({item,index}) => (
            <Card>
              <Icon type="FontAwesome" name="trash" style={stylesListFeed.trashIcon} />
              <CardItem style={{ width: "100%" }}>
                <Image style={{ width: "100%" }} source={item.img} />
              </CardItem>
              <CardItem header>
                <Text style={stylesListFeed.headerPost}>{item.title}</Text>
              </CardItem>
              <CardItem style={{ flexDirection: "column" }}>
                <Body>
                  <Text style={stylesListFeed.descPost}>
                    {item.desc}
                </Text>
                  <Text style={stylesListFeed.datePost}>
                    {item.datePosted}
                </Text>
                </Body>
              </CardItem>
              <CardItem footer style={{ justifyContent: "center" }}>
                <Text style={stylesListFeed.footerPost}>
                  Posted in {item.location}. See in the map.
                </Text>
              </CardItem>
            </Card>
            )}
            key={item => item.key}
            keyExtractor={item => item.key.toString()}
            ListEmptyComponent={<Text style={{textAlign:"center",color:"gray"}}>You haven't posted anything yet!</Text>}
            ListFooterComponent={<Text>Pag 1</Text>}
            />
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

        </View>

        {this.state.feedDisplay ? 
        <Footer style={{height:20,backgroundColor:"white",width:"100%", marginBottom:0,paddingBottom:0, flexDirection:"column",}}>
          <Text style={{marginTop:15,marginBottom:5}}>Order by:</Text>
          <View style={{flexDirection:"row",justifyContent:"space-around",width:"75%"}}>
            <Button style={this.state.orderBy == "date" ? stylesListFeed.orderSelectedButton : stylesListFeed.orderUnselectedButton}
             onPress={()=> this.dateSort()}>
              <Text style={this.state.orderBy == "date" ? stylesListFeed.orderSelectedText : stylesListFeed.orderUnselectedText}>
                Date</Text>
            </Button>
            <Button style={this.state.orderBy == "title" ? stylesListFeed.orderSelectedButton : stylesListFeed.orderUnselectedButton}
             onPress={()=> this.titleSort()}>
              <Text style={this.state.orderBy == "title" ? stylesListFeed.orderSelectedText : stylesListFeed.orderUnselectedText}>
                Title</Text>
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
