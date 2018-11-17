import React, { PureComponent } from 'react';
import {
  Form, Input, Tooltip, Icon, Button, Card, TimePicker, Checkbox, Select, message,
} from 'antd';
import './CreateClass.css';
import firebase from 'firebase';
import 'firebase/auth';
import { WithProtectedView } from '../../hoc';

const FormItem = Form.Item;
// const { RangePicker } = DatePicker;

const CheckboxGroup = Checkbox.Group;
const plainOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const format = 'HH:mm';

class CreateClass extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      universities: null,
      classname: null,
      sectioncode: null,
      fromtime: null,
      totime: null,
      collegeOptions: null,
      email: [],
      loading: false,
      Monday: false,
      Tuesday: false,
      Wednesday: false,
      Thursday: false,
      Friday: false,
      Saturday: false,
      Sunday: false,
    };
    this.getColleges = this.getColleges.bind(this);
    this.createclass = this.createclass.bind(this);
    this.timeFromChange = this.timeFromChange.bind(this);
    this.timeToChange = this.timeToChange.bind(this);
    this.checkOnChange = this.checkOnChange.bind(this);
  }

  getColleges(collegeName) {
    const prefix = 'https://api.data.gov/ed/collegescorecard/v1/schools/?fields=school.name&per_page=20&school.name=';
    const name = encodeURI(collegeName);
    const suffix = '&school.operating=1&latest.student.size__range=1..&latest.academics.program_available.assoc_or_bachelors=true&school.degrees_awarded.predominant__range=1..3&school.degrees_awarded.highest__range=2..4&api_key=EvH8zAC2Qq6JywcjnHmNHwBnzGkOwSsVHsjXf2bK';
    fetch(prefix + name + suffix)
      .then(res => res.json())
      .then((result) => {
        const schools = result.results;
        const schoolOptions = [];
        schools.forEach((element) => {
          schoolOptions.push(element['school.name']);
        });
        this.setState({
          collegeOptions: schoolOptions,
        });
      });
  }

  getSchoolOptions() {
    const { collegeOptions } = this.state;
    const schools = collegeOptions;
    return schools.map(v => (
      <Select.Option key={v}>
        {v}
      </Select.Option>));
  }

  createclass() {
    this.setState({ loading: true });
    const {
      universities, classname, sectioncode, email, fromtime, totime,
    } = this.state;
    const reqData = {
      universityName: universities,
      classData: {
        name: sectioncode,
        description: classname,
        instructorName: firebase.auth().currentUser.email,
        approvedEmails: email,
        meetingTimes: {
          from: fromtime,
          to: totime,
        },
      },
      meetingDays: {
        Monday: false,
        Tuesday: false,
        Wednesday: false,
        Thursday: false,
        Friday: false,
        Saturday: false,
        Sunday: false,
      },
    };
    const createFetchData = fetch('https://us-central1-rails-students.cloudfunctions.net/createclass', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(reqData),
    }).then((result) => {
      if (result.status === 200) {
        return result.json();
      }
    });
    createFetchData.then((data) => {
      message.success(data.message);
      window.location.reload();
    });
  }

  timeFromChange(time, timeString) {
    this.setState({ fromtime: timeString });
  }

  timeToChange(time, timeString) {
    this.setState({ totime: timeString });
  }

  checkOnChange(checkedValues) {
    const days = {
      Monday: false,
      Tuesday: false,
      Wednesday: false,
      Thursday: false,
      Friday: false,
      Saturday: false,
      Sunday: false,
    };
    checkedValues.forEach((day) => {
      days[day] = true;
    });
    this.setState({
      Monday: days[0],
      Tuesday: days[1],
      Wednesday: days[2],
      Thursday: days[3],
      Friday: days[4],
      Saturday: days[5],
      Sunday: days[6],
    });
  }

  render() {
    // function DatesOnChange(date, dateString) {
    //   this.setState({});
    //   console.log(dateString);
    // }

    const {
      collegeOptions, loading, fromtime, totime,
      Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday,
    } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 24 },
      },
    };

    return (

      <div className="create">
        <h1 className="title">Rails</h1>
        <Card
          className="createcard"
          title="Create Class"
          extra={<a href="/join/class">Already have a class code? Join Class</a>}
        >
          <Form className="regiform">
            <FormItem
              {...formItemLayout}
            >
              <Select
                showSearch
                size="default"
                onSearch={this.getColleges}
                prefix={<Icon type="bank" />}
                placeholder="University/College"
                style={{ width: '100%' }}
                onChange={e => this.setState({ universities: e })}
              >
                {collegeOptions && this.getSchoolOptions()}
              </Select>
            </FormItem>
            <FormItem
              {...formItemLayout}
            >
              <Input
                onChange={(e) => { this.setState({ classname: e.target.value }); }}
                placeholder="Class Name"
              />
            </FormItem>
            <FormItem
              {...formItemLayout}
            >
              <Input
                onChange={(e) => { this.setState({ sectioncode: e.target.value }); }}
                placeholder="Section code"
              />
            </FormItem>
            {/* <FormItem
              {...formItemLayout}
            >
              <span>
                                Meeting Dates&nbsp;
              </span>
              <RangePicker onChange={DatesOnChange} />
            </FormItem> */}
            <FormItem
              {...formItemLayout}
            >
              <span>
                                Days & Times&nbsp;
              </span>
              <CheckboxGroup options={plainOptions} onChange={this.checkOnChange} />
              <span>
                                From:&nbsp;
              </span>
              <TimePicker onChange={this.timeFromChange} format={format} />
              &nbsp;&nbsp;
              <span>
                                To:&nbsp;
              </span>
              <TimePicker onChange={this.timeToChange} format={format} />
            </FormItem>
            <FormItem
              {...formItemLayout}
            >
              <Tooltip title="please make sure you're using the pre-approved E-mail address">
                <Icon type="question-circle-o" />
              </Tooltip>
              <Input onChange={(e) => { this.setState({ email: e.target.value }); }} placeholder="Email" />
            </FormItem>
            <div className="registerButton" align="center">
              <Button margin="auto" type="primary" onClick={this.createclass} loading={loading}>Create</Button>
            </div>
          </Form>
        </Card>
      </div>
    );
  }
}

const ProtectedCreateClass = WithProtectedView(CreateClass);
export { CreateClass, ProtectedCreateClass };
