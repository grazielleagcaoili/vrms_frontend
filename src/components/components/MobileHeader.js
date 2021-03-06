import React from 'react'
import {  Menu, notification } from 'antd'
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { onUserLogout } from '../../services/authAPI';
import { UserOutlined, BookOutlined, MenuOutlined } from '@ant-design/icons';
import logo from '../images/logo.png'
import '../../styles/CSS/Userdash.css'


const MobileHeader = () => {
    let history= useHistory();
    const dispatch = useDispatch();

    const {SubMenu}= Menu

    const notif = (type, message) => {
      notification[type]({
        message: 'Notification',
        description:
          message,
      });
    };

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
          notif('error',error.response.data.error);
        }
      };

      const studies = async() => {
        history.push('/dash')
      }

    const account = async () => {
        history.push("/account")
      }

    return (
        <div  style={{background:'white',height: '50px', minWidth: '100vh'}}>
            <div style={{float:'left'}}>
            <Menu triggerSubMenuAction="click">
                    <SubMenu key="sub1" icon={<MenuOutlined/>}>
                        <Menu.Item key="1" icon={<UserOutlined/>} onClick={account}>
                            Account
                        </Menu.Item>
                        <Menu.Item icon={<BookOutlined/>} key="2" onClick={studies}>
                            Research
                        </Menu.Item>
                        <Menu.Item key="3" onClick={handleLogout}>
                            Logout
                        </Menu.Item>
                    </SubMenu>
                </Menu>
                </div>
        <div style={{display: 'flex', alignItems:'center', justifyContent:'center'}}>
            
            <div style={{display: 'flex', marginTop:'5px', alignItems:'center'}}>
            <img alt="" src={logo} style={{width: '40px', height: '40px'}}/>
            <h3>Virtual Research Management System</h3>
            </div>
            
        </div>
        
        </div>
    )
}

export default MobileHeader
