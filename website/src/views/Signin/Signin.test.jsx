import React from 'react';
import renderer from 'react-test-renderer';
import {
  shallow, mount, render, configure,
} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Signin } from '..';
import config from '../firebaseconfig';
import firebase from 'firebase/app';

firebase.initializeApp(config);

describe('Signin', () => {
  it('Render Signin without any eror', () => { // eslint-disable-line no-undef
    expect(renderer.create(<Signin />).toJSON()).toMatchSnapshot();
  });
});
