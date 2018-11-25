import React from 'react';
import renderer from 'react-test-renderer'; // for snapshot
import { Home } from '..'; // get home page
import {
  shallow,
  mount,
  configure,
} from 'enzyme'; // get stuffs from enzyme
import Adapter from 'enzyme-adapter-react-16'; // the adapter
import {
  Button,
  Icon,
} from 'antd'; // require stuff in UI

configure({ adapter: new Adapter() }); // configure

describe('Home Page', () => { // start the test
  console.log(shallow(<Home />).debug()); // check the debug (return the html string)
  console.log(); // for better looking at console.log
  it('Should render home page without any errors', () => {
    expect(renderer.create(<Home />).toJSON()).toMatchSnapshot(); // this is the snapshot test
  });
  const wrapper = shallow(<Home />);
  it('should contains a h1 tag with class name Title with text Rails', () => { // contains method
    expect(wrapper.contains(<h1 className="title">Rails</h1>)).toBe(true); // check if this piece of code(arugment) in the home page or not.
  });
  it('should contains a button with classname home-button and link to signup', () => {
    const component = (
      <Button href="/signup">
      Get Started
        <Icon type="right-circle" theme="filled" />
      </Button>
    );
    expect(wrapper.contains(component)).toBe(false);
    // this false because it missing a classname of button.
  });
  it('should have a class name home-button', () => { // exists method
    expect(wrapper.exists('.home-button')).toBe(true); // this checks if this classname in the homepage or not
  });
  it('should find the class home', () => { // find method
    expect(wrapper.find('.home').length).toBe(1); // check if the amount of classnames match to the arugemnt
  });
  /* find still have work with id, component, text, object property(props)
   find can be combine with a lot of other methods */
  it('should not find a classname title in all className home', () => { // filter method
    expect(wrapper.find('.home').filter('.title').length).toBe(0);// for all home className nodes, no node has title className
  });
  // closest method
  it('get the closest Parent node of className title', () => {
    expect(wrapper.find('.title').closest('.home').length).toBe(1); // this find first element that parent of className title is parent.
  });
  // containsAllMatchingElement
  // this is a advance then contains, this will didn't requre exact the same,
  // all it need to look like
  it('the homepage should contains h1 with text Rails and h5 with text keep students on track', () => {
    expect(wrapper.containsAllMatchingElements([ // arguemnt must be a array
      <h1>Rails</h1>,
      <h5>Keep students on track</h5>,
    ])).toBe(true);
  });
  // containsAnyMatchingElements
  /* this will be true if one of the elemnt of array is in the page */
  it('the homepage should have one of h1 with text Rails, or h1 with text test', () => {
    expect(wrapper.containsAnyMatchingElements([ // arguemnt must be a array
      <h1>Rails</h1>,
      <h1>test</h1>,
      <p>
        “Rails” is a platform for teachers and students.
        Rails will help organize all events in a class.
        From helping set due dates and reminders to providing a
         discussion forum for events in a class.
      </p>,
    ])).toBe(true);
  });
  // containsMatchingElement
  // the different between this and contain is this didn't requre the same, look like
  it('the homepage should have a node look like h1 with text test', () => {
    expect(wrapper.containsMatchingElement(
      <h1>Rails</h1>,
    )).toBe(true);
  });
  // hasClass method
  // check if the node has class or not
  it('Home test should not have test className', () => {
    // if will be true once there is a test className on home div
    expect(wrapper.find('.home').hasClass('test')).toBe(false);
  });
  // type method
  // check the type of the node,if component, it return compoennt
  // for the html, it just pure string
  it('Check the type of a node that is className: home', () => {
    expect(wrapper.find('.home').type()).toBe('div');
  });
  // parent method
  // it is able to check the parent of a node
  it('title should be inside of div', () => {
    expect(wrapper.find('.title').parent().is('div')).toBe(true);
  });
});
