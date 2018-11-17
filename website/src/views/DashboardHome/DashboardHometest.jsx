import React from 'react';
import renderer from 'react-test-renderer';
import { shallow, mount, render, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Button, Card, Icon } from 'antd';
import {DashboardHome} from '..';

configure({ adapter: new Adapter() });


// problem: need key for each iteration
describe("DashboardHome", () => {
  it('Render DashboardHome without any eror', () => { // eslint-disable-line no-undef
    expect(renderer.create(<DashboardHome  />).toJSON()).toMatchSnapshot();
  });
})
