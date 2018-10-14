import React, {Component} from 'react';
import { Form, Input, Button, Card, Tabs} from 'antd';
import './JoinClass.css';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

export default class JoinClass extends Component
{
    
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
                            <Button margin="auto" type="primary" htmlType="submit">Join</Button>
                        </div>
                    </Form>
                </Card>
            </div>
        );
    }
}