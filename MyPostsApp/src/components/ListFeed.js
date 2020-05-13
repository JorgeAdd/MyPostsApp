import React, { Component } from 'react';
import { View,Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Card,CardItem, Body, Header, Container, Content, Fab, Icon, Footer, Button,Text, Input, Toast } from 'native-base';
import Display from 'react-native-display';
import AsyncStorage from '@react-native-community/async-storage';
import {FlatList} from 'react-native-gesture-handler';
import moment from 'moment';
import ImagePicker from 'react-native-image-picker';
import Geolocation from '@react-native-community/geolocation';

export default class ListFeed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      feedDisplay:true,
      newPostDisplay:false,
      feeds:"",
      titleNewPost:"",
      descNewPost:"",
      imageUriNewPost:"",
      locationNewPost:"",
      postKey:0,
      orderBy:"date",
      currentPage:1,
      useLocation:"current"
    };
  }

  componentDidMount(){
    // AsyncStorage.removeItem('posts')
    this.loadFeeds();
  }

  async loadFeeds(){
    var stringFeeds = await AsyncStorage.getItem('posts')
     this.setState({feeds:JSON.parse(stringFeeds)})
    this.setState({postKey:this.state.feeds == null ? 0 : this.state.feeds.length })
     
  }

  addPostButton(){
    this.setState({feedDisplay:false,newPostDisplay:true})
    Geolocation.getCurrentPosition(info => this.setState({locationNewPost:info.coords})) 
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
        this.setState({newPostDisplay:false,feedDisplay:true,titleNewPost:"",descNewPost:"",imageUriNewPost:""})
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

  footerFlatList(){
    return (
      <View style={{flexDirection:"row",justifyContent:"center",alignItems:"center"}}>

        {this.state.currentPage == 1 ? <></> :
          <Icon type="FontAwesome" style={{color:"blue",fontSize:20}} 
            onPress={()=> this.setState({currentPage:+this.state.currentPage-1})} 
            name="arrow-circle-left"/>
        }
        {this.state.feeds ? 
          <Text style={{color:"blue",fontSize:20,marginHorizontal:10}}>{this.state.currentPage}</Text>
        : <></>}

        {this.state.feeds ?
          this.state.currentPage*5 < this.state.feeds.length ?
            <Icon type="FontAwesome" style={{color:"blue",fontSize:20}} 
              onPress={()=> this.setState({currentPage:+this.state.currentPage+1})} 
              name="arrow-circle-right"/>
          : <></>
          : <></>
        }
      </View>
    )
  }

  uploadImage(){
    ImagePicker.showImagePicker((response)=> {
      console.log('Response: ' + response)
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };
        this.setState({imageUriNewPost:""+source.uri})
        
      }
    })
  }

  locationCurrent(){
    Geolocation.getCurrentPosition(info => this.setState({locationNewPost:info.coords}))
    this.setState({useLocation:"current"})
  }

  locationMap(){

    this.setState({useLocation:"map"})
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
  }

  render() {
    return (
      <Container>
        <View style={{flex:1}}>
          <Display enable={this.state.feedDisplay}>
            <FlatList data={this.state.feeds} renderItem={({item,index}) => (
              index < this.state.currentPage*5 && index >= (+this.state.currentPage-1)*5 ?
            <Card style={{padding:0,flex:1}}>
              <Icon type="FontAwesome" name="trash" style={stylesListFeed.trashIcon} />
              <CardItem style={{ width: "100%",paddingTop:0,paddingLeft:0,paddingRight:0, margin:0 }}>
                <Image style={{ width: "100%",height:300 }} source={""+item.img != "" ? {uri:""+item.img} : require("../img/descarga.png")} />
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
                    {moment(item.datePosted).format("MM/DD/YYYY")}
                </Text>
                </Body>
              </CardItem>
              <CardItem footer style={{ justifyContent: "center" }}>
                <Text style={stylesListFeed.footerPost}>
                  Posted in {item.location}. See in the map.
                </Text>
              </CardItem>
            </Card>
            :<></>
            )}
            key={item => item.key}
            keyExtractor={item => item.key.toString()}
            ListEmptyComponent={<Text style={{textAlign:"center",color:"gray"}}>You haven't posted anything yet!</Text>}
            ListFooterComponent={this.footerFlatList()}
              
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
              <TouchableOpacity onPress={()=> this.uploadImage()}>
                <CardItem>
                  <View style={{flexDirection:"row"}}>
                    <Icon type="FontAwesome" name="image" /><Text> Upload an image</Text>
                  </View>
                </CardItem>
              </TouchableOpacity>
              <CardItem style={{flexDirection:"column",alignItems:"flex-start"}}>
                <Button style={[this.state.useLocation == "current" ? stylesListFeed.orderSelectedButton : stylesListFeed.orderUnselectedButton,{margin:5}]}
                onPress={()=> this.locationCurrent()}>
                  <Text style={this.state.useLocation == "current" ? stylesListFeed.orderSelectedText : stylesListFeed.orderUnselectedText}>
                    Use current location
                  </Text>
                </Button>
                <Button style={[this.state.useLocation == "map" ? stylesListFeed.orderSelectedButton : stylesListFeed.orderUnselectedButton,{margin:5}]}
                onPress={()=> this.locationMap()}>
                  <Text style={this.state.useLocation == "map" ? stylesListFeed.orderSelectedText : stylesListFeed.orderUnselectedText}>
                    Select location from map
                  </Text>
                </Button>
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
        <Footer style={{height:60,backgroundColor:"white",width:"100%", marginBottom:0,paddingBottom:0, flexDirection:"column",}}>
          <Text style={{marginTop:15,marginBottom:5}}>Order by:</Text>
          <View style={{flexDirection:"row",justifyContent:"space-around",width:"75%"}}>
            <Button style={[this.state.orderBy == "date" ? stylesListFeed.orderSelectedButton : stylesListFeed.orderUnselectedButton,{width:"30%"}]}
             onPress={()=> this.dateSort()}>
              <Text style={this.state.orderBy == "date" ? stylesListFeed.orderSelectedText : stylesListFeed.orderUnselectedText}>
                Date</Text>
            </Button>
            <Button style={[this.state.orderBy == "title" ? stylesListFeed.orderSelectedButton : stylesListFeed.orderUnselectedButton,{width:"30%"}]}
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
    color:"lightyellow",
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
    justifyContent:"center",
    backgroundColor:"lightblue",
    borderWidth:1,
    borderColor:"blue"    
  },
  orderUnselectedButton: {
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
