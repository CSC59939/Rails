import React from 'react';
import renderer from 'react-test-renderer';
<<<<<<< HEAD
import {
  configure,
} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { JoinClass } from '..';
=======
import { shallow, mount, render, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Button, Card, Icon } from 'antd';
import {JoinClass} from '..';
>>>>>>> 41da03204041acd64017a68531435ba919958411

configure({ adapter: new Adapter() });


<<<<<<< HEAD
describe('JoinClass', () => {
  it('Render JoinClass without any eror', () => { // eslint-disable-line no-undef
    expect(renderer.create(<JoinClass />).toJSON()).toMatchSnapshot();
  });
});
=======
describe("JoinClass", () => {
  it('Render JoinClass without any eror', () => { // eslint-disable-line no-undef
    expect(renderer.create(<JoinClass  />).toJSON()).toMatchSnapshot();
  });
})
>>>>>>> 41da03204041acd64017a68531435ba919958411
