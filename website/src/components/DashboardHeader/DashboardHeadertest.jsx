import React from 'react';
import renderer from 'react-test-renderer';
import { shallow, mount, render, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {DashboardHeader} from '..';
import config from '../../views/firebaseconfig';
import firebase from 'firebase/app';

firebase.initializeApp(config);

configure({ adapter: new Adapter() });

describe("DashboardHeader", () => {
  it('Render DashboardHeader without any eror', () => { // eslint-disable-line no-undef
    expect(renderer.create(<DashboardHeader />).toJSON()).toMatchSnapshot();
  });
})
