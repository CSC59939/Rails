import React from 'react';
import renderer from 'react-test-renderer';
import { shallow, mount, render, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Button, Card, Icon } from 'antd';
import { EventSummary } from '..';
import '../../utils/tests/test.css';

configure({ adapter: new Adapter() });

describe("EventSummary", () => {
  it('Render without any crash, render the EventSummary', () => { // eslint-disable-line no-undef
    expect(renderer.create(<EventSummary course="Cs103" eventName="Exam" dueDate="Tomorrow" />).toJSON()).toMatchSnapshot();
  });
})
