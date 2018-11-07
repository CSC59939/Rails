import React from 'react';
import renderer from 'react-test-renderer';
import { shallow, mount, render, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Button, Card, Icon } from 'antd';
import { ProfileInfo } from '..';
import '../../utils/tests/test.css';

configure({ adapter: new Adapter() });

describe("ProfileInfo", () => {
  it('Render ProfileInfo without any error', () => { // eslint-disable-line no-undef
    expect(renderer.create(<ProfileInfo name='Student' email='Test@email.com'/>).toJSON()).toMatchSnapshot();
  });
})
