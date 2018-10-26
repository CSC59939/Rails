import { HeaderIcons } from '..';
import React from 'react';
import renderer from 'react-test-renderer';
import { shallow, mount, render, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Button, Card, Icon } from 'antd';
import { IconButton } from '..';

configure({ adapter: new Adapter() });

const sampleFunction = () => {
  console.log('Button Circle Clicked')
}
describe("SampleComponent", () => {
  it('Expect SampleComponent to return a div with its name', () => { // eslint-disable-line no-undef
    expect(renderer.create(<HeaderIcons />).toJSON()).toMatchSnapshot();
  });
  it('should have a class name called IconButton', () => {
   expect(shallow(<HeaderIcons />).exists('.HeaderIcons')).toBe(true)
 });
})
