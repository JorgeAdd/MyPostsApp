import 'react-native';
import React from 'react';
import ListFeed from '../src/components/ListFeed';
import rerender from 'react-test-renderer';

test('ListFeed snapShot', () => {
  const snap = rerender.create(
      <ListFeed/>
  ).toJSON();
expect(snap).toMatchSnapshot();
})
