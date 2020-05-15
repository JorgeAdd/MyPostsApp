import 'react-native';
import React from 'react';
import ListFeed from '../src/components/ListFeed';
import rerender from 'react-test-renderer';

it('Addnew post modal', () => {
  let LFData = rerender.create(<ListFeed/>).getInstance();
  LFData.addPostButton()
    expect(LFData.state.feedDisplay).toEqual(false)
    expect(LFData.state.newPostDisplay).toEqual(true)  
})
