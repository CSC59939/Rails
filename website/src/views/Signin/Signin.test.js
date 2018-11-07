import React from 'react';
import renderer from 'react-test-renderer';
import { shallow, mount, render, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Button, Card, Icon } from 'antd';
import { Signin } from '..';
import '../../utils/tests/test.css';

configure({ adapter: new Adapter() });

describe("Signin Page", () => {
  it('Render Signin page without any error', () => { // eslint-disable-line no-undef
    expect(renderer.create(<Signin />).toJSON()).toMatchSnapshot();
  });
})
