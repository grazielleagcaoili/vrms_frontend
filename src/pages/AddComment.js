import React, {useEffect, useState} from 'react'
import {Comment, Avatar, Form, Button, Input} from 'antd'
import { useSelector} from 'react-redux';
import moment from 'moment';
import { onAddComment } from '../services/taskAPI';
import DisplayComment from './DisplayComment';


const AddComment = (props) => {

    const { TextArea } = Input;

    const userObj = useSelector(state => state.user)
    const studyObj = useSelector(state => state.study)
    let avatar = localStorage.getItem("avatarFilename")

    const [comment, setComment] = useState({comments: '', submitting: false, value: '', author: `${userObj.USER.name}`,avatar: avatar, datetime: moment().fromNow(),})
    const [task, setTask] = useState() //taskID
  

  let forProps = {task}

    async function handleSubmit(){
        let result = await onAddComment({taskID: task, comment, studyID: studyObj.STUDY.studyID})
        setComment({...comment, value: ''})
       forProps = {task, result}
    }

    useEffect(() => {
        setTask(props.data)
    }, [props.data])
 
    
   
    return (
        <div>
           <DisplayComment data={forProps}/>
        <Comment
          avatar={
            <Avatar
              src={`/avatar/${avatar}`}
              alt={userObj.USER.name}
            />
          }
          content={
              <>
            <Form.Item>
            <TextArea rows={4} onChange={e => setComment({...comment, value: e.target.value})} value={comment.value} />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" loading={comment.submitting} onClick={handleSubmit} style={{background: '#A0BF85'}}>
              Add Comment
            </Button>
          </Form.Item>
          </>
          }
        />
        </div>
    )
}

export default AddComment
