import 'react-native';
import {View} from 'react-native';
import {Text} from 'native-base';
import React from 'react';
import ListFeed from '../src/components/ListFeed';
import rerender from 'react-test-renderer';


it('Delete post', () => {
  let LFData = rerender.create(<ListFeed/>).getInstance();
    LFData.showModal(10,12)
        expect(LFData.state.modalLocation).toEqual(true)
        expect(LFData.state.modalLatitude).not.toBeNaN()
        expect(LFData.state.modalLongitude).not.toBeNaN()
})