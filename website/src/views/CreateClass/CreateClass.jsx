import React, {Component} from 'react';
import { Form, Input, Tooltip, Icon, Button, Card, DatePicker, TimePicker, Checkbox, Select} from 'antd';
import './CreateClass.css';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

const CheckboxGroup = Checkbox.Group;
const plainOptions = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const format = 'HH:mm';

export default class CreateClass extends Component
{
    constructor(props) {
        super(props);
        this.state = {
            universities: null,
            classname: null,
            sectioncode: null,
            meetingDates: null,
            days: null,
            times: null,
            collegeOptions: null,
        };
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
        
        function DatesOnChange(date, dateString) {
           console.log(date, dateString);
          }

          function TimeOnChange(time, timeString) {
            console.log(time, timeString);
          }
        
        const formItemLayout = {
          labelCol: {
            xs: { span: 24 },
            sm: { span: 9 },
          },
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 9 },
          },
        };
    
        return (
            
            <div className="create">
                <h1 className="title">Rails</h1>
                <h5 className="tag-line">Keep students on track</h5>
                <Card
                    className="createcard"
                    title="Create Class"
                    extra={<a href="/join/class">Already have a class code? Join Class</a>}
                    >
                    <Form className="regiform">
                        <FormItem
                            {...formItemLayout}
                            label="University/College">
                            <Select 
                                size="large"
                                mode="multiple"
                                onSearch={this.getColleges}
                                prefix={<Icon type="bank" />} 
                                placeholder="University"
                                style={{width:'100%'}}
                                onChange={(e)=> this.setState({universities: e})}>
                                {this.state.collegeOptions}
                            </Select>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="Class Name">
                            <Input/>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="Section code">
                            <Input />
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="Meeting Dates">
                            <RangePicker onChange={DatesOnChange} />
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="Days & Times">
                            <CheckboxGroup options={plainOptions}/>
                            <TimePicker format={format} onChange={TimeOnChange}/>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label={(
                                <span>
                                Email Address&nbsp;
                                <Tooltip title="please make sure you're using the pre-approved E-mail address">
                                    <Icon type="question-circle-o" />
                                </Tooltip>
                                </span>
                            )}>
                            <Input />
                        </FormItem>
                        <div className="registerButton" align="center">
                            <Button margin="auto" type="primary" htmlType="submit">Create</Button>
                        </div>
                    </Form>
                </Card>
            </div>
        );
    }
}
