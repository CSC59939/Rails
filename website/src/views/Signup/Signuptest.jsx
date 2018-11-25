import React from 'react';
import renderer from 'react-test-renderer';
import {
  configure,
} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import firebase from 'firebase';
import { Signup } from '..';

configure({ adapter: new Adapter() });


describe('Signup', () => {
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
  const array = [1, 2, 3];
  const match = {
    params: {
      type: 'student',
    },
  };
  it('Render Signup without any eror', () => {
    expect(renderer.create(<Signup history={array} match={match} />).toJSON()).toMatchSnapshot();
  });
});
