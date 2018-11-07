import React from 'react';
import renderer from 'react-test-renderer';
import { shallow, mount, render, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Button, Card, Icon } from 'antd';
import { JoinClass } from '..';
import '../../utils/tests/test.css';
 configure({ adapter: new Adapter() });
 describe("JoinClass Page", () => {
  it('Render JoinClass page without any error', () => { // eslint-disable-line no-undef
    expect(renderer.create(<JoinClass />).toJSON()).toMatchSnapshot();
  });
})
