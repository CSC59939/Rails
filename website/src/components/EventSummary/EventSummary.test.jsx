import React from 'react';
import renderer from 'react-test-renderer';
import {
  configure,
  shallow,
} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { EventSummary } from '..';

configure({ adapter: new Adapter() });

describe('EventSummary', () => {
  it('Render EventSummary without any eror', () => {
    expect(renderer.create(<EventSummary course="CS103" eventName="Final exam" dueDate="Friday" />).toJSON()).toMatchSnapshot();
  });
});

/* Enzyme */
const wrapper = shallow(<EventSummary />);
describe('EventSummary shallow', () => {
  it('Course should exist', () => {
    expect(wrapper.find('.course').closest('.EventSummary').length).toBe(1);
  });
  it('Eventname should exist', () => {
    expect(wrapper.find('.eventName').closest('.EventSummary').length).toBe(1);
  });
  it('Due date should exist', () => {
    expect(wrapper.find('.dueDate').closest('.EventSummary').length).toBe(1);
  });
})