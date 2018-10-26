import { Dashboard } from '..';
import React from 'react';
import renderer from 'react-test-renderer';
import { shallow, mount, render, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Button, Card, Icon, Layout } from 'antd';
configure({ adapter: new Adapter() });
const { Content } = Layout;

describe("SampleComponent", () => {
  it('Should render the page wtihout any error', () => { // eslint-disable-line no-undef
    expect(renderer.create(<Dashboard> <h1> Hello Word </h1></Dashboard>).toJSON()).toMatchSnapshot();
  });
  it('should contains a h1 tag with Hello World as children of Dashboard', () => {
  expect(shallow(<Dashboard> <h1>Hello World</h1></Dashboard>).contains(<h1>Hello World</h1>)).toBe(true)
});
  it('should have a class name called Container', () => {
   expect(shallow(<Dashboard> <h1>Hello World</h1></Dashboard>).exists('.Container')).toBe(true)
 });
})
