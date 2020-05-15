import 'react-native';
import React from 'react';
import ListFeed from '../src/components/ListFeed';
import rerender from 'react-test-renderer';

it('Create a new post', () => {
  let LFData = rerender.create(<ListFeed/>).getInstance();
  
  LFData.setState({feeds: [
        {
            key:0,
            title:"title",
            desc:"desc",
            img:"image uri",
            latitude:"lat",
            longitude:"lon",
            datePosted: new Date()
        },
        {
            key:1,
            title:"title1",
            desc:"desc1",
            img:"image uri1",
            latitude:"lat1",
            longitude:"lon1",
            datePosted: new Date()
        }
    ]})
    LFData.setState({titleNewPost:"new title",descNewPost:"new desc",postKey:1})
    LFData.newPostMethod()
        expect(LFData.state.titleNewPost).toEqual("")
        expect(LFData.state.descNewPost).toEqual("")  
        expect(LFData.state.feeds.length).toBe(3)
    
  
})
