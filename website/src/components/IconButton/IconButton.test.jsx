import React from 'react';
import renderer from 'react-test-renderer';
import {
  shallow,
  configure,
} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { IconButton } from '..';

configure({ adapter: new Adapter() });

const sampleFunction = () => {

};
describe('IconButton', () => {
  it('Render IconButon without any errors', () => {
    const component = renderer.create(
      <IconButton type="setting" onClick={sampleFunction} />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('should have a type called settings', () => {
    expect(shallow(<IconButton type="settings" onClick={sampleFunction} />).find({ type: 'settings' }).length).toBe(1);
  });
  it('should have a type called add_box', () => {
    expect(shallow(<IconButton type="add_box" onClick={sampleFunction} />).find({ type: 'add_box' }).length).toBe(1);
  });
  it('should have a type called add_alert', () => {
    expect(shallow(<IconButton type="add_alert" onClick={sampleFunction} />).find({ type: 'add_alert' }).length).toBe(1);
  });
  it('should have a type called exit_to_app', () => {
    expect(shallow(<IconButton type="exit_to_app" onClick={sampleFunction} />).find({ type: 'exit_to_app' }).length).toBe(1);
  });
  it('should have a type called notifications_active', () => {
    expect(shallow(<IconButton type="notifications_active" onClick={sampleFunction} />).find({ type: 'notifications_active' }).length).toBe(1);
  });
});
