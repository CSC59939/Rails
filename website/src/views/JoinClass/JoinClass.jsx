import React, {Component} from 'react';
import { Form, Input, Button, Card, Tabs, Select} from 'antd';
import './JoinClass.css';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

export default class JoinClass extends Component
{
    constructor(props) {
        super(props);
        this.state={
            university: null,
            classSelection: null,
            studentID: null,
            email: null
        }
        this.getColleges = this.getColleges.bind(this);
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
    
    render() {
    
        function callback(key) {
            console.log(key);
          }
        
        const formItemLayout = {
          labelCol: {
            xs: { span: 24 },
            sm: { span: 9 },
          },
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 7 },
          },
        };
    
        return (
            
            <div className="join">
                <h1 className="title">Rails</h1>
                <h5 className="tag-line">Keep students on track</h5>
                <Card
                    className="joinclasscard"
                    title="Join Class"
                    extra={<a href="#"></a>}
                    >
                    <Form className="regiform">
                        <FormItem
                            {...formItemLayout}
                            label="University/College">
                            <Select
                                size="default"
                                mode="multiple"
                                onSearch={this.getColleges}
                                placeholder="University"
                                style={{width:'100%'}}
                                onChange={(e)=> this.setState({universities: e})}>
                                {this.state.collegeOptions}
                            </Select>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="Class and Section code">
                            <Select 
                                placeholder="Ex: CSC22000 - Algorithm"
                                mode="multiple" />
                        </FormItem>
                        <div className="registerButton">
                            <Button margin="auto" type="primary" htmlType="submit">Join</Button>
                        </div>
                    </Form>
                </Card>
                <br/>
                <Card
                    className="request_permission"
                    title="Request Permission"
                    extra={<a href="#"></a>}
                    >
                    <Form className="permission_form">
                        <FormItem
                            {...formItemLayout}
                            label="Class and Section code">
                            <Select 
                                placeholder="Ex: CSC22000 - Algorithm"
                                mode="multiple" />
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="Student ID">
                            <Input placeholder="Student ID #"/>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="College Email">
                            <Input/>
                        </FormItem>
                        <div className="registerButton">
                            <Button margin="auto" type="primary" htmlType="submit">Join</Button>
                        </div>
                    </Form>
                </Card>
            </div>
        );
    }
}