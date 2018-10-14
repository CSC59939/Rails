import {Button, Card, Icon, Input, Select} from 'antd';
import React, {PureComponent} from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import './Signup.css';

export default class Signup extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            email: null,
            name: null,
            password: null,
            type: null,
            universities: null,
            collegeOptions: null,
            loading: false
        };
        this.getColleges = this.getColleges.bind(this);
        this.signup = this.signup.bind(this);
    }
    componentDidMount() {
        this.setState({
            type: this.props.match.params.type
        });
    }
    getColleges(collegeName) {
        const prefix = "https://api.data.gov/ed/collegescorecard/v1/schools/?fields=school.name&per_page=20&school.name=";
        const name = encodeURI(collegeName);
        const suffix = "&school.operating=1&latest.student.size__range=1..&latest.academics.program_available.assoc_or_bachelors=true&school.degrees_awarded.predominant__range=1..3&school.degrees_awarded.highest__range=2..4&api_key=EvH8zAC2Qq6JywcjnHmNHwBnzGkOwSsVHsjXf2bK";
        fetch(prefix+name+suffix)
        .then(res => res.json())
        .then((result) => {
            const schools = result.results;
            let schoolOptions = [];
            schools.forEach(element => {
                schoolOptions.push(
                <Select.Option key={element['school.name']}>
                    {element['school.name']}
                </Select.Option>);
            });
            this.setState({
                collegeOptions: schoolOptions
            });
        });
    }
    signup() {
        this.setState({loading: true});
        const reqData = {
            universities: this.state.universities,
            name: this.state.name,
            password: this.state.password,
            type: this.state.type,
            email: this.state.email
        };
        fetch("https://us-central1-rails-students.cloudfunctions.net/signup", {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(reqData)
        }).then( (result) => {
            if (result.status === 200) {
                firebase.auth()
                .signInWithEmailAndPassword(this.state.email, this.state.password)
                .then((user)=> {
                    if (user) {
                        window.location = "/dashboard";
                    }
                });
            }
        }).catch((err) => {
            console.log('Signup Err',err);
        });
        this.setState({loading: false});
    }
    render() {
         return(
            <div className="signup">
                <h1 className="title">Rails</h1>
                <h5 className="tag-line">Keep students on track</h5>
                <Card 
                    className="signup-card"
                    title="Sign Up"
                    extra={
                        this.state.type !== 'student' && this.state.type !== 'teacher' ?
                        null:
                        <Button href="/signup"><Icon type="arrow-left" /></Button>
                    }
                >
                {
                    this.state.type !== 'student' && this.state.type !== 'teacher'?
                    <div>
                        <Button href="/signup/student" block style={{marginBottom: 7}}>
                            I am a student
                        </Button>
                        <Button href="/signup/teacher" block type="primary">
                            I am an instructor
                        </Button> 
                    </div>:
                    <div>
                        <Select 
                            size="large"
                            mode="multiple"
                            onSearch={this.getColleges}
                            prefix={<Icon type="bank" />} 
                            placeholder="University"
                            style={{width:'100%'}}
                            onChange={(e)=> this.setState({universities: e})}
                        >
                            {this.state.collegeOptions}
                        </Select>
                        <Input 
                            size="large"
                            placeholder="Full Name" 
                            prefix={<Icon type="user" />} 
                            style={{marginTop:10}} 
                            value={this.state.name} 
                            onChange={(e)=>{this.setState({name: e.target.value})}}
                        />
                        <Input 
                            size="large"
                            placeholder="E-Mail" 
                            prefix={<Icon type="mail" />} 
                            style={{marginTop:10}} 
                            type="email"
                            onChange={(e)=>{this.setState({email: e.target.value})}}
                        />
                        <Input 
                            size="large"
                            placeholder="Password" 
                            prefix={<Icon type="ellipsis" />} 
                            style={{marginTop:10}} 
                            type="password"
                            onChange={(e)=>{this.setState({password: e.target.value})}}
                        />
                        <Button size="large" block style={{marginTop: 10}} onClick={this.signup} disabled={this.state.loading}>
                        {
                            this.state.loading ?
                            <Icon type="loading" />:
                            <div>
                                <Icon type="check-circle" style={{marginRight: 5}} />
                                Sign Up
                            </div>
                        }
                        </Button>
                    </div>
                }
                </Card>
            </div>
        );
    }
}