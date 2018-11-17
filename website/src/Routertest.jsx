import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount, render, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { App } from './App';
import { MemoryRouter } from 'react-router';
import {
  Home, Signin, Signup, ProtectedCreateClass, ProtectedJoinClass, NotFound,
  ProtectedDashboardRouter,
} from './views';

configure({ adapter: new Adapter() }); // configure of enzyme and react
describe("Router Test", () => {
  it('/ path should redirect to Home', () => {
    const wrapper = mount( // mount with MemoryRouter, initialEntries is a props for visit different router
      <MemoryRouter initialEntries={[ '/' ]}>
        <App/>
        </MemoryRouter>
      );
    expect(wrapper.find(Home)).toHaveLength(1); // 1 for true, this is home page
    expect(wrapper.find(NotFound)).toHaveLength(0); // 0 for false, this is not NotFound
  });
  // firebase issue
  // it('/signin path should redirect to signin', () => {
  //   const wrapper = mount(
  //     <MemoryRouter initialEntries={[ '/signin' ]}>
  //       <App/>
  //       </MemoryRouter>
  //     );
  //   expect(wrapper.find(Signin)).toHaveLength(1);
  //   expect(wrapper.find(NotFound)).toHaveLength(0);
  // });
  it('random path should redirect to NotFound', () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={[ '/random' ]}>
        <App/>
      </MemoryRouter>
      );
    expect(wrapper.find(NotFound)).toHaveLength(1);
  });
});
