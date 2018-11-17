import React from 'react';
import renderer from 'react-test-renderer';
import { shallow, mount, render, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Button, Card, Icon } from 'antd';
import { EventSummaryCollection } from '..';

configure({ adapter: new Adapter() });

const classArray =
  {
    date: 'Oct. 24',
    events: [
      {
        course: 'CSC 342',
        eventName: 'Review of First Exam',
        dueTime: '3:30pm',
        color: '#d83a42',
      },
      {
        course: 'CSC 220',
        eventName: 'Homework 1',
        dueTime: '5:00pm',
        color: '#62c4f9',
      },
    ],
  };

// problem need unique key for each iteration
describe("EventSummaryCollection", () => {
  it('Render EventSummaryCollection without any eror', () => { // eslint-disable-line no-undef
    expect(renderer.create(<EventSummaryCollection event ={classArray}/>).toJSON()).toMatchSnapshot();
  });
})
