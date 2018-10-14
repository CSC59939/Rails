import React, {Component} from 'react';
import { Form, Input, Tooltip, Icon, Button, Card, Tabs, DatePicker, TimePicker, Checkbox} from 'antd';
import './CreateClass.css';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const { RangePicker } = DatePicker;

const CheckboxGroup = Checkbox.Group;
const plainOptions = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const format = 'HH:mm';

export default class CreateClass extends Component
{

    render() {
    
        // function callback(key) {
        //     console.log(key);
        //   }
        
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
                    extra={<a href="#">Already have a class code? Join Class</a>}
                    style={{}}>
                    <Form className="regiform">
                        <FormItem
                            {...formItemLayout}
                            label="University/College">
                            <Input/>
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
                        {/* <Tabs className="tab" defaultActiveKey="1" onChange={callback}>
                            <TabPane tab="Student" key="1">
                                <FormItem
                                    {...formItemLayout}
                                    label="Student ID">
                                    <Input/>
                                </FormItem>
                            </TabPane>
                            <TabPane tab="Teacher" key="2">
                                <FormItem
                                    {...formItemLayout}
                                    label="Teacher ID">
                                    <Input/>
                                </FormItem>
                            </TabPane>
                        </Tabs> */}
                        <div className="registerButton" align="center">
                            <Button margin="auto" type="primary" htmlType="submit">Create</Button>
                        </div>
                    </Form>
                </Card>
            </div>
        );
    }
}
