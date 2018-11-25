import React from 'react';
import renderer from 'react-test-renderer';
import { shallow, mount, render, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Button, Card, Icon } from 'antd';
import { SampleComponent } from '..';

configure({ adapter: new Adapter() });

describe("SampleComponent", () => {
  it('Expect SampleComponent to return a div with its name', () => { 
    expect(renderer.create(<SampleComponent />).toJSON()).toMatchSnapshot();
  });
})
