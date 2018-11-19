import React from 'react';
import renderer from 'react-test-renderer';
import { shallow, mount, render, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Button, Card, Icon } from 'antd';
import {Headerlcons} from '..';

configure({ adapter: new Adapter() });

describe("Headerlcons", () => {
  it('Render Headerlcons without any eror', () => { // eslint-disable-line no-undef
    expect(renderer.create(<Headerlcons />).toJSON()).toMatchSnapshot();
  });
})
