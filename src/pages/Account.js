import { useHistory } from 'react-router-dom';
import { Layout, Menu, Button, Form, Input} from 'antd'
import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import logo from '../components/images/logo.png'
import { BookOutlined, UserOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import Sidebar from '../components/components/Sidebar'
import { onChangePassword } from '../services/userAPI';



const { Header, Content, Sider } = Layout;

const Account = () => {
    let history= useHistory();
    const dispatch = useDispatch();
    const userObj = useSelector(state => state.userReducer)
    console.log(userObj.USER._id)
    const [password, setPassword] = useState({oldPassword: "", newPassword: "", confrimPassword: ""})

    async function onSubmit(){
       try {
           if(password.newPassword != password.confrimPassword){
            alert("Password does not match!")
           }
           if(password.oldPassword == userObj.USER.password){
            await onChangePassword(password)
            alert("Successfully Updated Password")
           }alert("Invalid Password")
       } catch (error) {
           console.log(error)
       }
    }
    
    const handleLogout = async () => {
        try {
    
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

    return (
        <div>
            <Layout  > 
      <Sider  style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        background:'white'
      }} >
        <Sidebar></Sidebar>
      </Sider>
    <Layout style={{ marginLeft: 200 }}>
      <Header style={{ padding: 0, background:'#f2f2f2' }} >
      <a href="/dash"style={{padding: '25px', fontSize: '32px', color: 'black', fontFamily: 'Montserrat'}} >Account</a>
        <a  onClick={handleLogout}  style={{float: 'right', color:'black', fontFamily: 'Montserrat'}}>Logout</a>
      </Header>
      <Content style={{ margin: '24px 16px 0', overflow: 'initial' }} >        
      <Form style={{borderRadius: "10px", background:"white",maxWidth: "50%"}}>
          <Form.Item>picture</Form.Item>
          <Form.Item><label>Name:</label>{userObj.USER.name}</Form.Item>
          <Form.Item><label>Title:</label>{userObj.USER.title}</Form.Item>
          <Form.Item><label>Project:</label>{userObj.USER.project}</Form.Item>
          <Form.Item><label>Email:</label>{userObj.USER.email}</Form.Item>
      </Form>
      <Form style={{borderRadius: "10px", background:"white", maxWidth:"50%"}}>
          <h1>CHANGE PASSWORD</h1>
      <Form.Item style={{maxWidth:"50%"}}
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
       <Form.Item style={{maxWidth:"50%"}}
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
      <Form.Item style={{maxWidth:"50%"}}
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
        <Form.Item>
            <Button htmlType="submit" onClick={onSubmit}>SUBMIT</Button>
        </Form.Item>
       </Form.Item>
       </Form>
      </Content>
      
    </Layout>      
</Layout>
        </div>
    )
}

export default Account
