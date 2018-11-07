import React from 'react';
import renderer from 'react-test-renderer';
import { shallow, mount, render, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Button, Card, Icon } from 'antd';
import { CreateClass } from '..';
import '../../utils/tests/test.css';
 configure({ adapter: new Adapter() });
 describe("CreateClass Page", () => {
  it('Render CreateClass page without any error', () => { // eslint-disable-line no-undef
    expect(renderer.create(<CreateClass />).toJSON()).toMatchSnapshot();
  });
})
