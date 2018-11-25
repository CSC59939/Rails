import React from 'react';
import renderer from 'react-test-renderer';
import { NotFound } from '..';
import '../../utils/tests/test.css';

describe('NotFound View', () => {
  it('Expect the NotFound page to match snap shot', () => {
    const component = renderer.create(
      <NotFound />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
