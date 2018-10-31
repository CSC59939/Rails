import { DashboardHeader, ProfileInfo } from '..';
import React from 'react';
import renderer from 'react-test-renderer';
import { shallow, mount, render, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Button, Card, Icon } from 'antd';

configure({ adapter: new Adapter() });

describe("SampleComponent", () => {
  it('Should render the page without any error', () => { // eslint-disable-line no-undef
    expect(renderer.create(<DashboardHeader />).toJSON()).toMatchSnapshot();
  });
  it('should contains a fake user information under the ProfileInfo tag', () => {
  expect(shallow(<DashboardHeader  />).contains(<ProfileInfo name="User Name" email="jdoe@gmail.com" />)).toBe(true)
});
  it('should have a class name called Header', () => {
   expect(shallow(<DashboardHeader />).exists('.Header')).toBe(true)
 });
})
