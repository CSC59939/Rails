import React from 'react';
import renderer from 'react-test-renderer';
import {
  configure,
} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import firebase from 'firebase';
import { Signin } from '..';

configure({ adapter: new Adapter() });

describe('Signin', () => {
  jest.spyOn(firebase, 'auth')
    .mockImplementation(() => ({
      currentUser: {
        displayName: 'testDisplayName',
        email: 'test@test.com',
        emailVerified: true,
        getIdToken: () => new Promise(((resolve) => {
          setTimeout(() => {
            resolve(1234);
          }, 0);
        })),
      },
    }));
  it('Render Signin without any eror', () => { // eslint-disable-line no-undef
    expect(renderer.create(<Signin />).toJSON()).toMatchSnapshot();
  });
});
