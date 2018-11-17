import React from 'react';
import renderer from 'react-test-renderer';
import { shallow, mount, render, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Button, Card, Icon } from 'antd';
import {Signin} from '..';

configure({ adapter: new Adapter() });


// problem: firebase
describe("Signin", () => {
  it('Render Signin without any eror', () => { // eslint-disable-line no-undef
    expect(renderer.create(<Signin  />).toJSON()).toMatchSnapshot();
  });
})
