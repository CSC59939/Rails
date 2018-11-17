import React from 'react';
import renderer from 'react-test-renderer';
import { shallow, mount, render, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Button, Card, Icon } from 'antd';
import {Signup} from '..';

configure({ adapter: new Adapter() });


// problem: firebase
describe("Signup", () => {
  it('Render Signup without any eror', () => { // eslint-disable-line no-undef
    expect(renderer.create(<Signup  />).toJSON()).toMatchSnapshot();
  });
})
