import { ProfileInfo } from '..';
import React from 'react';
import renderer from 'react-test-renderer';
import { shallow, mount, render, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Button, Card, Icon } from 'antd';

configure({ adapter: new Adapter() });

describe("SampleComponent", () => {
  it('Expect SampleComponent to return a div with its name', () => { // eslint-disable-line no-undef
    const component = renderer.create(
      <ProfileInfo name="User" email="User@gmail.com" />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot(); // eslint-disable-line no-undef
  });
  it('should contains a p tag with class name name with corresponding argument name(User)', () => {
  expect(shallow(<ProfileInfo name="User" email="User@gmail.com"/>).contains(<p className="name">User</p>)).toBe(true)
});
 it('should have a class name called email', () => {
  expect(shallow(<ProfileInfo name="User" email="User@gmail.com"/>).exists('.email')).toBe(true)
});
})
