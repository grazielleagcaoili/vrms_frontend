import { MailOutlined } from '@ant-design/icons';
import { Input, Button, Form, Row, Col, Modal } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import React, {useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import {onUserLogin } from '@services/authAPI';
import { useSelector, useDispatch } from 'react-redux';


function Login() {
  const  history = useHistory();
  const dispatch = useDispatch();
  
  const [user, setUser] = useState({email:"", password:""});

  async function onSubmit(){
    const getUser = {
      email: user.email,
      password: user.password
    }
    try {
      let result = await onUserLogin(getUser)
      console.log(result)
      localStorage.setItem("accessToken", result.data.accessToken);
      localStorage.setItem("refreshToken", result.data.token.refreshToken);

      dispatch({
        type: "SET_USER",
        value: result.data.data
     })
      
      dispatch({
        type: "VERIFIED_AUTHENTICATION",
        value: true
     })
    
      history.push('/dash ')

    } catch (error) {
      alert("Invalid email or Pasword")
      console.log('error', error)
    }
  }
 
   const onFinishFailed = (errorInfo) => {
     console.log('Failed:', errorInfo);
   };      
  

  return (
    <body style={{background: '#f2f2f2', minHeight: "100vh"}}>
    <Row justify="center">
    <Col  >
      <Form style={{marginTop: "50%"}} name="basic"initialValues={{remember: true,}} onFinish={onSubmit} onFinishFailed={onFinishFailed}>
      
    <Col sm={24}>
    <h1 style={{fontFamily: "Montserrat", fontWeight: "bolder"}}>VIRTUAL REASEARCH MANAGEMENT SYSTEM</h1>
    <Row justify="center">
      <div >
        <Form.Item name="email"  
            rules={[
            {
              required: true,
              message: 'Please input your email!',
            },
            ]}
        >
          <Input  placeholder="Enter Email" prefix={<MailOutlined />} onChange={e => setUser({...user, email: e.target.value})} value={user.email}/>
        </Form.Item>

        <Form.Item name="password" 
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
          >
            <Input.Password placeholder="Enter password" iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} onChange={e => setUser({...user, password: e.target.value})} value={user.password}/>
        </Form.Item>
        <Button type= "link" style={{fontFamily: "Montserrat",color: "#000000", float: 'right'}}> Forgot your Password?</Button>
      </div> 
      </Row>  
    </Col> 
     
    <Col>  
      <Row justify="center">
        <Form.Item >
        <Button style={{background: "#A0BF85", borderRadius: "5px"}} htmlType="submit" >LOGIN</Button>
        </Form.Item>   
      </Row>    
    </Col>     
    </Form>
    </Col>
    </Row>
    </body>
  )
}


export default Login;