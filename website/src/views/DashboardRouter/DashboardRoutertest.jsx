import React from 'react';
import renderer from 'react-test-renderer';
import { configure } from 'enzyme'; // add swallow, mount, render for better use of enzyme
import Adapter from 'enzyme-adapter-react-16';
import { DashboardRouter } from '..';
import config from '../firebaseconfig';
import firebase from 'firebase/app';
import { MemoryRouter } from 'react-router'
firebase.initializeApp(config);

configure({ adapter: new Adapter() });
// problem: router
describe('DashboardRouter', () => {
  it('Render DashboardRouter without any eror', () => { // eslint-disable-line no-undef
    expect(renderer.create(<MemoryRouter> <DashboardRouter /></MemoryRouter>).toJSON()).toMatchSnapshot();
  });
});
