import React from 'react';
import renderer from 'react-test-renderer';
import { Profile } from './Profile';
import '../../utils/tests/test.css';
import firebase from 'firebase/app';
import 'firebase/auth';

describe('Profile View', () => {
  it('Expect the Profile page to match snap shot', () => { // eslint-disable-line no-undef
    const component = renderer.create(
      <Profile />
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot(); // eslint-disable-line no-undef
  });
});
