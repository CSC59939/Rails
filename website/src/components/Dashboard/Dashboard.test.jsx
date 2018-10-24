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
      <Dashboard children="</h1>Hello World</h1>"/>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot(); // eslint-disable-line no-undef
  });
//   it('should contains a fake user information under the ProfileInfo tag', () => {
//   expect(shallow(<Dashboard  children="</h1>Hello World</h1>"/>).contains(<Content style={{ height: '100%' }}>"</h1>Hello World</h1"</Content>)).toBe(true)
// });
  it('should have a class name called Container', () => {
   expect(shallow(<Dashboard children="</h1>Hello World</h1>"/>).exists('.Container')).toBe(true)
 });
})
