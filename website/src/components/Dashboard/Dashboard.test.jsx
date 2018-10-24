import { Dashboard } from '..';
import React from 'react';
import renderer from 'react-test-renderer';
import { shallow, mount, render, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Button, Card, Icon, Layout } from 'antd';
configure({ adapter: new Adapter() });
const { Content } = Layout;

describe("SampleComponent", () => {
  it('Expect SampleComponent to return a div with its name', () => { // eslint-disable-line no-undef
    const component = renderer.create(
      <Dashboard> <h1> Hello Word </h1></Dashboard>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot(); // eslint-disable-line no-undef
  });
  it('should contains a h1 tag with Hello World as children of Dashboard', () => {
  expect(shallow(<Dashboard> <h1>Hello World</h1></Dashboard>).contains(<h1>Hello World</h1>)).toBe(true)
});
  it('should have a class name called Container', () => {
   expect(shallow(<Dashboard> <h1>Hello World</h1></Dashboard>).exists('.Container')).toBe(true)
 });
})
