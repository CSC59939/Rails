import React, { Component } from 'react';
import firebase from 'firebase/app';
import {
  Form, Button, Card, Select, message,
} from 'antd';
import { WithProtectedView } from '../../hoc';
import './JoinClass.css';
import 'firebase/auth';

const FormItem = Form.Item;

class JoinClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collegeOptions: [],
      classOptions: {},
      university: null,
      classSelection: null,
      preapproved: true,
      loading: false,
    };
    this.getColleges = this.getColleges.bind(this);
    this.joinclass = this.joinclass.bind(this);
    this.requestclass = this.requestclass.bind(this);
    this.getclassSelection = this.getclassSelection.bind(this);
    this.searchClasses = this.searchClasses.bind(this);
  }

  getColleges(collegeName) {
    const prefix = 'https://api.data.gov/ed/collegescorecard/v1/schools/?fields=school.name&per_page=20&school.name=';
    const name = encodeURI(collegeName);
    const suffix = '&school.operating=1&latest.student.size__range=1..&latest.academics.program_available.assoc_or_bachelors=true&school.degrees_awarded.predominant__range=1..3&school.degrees_awarded.highest__range=2..4&api_key=EvH8zAC2Qq6JywcjnHmNHwBnzGkOwSsVHsjXf2bK';
    fetch(prefix + name + suffix)
      .then(res => res.json())
      .then((result) => {
        this.setState({
          collegeOptions: result.results,
        });
      });
  }

  getclassSelection(collegeName) {
    this.setState({ university: collegeName });
    const reqData = { universityName: collegeName };
    const fetchData = fetch('https://us-central1-rails-students.cloudfunctions.net/getclasses', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(reqData),
    }).then((result) => {
      return result.json();
      this.setState({ loading: false });
    }).catch((err) => {
      this.setState({ loading: false });
      console.log('Get Classes Err', err);
    });
    fetchData.then((data) => {
      if (!data) message.info('No classes found.');
      else message.info(data.message, 3);
      this.setState({
        classOptions: (data && data.classList) ? data.classList : {},
        classSelection: '',
      });
    });
  }

  joinclass() {
    this.setState({ loading: true });
    const { university, classSelection } = this.state;
    const reqData = {
      universityName: university,
      classUid: classSelection,
      studentData: {
        email: firebase.auth().currentUser.email,
        uid: firebase.auth().currentUser.uid,
      },
    };
    const joinFetchData = fetch('https://us-central1-rails-students.cloudfunctions.net/joinclass', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(reqData),
    }).then(result => result.json());
    joinFetchData.then((data) => {
      message.success(data.message);
    });
  }

  requestclass() {
    this.setState({ loading: true });
    const { university, classSelection } = this.state;
    const reqData = {
      universityName: university,
      classUid: classSelection,
      studentEmail: firebase.auth().currentUser.email,
    };
    const joinFetchData = fetch('https://us-central1-rails-students.cloudfunctions.net/requestclass', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(reqData),
    }).then(result => result.json());
    joinFetchData.then((data) => {
      console.log(data);
      message.success(data.message);
    });
  }

  searchClasses(className) {

  }

  render() {
    const {
      collegeOptions, classOptions, preapproved, loading, university, classSelection,
    } = this.state;

    const formItemLayout = {
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
      },
    };

    return (

      <div className="join">
        <h1 className="title">Rails</h1>
        <Card
          className="joinclasscard"
          title="Join Class"
        >
          <Form className="regiform">
            <FormItem
              {...formItemLayout}
            >
              <Select
                size="large"
                showSearch
                onSearch={this.getColleges}
                placeholder="University/College"
                style={{ width: '100%' }}
                onChange={(e) => { this.getclassSelection(e); }}
              >
                {
                    collegeOptions.map(element => (
                      <Select.Option key={element['school.name']}>
                        {element['school.name']}
                      </Select.Option>
                    ))

                }
              </Select>
            </FormItem>
            <FormItem
              {...formItemLayout}
            >
              <Select
                size="large"
                showSearch
                onSearch={this.searchClasses}
                placeholder="Class and Section"
                value={classSelection}
                onChange={(e) => {
                  console.log(e);
                  this.setState({ classSelection: e });
                  const userEmail = firebase.auth().currentUser.email;
                  if (classOptions[e].approvedEmails.indexOf(userEmail) === -1) {
                    this.setState({ preapproved: false });
                    message.info('Not pre-approved. Please request permission.');
                  }
                }}
              >
                {
                  Object.keys(classOptions).map(classUid => (
                    <Select.Option key={classUid}>
                      <p>
                        {classOptions[classUid].name}
                        {' - '}
                        {classOptions[classUid].description}
                        {' by '}
                        {classOptions[classUid].instructorName}
                      </p>
                    </Select.Option>
                  ))
                }
              </Select>
            </FormItem>
            {
              (university && (university.length > 0)) && (classSelection)
                ? (
                  <div>
                    {
              preapproved
                ? (
                  <div className="registerButton">
                    <Button loading={loading} disabled={!preapproved || loading} margin="auto" type="primary" onClick={this.joinclass}>Join Class</Button>
                  </div>
                )
                : (
                  <div className="registerButton">
                    <Button loading={loading} disabled={preapproved || loading} margin="auto" type="primary" onClick={this.requestclass}>Request Permission</Button>
                  </div>
                )
            }
                  </div>
                )
                : null
            }
          </Form>
        </Card>
        <br />
      </div>
    );
  }
}

const ProtectedJoinClass = WithProtectedView(JoinClass);
export { ProtectedJoinClass, JoinClass };
