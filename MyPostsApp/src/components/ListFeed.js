import React, { Component } from 'react';
import { View,Image, StyleSheet, TouchableOpacity, ActivityIndicator,Platform, PermissionsAndroid,Alert } from 'react-native';
import { Card,CardItem, Body, Header, Container, Content, Fab, Icon, Footer, Button,Text, Input, Toast, CheckBox, ListItem } from 'native-base';
import Display from 'react-native-display';
import AsyncStorage from '@react-native-community/async-storage';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import moment from 'moment';
import ImagePicker from 'react-native-image-picker';
import Geolocation from '@react-native-community/geolocation';
import GeolocationAndroid from 'react-native-geolocation-service';
import MapView, { Marker } from 'react-native-maps';
import Modal from 'react-native-modal';

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
      imageNameNewPost:"",
      latitudeNewPost:0,
      longitudeNewPost:0,
      markerLatitude:"",
      markerLongitude:"",
      postKey:0,
      orderBy:"date",
      currentPage:1,
      useLocation:"current",
      modalLocation:false,
      modalLatitude:0,
      modalLongitude:0,
      uploadingImage:"noImage",
      activeFabOrder:false,
      rerenderFeeds:true
    };
  }

  componentDidMount(){
    //AsyncStorage.removeItem('posts')
    this.loadFeeds();
  }

  async loadFeeds(){
    var stringFeeds = await AsyncStorage.getItem('posts')
     this.setState({feeds:JSON.parse(stringFeeds),rerenderFeeds:!this.state.rerenderFeeds})
     
     if(this.state.feeds){
         this.setState({postKey:+this.state.feeds[0].key+1})
     }else{
        this.setState({postKey: 0})
     }
    
  }

  async updtFeeds(feeds){
    AsyncStorage.setItem('posts',JSON.stringify(feeds));
    //this.loadFeeds()
  }

  async addPostButton(){
    this.setState({feedDisplay:false,newPostDisplay:true})
    
    if(Platform.OS == "ios"){
        Geolocation.getCurrentPosition(info => 
            this.setState({latitudeNewPost:info.coords.latitude, markerLatitude:info.coords.latitude,
            longitudeNewPost:info.coords.longitude, markerLongitude:info.coords.longitude}))    
    }else{
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
        GeolocationAndroid.getCurrentPosition(position => {
            this.setState({latitudeNewPost:position.coords.latitude, markerLatitude:position.coords.latitude,
            longitudeNewPost:position.coords.longitude, markerLongitude:position.coords.longitude})},
        
        (error) => console.log(new Date(), error),
        {enableHighAccuracy: false, timeout: 10000, maximumAge: 3000})    
    }
  }

  async newPostMethod(){
    if(this.state.titleNewPost != ""){
      if(this.state.descNewPost != ""){
        this.setState({postKey: +this.state.postKey+1})
    
        var newPost = 
        {
          key:""+this.state.postKey,
          title:""+this.state.titleNewPost,
          desc:""+this.state.descNewPost,
          img:this.state.imageUriNewPost,
          latitude:this.state.latitudeNewPost,
          longitude:this.state.longitudeNewPost,
          datePosted: new Date()
        }
        var posts = this.state.feeds
        if(posts != null){
          posts.push(newPost)
        }else{
          posts = [newPost]
        }
        posts.sort(function(a,b){
          return new Date(b.datePosted) - new Date(a.datePosted)
        })
        this.updtFeeds(posts)
        this.setState({feeds:posts, newPostDisplay:false,feedDisplay:true,titleNewPost:"",descNewPost:"",imageUriNewPost:"",uploadingImage:"noImage",imageNameNewPost:""})
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
    this.setState({feedDisplay:true,newPostDisplay:false,titleNewPost:"",descNewPost:"",imageUriNewPost:"",uploadingImage:"noImage",imageNameNewPost:""})
  }

    alertDeletePost(keyPost){
      Alert.alert(
          'Delete post',
          'Are you sure you want to delete this post?',
          [
            {
                text: 'Delete post', style:"destructive", onPress: ()=> this.deletePost(keyPost)
            },
            {
                text: 'Cancel', style:"cancel"
            }],
        {cancelable:true})
  }

  async deletePost(keyPost){
    let posts = this.state.feeds
    let postToDelete 
    
    posts.find(function(post,i){
        if(post.key == keyPost){
            postToDelete = i
        }
    })
    posts.splice(postToDelete,1)
    this.setState({feeds:posts,rerenderFeeds:!this.state.rerenderFeeds})
    this.updtFeeds(posts);
  }

  footerFlatList(){
    return (
      <View style={{flexDirection:"row",justifyContent:"center",alignItems:"center",marginVertical:10}}>

        {this.state.currentPage == 1 ? <></> :
          <Icon type="FontAwesome" style={{color:"#364F6B",fontSize:20}} 
            onPress={()=> this.setState({currentPage:+this.state.currentPage-1})} 
            name="arrow-circle-left"/>
        }
        {this.state.feeds ? 
          <Text style={{color:"#364F6B",fontSize:20,marginHorizontal:10}}>{this.state.currentPage}</Text>
        : <></>}

        {this.state.feeds ?
          this.state.currentPage*5 < this.state.feeds.length ?
            <Icon type="FontAwesome" style={{color:"#364F6B",fontSize:20}} 
              onPress={()=> this.setState({currentPage:+this.state.currentPage+1})} 
              name="arrow-circle-right"/>
          : <></>
        : <></>
        }
      </View>
    )
  }

  uploadImage(){
    this.setState({uploadingImage:"loadingImage"})
    ImagePicker.showImagePicker((response)=> {
      if (response.didCancel) {
        this.setState({uploadingImage:"noImage"})
        console.log('User cancelled image picker');
      } else if (response.error) {
        this.setState({uploadingImage:"noImage"})
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        this.setState({uploadingImage:"noImage"})
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };
        this.setState({imageUriNewPost:{uri:Platform.OS == "ios" ? response.uri : "file://"+response.path,width:response.width,height:response.height,mime:"jpg"},
          uploadingImage:"imageLoaded"})
        let uriLen = response.uri.split('/')
        var imgName = response.fileName ? response.fileName : uriLen[uriLen.length-1]
        this.setState({imageNameNewPost:imgName})
        
      }
    })
  }

  async locationCurrent(){
    if(Platform.OS == "ios"){
        Geolocation.getCurrentPosition(info => 
            this.setState({latitudeNewPost:info.coords.latitude,longitudeNewPost:info.coords.longitude}))    
    }else{
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
        GeolocationAndroid.getCurrentPosition(position => {
            this.setState({latitudeNewPost:position.coords.latitude,longitudeNewPost:position.coords.longitude})},
        
        (error) => console.log(new Date(), error),
        {enableHighAccuracy: false, timeout: 10000, maximumAge: 3000})    
    }
    this.setState({useLocation:"current"})
  }

  locationMap(){
    this.setState({useLocation:"map"})
  }

  markerPosition(event){
    this.setState({latitudeNewPost:event.latitude,
                  longitudeNewPost:event.longitude})
  }

  showModal(lat,lon){
    if(!isNaN(lat) && !isNaN(lon)){
      this.setState({modalLocation:true,modalLatitude:parseFloat(lat),modalLongitude:parseFloat(lon)})
    }else{
      Toast.show({
        text:"No geolocation avaliable",
        position:'bottom',
        type:'danger',
        duration:5000
      })
    }
  }

  dateSort(){
    this.setState({orderBy:"date",activeFabOrder:true,currentPage:1})
    var posts = this.state.feeds
    posts.sort(function(a,b){
      return new Date(b.datePosted) - new Date(a.datePosted)
    })
    this.setState({feeds: posts})
  }

  titleSort(){
    this.setState({orderBy:"title",activeFabOrder:true,currentPage:1})
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
            <FlatList data={this.state.feeds} extraData={this.state.rerenderFeeds} renderItem={({item,index}) => (
              index < this.state.currentPage*5 && index >= (+this.state.currentPage-1)*5 ?
            <Card style={{padding:0,flex:1}}>
              <Icon type="FontAwesome" onPress={()=> this.alertDeletePost(item.key)} name="trash" style={stylesListFeed.trashIcon} />
              <CardItem style={{ width: "100%",paddingTop:0,paddingLeft:0,paddingRight:0, margin:0 }}>
                <Image style={{ width: "100%",height:300 }} source={""+item.img != "" ? item.img : require("../img/descarga.png")} />
              </CardItem>
              <CardItem header style={{flexDirection:"column",alignItems:"flex-start"}}>
                <Text style={stylesListFeed.headerPost}>{item.title}</Text>
                <Text style={stylesListFeed.descPost}>
                  {item.desc}
                </Text>
              </CardItem>
              <CardItem style={{ flexDirection: "column" }}>
                <Body>
                <View style={{width:"100%", flexDirection:"row",alignItems:"center",alignContent:"center", justifyContent: 'space-between',}}>
                    <Text style={stylesListFeed.datePost}>
                      {moment(item.datePosted).format("MM/DD/YYYY")}
                  </Text>
                  <TouchableOpacity onPress={()=> this.showModal(item.latitude,item.longitude)}>
                    <Text style={stylesListFeed.footerPost}>
                      Look at the location were this post was made.
                    </Text>
                  </TouchableOpacity>
                </View>
                </Body>
              </CardItem>
              <CardItem footer style={{ justifyContent: "flex-start" }}>
                
              </CardItem>
            </Card>
            :<></>
            )}
            key={(item,index) => index}
            keyExtractor={(item,index) => index.toString()}
            ListEmptyComponent={<Text style={{textAlign:"center",color:"gray"}}>You haven't posted anything yet!</Text>}
            ListFooterComponent={this.footerFlatList()}
              
            />
            <Modal isVisible={this.state.modalLocation}>
              <MapView
                initialRegion={{
                  latitude:this.state.modalLatitude,
                  longitude:this.state.modalLongitude,
                  latitudeDelta:0.0122,
                  longitudeDelta:0.0121
                }}
                style={{width:"100%",height:200}}>
                  <Marker
                    draggable={false}
                    coordinate={{
                      latitude:this.state.modalLatitude,
                      longitude:this.state.modalLongitude
                    }}
                    title={'Your post was submited in this location'}
                  />
              </MapView>
              <Button onPress={()=> this.setState({modalLocation:false})} style={{justifyContent:"center"}}>
                <Text>Ok</Text>
              </Button>
            </Modal>
          </Display>

          <Display enable={this.state.newPostDisplay}>
              <ScrollView>
              <Card>
                <CardItem header>
                  <Text style={{fontWeight:"bold"}}>Title *</Text>
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
                    <View style={{flexDirection:"row",alignItems:"center"}}>
                      <Icon type="FontAwesome" style={{color:"#364f6b"}} name="image" />
                      {this.state.uploadingImage == "loadingImage" ?
                        <View style={{flexDirection:"row"}}>
                          <Text style={{color:"#364f6b"}}>Uploading image... </Text><ActivityIndicator animating size="small" color="#364F6B" />
                        </View>
                      : this.state.uploadingImage == "imageLoaded" ?
                        <Text style={{fontSize:14,color:"#364f6b"}}>{this.state.imageNameNewPost}</Text>
                      : 
                        <Text style={{color:"#364f6b"}}> Upload an image</Text>
                      }
                    </View>
                  </CardItem>
                </TouchableOpacity>
                <CardItem style={{flexDirection:"column",alignItems:"flex-start"}}>
                  {/* <Button style={[this.state.useLocation == "current" ? stylesListFeed.locSelectedButtonSecondary : stylesListFeed.locUnselectedButton,{margin:5}]}
                  onPress={()=> this.locationCurrent()}>
                    <Text style={this.state.useLocation == "current" ? stylesListFeed.locSelectedText : stylesListFeed.locUnselectedText}>
                      Use current location
                    </Text>
                  </Button> */}
                  <ListItem style={{width:"100%",borderBottomWidth:0,flexDirection:"column"}}>
                    <View style={{flexDirection:"row",alignItems:"center"}}>
                      <CheckBox checked={this.state.useLocation == "current"} onPress={()=> this.locationCurrent()}
                      color="#fc5185"/>
                        <Body>  
                          <Text style={{color:"black",fontSize:18}}>Use current location</Text>
                        </Body>
                    </View>
                    {this.state.useLocation == "current" ? 
                    <TouchableOpacity onPress={()=> this.showModal(this.state.latitudeNewPost,this.state.longitudeNewPost)} style={{alignSelf:"flex-start",marginLeft:"10%"}}>
                      <Text style={{color:"#364f6b",textDecorationLine:"underline",marginTop:5}}>
                        View location
                      </Text>
                    </TouchableOpacity>
                    :<></>}
                  </ListItem>
                  <ListItem style={{width:"100%"}}>
                    <CheckBox checked={this.state.useLocation == "map"} onPress={()=>this.locationMap()}
                    color="#fc5185"/>
                    <Body>
                      <Text style={{fontSize:18}}>Select location from map</Text>
                    </Body>
                  </ListItem>
                  {/* <Button style={[this.state.useLocation == "map" ? stylesListFeed.locSelectedButtonSecondary : stylesListFeed.locUnselectedButton,{margin:5}]}
                  onPress={()=> this.locationMap()}>
                    <Text style={this.state.useLocation == "map" ? stylesListFeed.locSelectedText : stylesListFeed.locUnselectedText}>
                      Select location from map
                    </Text>
                  </Button> */}
                </CardItem>
                {this.state.useLocation == "map" ? 
                  <CardItem>
                    <MapView
                      initialRegion={{
                        latitude:this.state.latitudeNewPost,
                        longitude:this.state.longitudeNewPost,
                        latitudeDelta:0.0922,
                        longitudeDelta:0.0421
                      }}
                      style={{width:"100%",height:400}}
                    >
                      <Marker
                        draggable
                        coordinate={{
                          latitude:this.state.markerLatitude,
                          longitude:this.state.markerLongitude
                        }}
                        onDragEnd={(e) => this.markerPosition(e.nativeEvent.coordinate)}
                        title={'New location'}
                        description={'Drag this marker to the new location'}
                      />
                    </MapView>
                  </CardItem>
                :<></>}
                <CardItem style={{justifyContent:"space-around"}}>
                  <Button style={stylesListFeed.postSelectedButton} onPress={()=>this.newPostMethod()}>
                    <Text style={stylesListFeed.postSelectedText}>Post</Text>
                  </Button>
                  <Button style={stylesListFeed.postUnselectedButton} onPress={()=>this.cancelNewPost()}>
                    <Text style={stylesListFeed.postUnselectedText}>Cancel</Text>
                  </Button>
                </CardItem>
              </Card>
              </ScrollView>
              <Modal isVisible={this.state.modalLocation}>
              <MapView
                initialRegion={{
                  latitude:this.state.modalLatitude,
                  longitude:this.state.modalLongitude,
                  latitudeDelta:0.0122,
                  longitudeDelta:0.0121
                }}
                style={{width:"100%",height:200}}>
                  <Marker
                    draggable={false}
                    coordinate={{
                      latitude:this.state.modalLatitude,
                      longitude:this.state.modalLongitude
                    }}
                    title={'This is your current location'}
                  />
              </MapView>
              <Button onPress={()=> this.setState({modalLocation:false})} style={{justifyContent:"center"}}>
                <Text>Ok</Text>
              </Button>
            </Modal>
          </Display>

        </View>

        {this.state.feedDisplay ? 
          <View>
            <Fab
              active={this.state.activeFabOrder}
              position="bottomLeft"
              direction="up"
              style={stylesListFeed.fabButton}
              onPress={() => this.setState({activeFabOrder:!this.state.activeFabOrder})}>
                <View style={stylesListFeed.fabView}>
                <Icon type="FontAwesome" name="filter" style={stylesListFeed.fabOrder}/>
                </View>
                <Button disabled={this.state.feeds == null} style={stylesListFeed.fabButtonSec} onPress={()=>this.dateSort()}>
                  <Icon style={stylesListFeed.fabDateTitle} type="FontAwesome" name="calendar"/>
                </Button>
                <Button disabled={this.state.feeds == null} style={stylesListFeed.fabButtonSec} onPress={()=>this.titleSort()}>
                  <Icon style={stylesListFeed.fabDateTitle} type="FontAwesome" name="font"/>
                </Button>
            </Fab>

            <Fab
              active={this.state.feedDisplay}
              position="bottomRight"
              style={stylesListFeed.fabButton}
              onPress={() => this.addPostButton()}>
                <View style={stylesListFeed.fabView}>
                <Icon name="add" style={stylesListFeed.fabIcon}/>
                </View>
            </Fab>
          </View>
        :<></>}
        
      </Container>
    );
  }
}
const stylesListFeed = StyleSheet.create({
  trashIcon: {
    alignSelf:"center",
    color:"#3FC1C9",
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
    fontSize:14,
    color:"gray",
    textAlign:"left"
  },
  footerPost: {
    fontSize:14,
    color:"#364f6b",
    textDecorationLine:"underline"
  },
  postSelectedButton: {
    width:"40%",
    borderRadius:5,
    justifyContent:"center",
    backgroundColor:"#3FC1C9",
    borderWidth:1,
    borderColor:"#364F6B"    
  },
  postUnselectedButton: {
    width:"40%",
    borderRadius:5,
    justifyContent:"center",
    backgroundColor:"#FFF",
    borderWidth:1,
    borderColor:"#364F6B"
  },
  postSelectedText: {
    color:"#364F6B"
  },
  postUnselectedText: {
    color:"#364F6B"
  },
  locSelectedButtonSecondary: {
    borderRadius:5,
    justifyContent:"center",
    backgroundColor:"#fc5185",
    borderWidth:1,
    borderColor:"#f5f5f5"    
  },
  locUnselectedButton: {
    borderRadius:5,
    justifyContent:"center",
    backgroundColor:"#f5f5f5",
    borderWidth:1,
    borderColor:"#fc5185"
  },
  locSelectedText: {
    color:"#f5f5f5"
  },
  locUnselectedText: {
    color:"#fc5185"
  },
  fabButton: {
    flex:1,
    backgroundColor:"#3FC1C9",
    justifyContent:"center",
    alignItems:"center",
    alignContent:"center",
    alignSelf:"center"
  },
  fabButtonSec: {
    flex:1,
    backgroundColor:"#fc5185",
    justifyContent:"center",
    alignItems:"center",
    alignContent:"center",
    alignSelf:"center"
  },
  fabView: { 
    width:"70%", 
    height:"70%",
    alignItems:"center",
    justifyContent:"center"
  },
  fabIcon:{
    fontSize:40,
    color:"#364F6B"
  },
  fabOrder:{
    fontSize:30,
    color:"#364F6B"
  },
  fabDateTitle:{
    fontSize:25,
    color:"#f5f5f5"
  },
  inputFormat: {
    borderColor:"#3FC1C9",
    borderWidth:1,
    borderRadius:5,
    minHeight:50,
    maxHeight:50
  }
})


//AIzaSyCNIAve5Ck8Wv5krKSoxzJ6jpAJVjYY6T8