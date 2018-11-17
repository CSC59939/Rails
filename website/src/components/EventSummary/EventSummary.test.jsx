import React from 'react';
import renderer from 'react-test-renderer';
import { shallow, mount, render, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Button, Card, Icon } from 'antd';
import { EventSummary } from '..';

configure({ adapter: new Adapter() });

describe("EventSummary", () => {
  it('Render EventSummary without any eror', () => { // eslint-disable-line no-undef
    expect(renderer.create(<EventSummary course="CS103" eventName="Final exam" dueDate="Friday"/>).toJSON()).toMatchSnapshot();
  });
})
