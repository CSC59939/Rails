import React from 'react';
import renderer from 'react-test-renderer';
import {
  configure,
} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MemoryRouter } from 'react-router-dom';
import { DashboardHeader } from './DashboardHeader';

configure({ adapter: new Adapter() });

describe('DashboardHeader', () => { // eslint-disable-line no-undef
  it('Expect DashboardHeader to match snapshot', () => { // eslint-disable-line no-undef
    const component = renderer.create(
      <MemoryRouter>
        <DashboardHeader />
      </MemoryRouter>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot(); // eslint-disable-line no-undef
  });
});
