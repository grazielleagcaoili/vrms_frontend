import logo from '/Users/user/vrms/vrms_frontend/src/components/images/logo.png'
import { Tabs} from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';
import '/Users/user/vrms/vrms_frontend/src/styles/CSS/Account.css'
import {EyeInvisibleOutlined, EyeTwoTone, BookFilled, UserOutlined} from '@ant-design/icons';
import { Layout, Form, Button, Input, Row, Col, Typography, Progress, Avatar} from 'antd'
import { useSelector} from 'react-redux';
import { onChangePassword } from '/Users/user/vrms/vrms_frontend/src/services/userAPI';
import React, {useState} from 'react';
import { onUserLogout } from '../../services/authAPI';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { onUploadAvatar } from '/Users/user/vrms/vrms_frontend/src/services/uploadAPI';

const { Header, Content} = Layout;

const Userdash = () => {
    let history= useHistory();
    const dispatch = useDispatch();
    const { Title } = Typography;

    const userObj = useSelector(state => state.userReducer) //reducer for user data
    const tabs = [
        { title: 'Research', sub: '1' },
        { title: 'Account', sub: '2' },
      ];

      const [password, setPassword] = useState({oldPassword: "", newPassword: "", confrimPassword: ""}) //for changepassword
      const[file, setFile] = useState(); // for uploading avatar
    //for change password
    const handleLogout = async () => { 
        try {
          const tokens = {
            refreshToken: localStorage.getItem("refreshToken"),
            accessToken: localStorage.getItem("accessToken")
          }
          
          onUserLogout(tokens)
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          dispatch({
            type: "VERIFIED_AUTHENTICATION",
            value: false
         })
          history.push('/')
        } catch (error) {
          console.error(error)
          alert(error.response.data.error);
        }
      };

    async function onSubmit(){  //for password changing
       try {
         console.log(userObj.USER._id)
          const data = {
            id : userObj.USER._id,
            newPass: password.newPassword,
            oldPass: password.oldPassword
          }
           if(password.newPassword !== password.confrimPassword){
               if(password.newPassword|| password.confrimPassword|| password.oldPassword === null){
                   alert("Please complete all fields!")
                }else{alert("Password does not match!")} 
           }else{
              await onChangePassword(data)
              alert("Password Updated")
          }
       } catch (error) {
          console.log(error)
          alert("Invalid password")
       }
    }

    const manage = async ()=>{
        try {
          history.push('/datagrid')
        } catch (error) {
          console.log(error)
        }
      }

    

    return (
        <div>
        <Layout>
          <Header style={{background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <img src={logo} className="logo" style={{left:'0px', top:'2.5px', height:'60px', width:'60px', marginLeft:'2.5px'}}></img>
            <h1 style={{fontFamily: "Bangla MN", fontWeight: "bolder", fontSize:'125%'}}>Virtual Research Management System</h1>
          </Header>
          <Content style={{display:'flex', flexDirection:'row', justifyContent:'center'}}>
            <Tabs tabs={tabs} initialPage={1} tabBarPosition="bottom" renderTab={tab => <span>{tab.title}</span>}>
            <div style={{ display: 'grid', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f2f2f2', padding:'20px', fontFamily: "Montserrat" }} >
            
              <div style={{background: '#FFFFFF', borderRadius:'5px', padding: '10px'}}>
              <Row>
                  <Col xs={{span: 12}}>
                  <BookFilled style={{fontSize:'100px', display: 'flex', alignItems: 'center', justifyContent:'center', marginTop: '50px'}} />
                  </Col>
                  <Col xs={{span: 12}}>
                  <Title level={3}>Lorem Ipsum dolot</Title>
                  <p>00000001</p>
                  <p><label>Date Created:</label> July 01, 2021</p>
                  <p><label>Date Updated:</label> July 01, 2021</p>
                  <Progress percent={80} size="small" />
                  <Button style={{float: 'right',  background: '#A0BF85', borderRadius:'5px'}} onClick={manage}>Manage</Button>
                  </Col>
                  </Row>
                </div>
                <div style={{background: '#FFFFFF', borderRadius:'5px', padding: '10px'}}>
              <Row>
                  <Col xs={{span: 12}}>
                    <BookFilled style={{fontSize:'100px', display: 'flex', alignItems: 'center', justifyContent:'center', marginTop: '50px'}} />
                  </Col>
                  <Col xs={{span: 12}}>
                  <Title level={3}>Lorem Ipsum dolot</Title>
                  <p>00000001</p>
                  <p><label>Date Created:</label> July 01, 2021</p>
                  <p><label>Date Updated:</label> July 01, 2021</p>
                  <Progress percent={30} size="small" />
                  <Button style={{float: 'right',  background: '#A0BF85', borderRadius:'5px', bottom: '0px'}} onClick={manage}>Manage</Button>
                  </Col>
                  </Row>
                </div>
            </div>

              <div style={{ display: 'grid', alignItems: 'center',  minHeight: '100vh', backgroundColor: '#f2f2f2', padding:'20px', fontFamily: "Montserrat"}} >
               <Form style={{background:'#FFFFFF', borderRadius: '5px'}}>
                <Row>
                <Col xs={{span: 10}} style={{padding:'25px'}}>
                <div style={{marginTop:'15px'}} >
              <Avatar size={90} style={{marginLeft:'12px'}} icon={<UserOutlined />} />
              <label for="file_input_id">Upload Photo</label>
              <input type="file" id="file_input_id" accept=".png" onChange={e => {
                const file = e.target.files[0]
                setFile(file)
                const data = new FormData()
                data.append("file", file)
                onUploadAvatar(data)
              }
            }
              ></input>
              </div>
                </Col>
                <Col xs={{span: 14}}>
                <div style={{justifyContent:'center', display:'grid', alignItems:'center', padding:'25px'}}>
               <Title style={{margin: '0px'}} level={3}>{userObj.USER.name}</Title>
                <p style={{margin: '0px'}}>{userObj.USER.title}</p>
                <p style={{margin: '0px'}}>{userObj.USER.project}</p>
                <p style={{margin: '0px'}}>{userObj.USER.email}</p>
                </div>
                </Col>
                </Row>
                </Form>
                <Form style={{background:'#FFFFFF', borderRadius: '5px', fontFamily: "Montserrat", display: 'grid', justifyItems: 'center' }} onFinish={onSubmit}>
                    <Title level={2}>CHANGE PASSWORD</Title>
                    <Form.Item name="currentPassword" style={{maxWidth:"50%"}}
                rules={[
                  {
                    required: true,
                    message: 'Please current your password!',
                  },
                ]}
            >
              <label>Current Password</label>
              <Input.Password placeholder="Current Password" iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} 
              onChange={e => setPassword({...password, oldPassword: e.target.value})} value={password.oldPassword}
            />
            </Form.Item>
            <Form.Item name="newPassword" style={{maxWidth:"50%"}}
              rules={[
              {
                required: true,
                message: 'Please input your new password!',
              },
            ]}
            >
            <label>New Password</label>
            <Input.Password placeholder="New Password" iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} 
              onChange={e => setPassword({...password, newPassword: e.target.value})} value={password.newPassword}/>
            </Form.Item>
            <Form.Item name="confirmPassword" style={{maxWidth:"50%"}}
                rules={[
                  {
                    required: true,
                    message: 'Please confirm your new password!',
                  },
                ]}
            >
              <label>Confirm Password</label>
              <Input.Password placeholder="Confirm New Password" iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} 
              onChange={e => setPassword({...password, confrimPassword: e.target.value})} value={password.confrimPassword}
            />
            </Form.Item>
            <Form.Item>
              <Button htmlType="submit" style={{background: "#A0BF85", borderRadius: "5px"}}>SUBMIT</Button>
            </Form.Item>
        </Form>
            <Form>
                <Button block onClick={handleLogout} style={{background:"#A0BF85"}} >Logout</Button>
            </Form>
              </div>
            </Tabs>
          </Content>
        </Layout>
      </div>
    )
}

export default Userdash
