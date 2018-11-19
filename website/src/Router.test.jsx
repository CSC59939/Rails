import React from 'react';
import { shallow, mount, render, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { App } from './App';
import { MemoryRouter } from 'react-router';
import {
  Home, Signin, Signup, ProtectedCreateClass, ProtectedJoinClass, NotFound,
  ProtectedDashboardRouter,
} from './views';
import config from './views/firebaseconfig';
import firebase from 'firebase/app';
firebase.initializeApp(config);

configure({ adapter: new Adapter() }); // configure of enzyme and react
describe("Router Test", () => {
  // home page
  it('/ path should redirect to Home', () => {
    const wrapper = mount( // mount with MemoryRouter, initialEntries is a props for visit different router
      <MemoryRouter initialEntries={[ '/' ]}>
        <App/>
        </MemoryRouter>
      );
    expect(wrapper.find(Home)).toHaveLength(1); // 1 for true, this is home page
    expect(wrapper.find(NotFound)).toHaveLength(0); // 0 for false, this is not NotFound
  });
  // same format as above
  // Sign In
  it('/signin path should redirect to signin', () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={[ '/signin' ]}>
        <App/>
        </MemoryRouter>
      );
    expect(wrapper.find(Signin)).toHaveLength(1); // check for sign in page
    expect(wrapper.find(NotFound)).toHaveLength(0); // not a 404 page
  });
  // signup
it('/signup path should redirect to signup', () => {
  const wrapper = mount(
    <MemoryRouter initialEntries={[ '/signup' ]}>
      <App/>
      </MemoryRouter>
    );
  expect(wrapper.find(Signup)).toHaveLength(1); // check for sign out page
  expect(wrapper.find(NotFound)).toHaveLength(0); // not a 404 page
});
// create class
it('/create/class path should redirect to signup', () => {
  const wrapper = mount(
    <MemoryRouter initialEntries={[ '/create/class' ]}>
      <App/>
      </MemoryRouter>
    );
  expect(wrapper.find(ProtectedCreateClass)).toHaveLength(1); // check for create page page
  expect(wrapper.find(NotFound)).toHaveLength(0); // not a 404 page
});
// join class
it('/join/class path should redirect to signup', () => {
  const wrapper = mount(
    <MemoryRouter initialEntries={[ '/join/class' ]}>
      <App/>
      </MemoryRouter>
    );
  expect(wrapper.find(ProtectedJoinClass)).toHaveLength(1); // check for join page page
  expect(wrapper.find(NotFound)).toHaveLength(0); // not a 404 page
});
// dashboard router
it('/dashboard path should redirect to signup', () => {
  const wrapper = mount(
    <MemoryRouter initialEntries={[ '/dashboard' ]}>
      <App/>
      </MemoryRouter>
    );
  expect(wrapper.find(ProtectedDashboardRouter)).toHaveLength(1); // check for dashboard page
  expect(wrapper.find(NotFound)).toHaveLength(0); // not a 404 page
});
  // 404 page testing
  it('random path should redirect to NotFound', () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={[ '/random' ]}>
        <App/>
      </MemoryRouter>
      );
    expect(wrapper.find(NotFound)).toHaveLength(1);
  });
});
