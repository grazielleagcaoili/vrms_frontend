import React, {useState, useEffect, useMemo, useCallback} from 'react';
import {Button, Input, Select, notification, Modal, Image} from 'antd'
import { onAddDatagrid } from '../../services/studyAPI';
import { useSelector} from 'react-redux';
import { DynamicDataSheetGrid, 
  checkboxColumn,
  textColumn,
  keyColumn  } from 'react-datasheet-grid'
import GridTable from './GridTable';
import {CheckSquareFilled, CameraFilled, DeleteFilled, DownloadOutlined, FontSizeOutlined, EyeFilled} from '@ant-design/icons';
import { CSVLink } from 'react-csv'
import { onUploadDataGrid } from '../../services/uploadAPI';
import StudyDash from './StudyDash';






const DataGrid = () => {

  const { Option } = Select

  const studyObj = useSelector(state => state.study) //study reducer
  const userObj = useSelector(state => state.user) //user reducer

  const [title, setTitle] = useState() 
  const [description, setDescription] = useState()
  const [ data, setData ] = useState([])
  const [columnsData, setColumnsData] = useState([]) // adding columns
  const [addColumnTitle, setAddColumnTitle] = useState()
  const [disabledColumn, setDisabledColumn] = useState(true)
  const [toRemoveColumn, setToRemoveColumn] = useState()
  const [disabledCreate, setDisabledCreate] = useState(true)
  const [addTable, setAddTable] = useState() //add data to table
  const [tempCol, setTempCol] = useState( [{ //column
    ...keyColumn('checkbox', checkboxColumn),
    title: 'Checkbox',
    type: 'checkbox'
  }])
  const [isModalVisible, setIsModalVisible] = useState(false) //modal for image viewing
  const [imageFilename, setImageFilename] = useState() //to view image


  useEffect(()=> { //getting column
    getColumns()
  }, [tempCol])

  useEffect(() => { //disable column
    if (addColumnTitle === undefined ||addColumnTitle ==='') {
      setDisabledColumn(true);
    } else {
      setDisabledColumn(false);
    }
  }, [addColumnTitle]);

  useEffect(() => { //create button disable
    if (title === undefined ||title ===''|| description === undefined ||description ==='') {
      setDisabledCreate(true);
    } else {
      setDisabledCreate(false);
    }
  }, [title,description]);


  //adding columns
  const getColumns= () =>{
    let tempColumns = []
        for(let i = 0; i < columns.length; i++){ 
            tempColumns.push({
                key: columns[i].title,
                name:  columns[i].title,
                value:  columns[i].title,
            });
        }
        setColumnsData(tempColumns)
  }

  const CameraComponent = React.memo(
    ({ rowData, setRowData }) => {
      return (
        <div style={{display:'flex', gap:'5px'}}>
        <div>
          <Button value={rowData}><label className="file_input_id"><CameraFilled/>
          <input type="file"  accept="image/*" onChange={async e => {
                const file = e.target.files[0]
                const data = new FormData()
                data.append("file", file)
                let result = await onUploadDataGrid(data) //uploading
                setRowData(result.data.filename)
              }
            }
             />
          </label></Button>
          
      </div>
      <div>  <Button onClick={
           async (e) => {
                setImageFilename(rowData) //set the image to view
                showImage()
            }
          }><EyeFilled /></Button></div>
      </div>     
      )
    }
  )

  
  
  const cameraColumn = {
    component: CameraComponent,
    deleteValue: () => '',
    copyValue: ({ rowData }) => rowData,
    pasteValue: ({ value }) => value,
  }


  const columns = useMemo(() => tempCol, [tempCol]) //displaying columns in datasheet 
  const createRow = useCallback(() => ({}), []) //creating row
  
  const addTextColumn = () => {
    setTempCol([...columns, {
      ...keyColumn(addColumnTitle, textColumn),
      title: addColumnTitle,
      type: 'text'
    }])
    setAddColumnTitle('')
  }

  const addCheckboxColumn = () => {
    setTempCol([...columns, {
      ...keyColumn(addColumnTitle, checkboxColumn),
      title: addColumnTitle,
      type:'checkbox'
    }])
    setAddColumnTitle('')
  }

  const addCameraColumn = () => {
    setTempCol([...columns, {
      ...keyColumn(addColumnTitle, cameraColumn),
      title: addColumnTitle,
      type:'camera'
    }])
    setAddColumnTitle('')
  }

  const removeColumn = (key) => {
   let newColumn = columns.filter(value => !key.includes(value.title));
    setTempCol(newColumn)
  }

  function handleColumnToDelete(value) { //handling deleting column
    setToRemoveColumn(value)
  }

  const successNotif = (type, message) => {
    notification[type]({
      message: 'Notification',
      description:
        message,
    });
  };

  const errorNotif = (type, message) => {
    notification[type]({
      message: 'Notification',
      description:
        message,
    });
  };

  async function saveToDB(){
    const dataToSend ={
      user: userObj.USER._id,
      title: title,
      description: description,
      studyID: studyObj.STUDY.studyID,
      data: data,
      columns: tempCol
    }
    let result = await onAddDatagrid(dataToSend)
    if(result.status === 200){
      successNotif('success', result.data.message)
      setAddTable(result.data.data)
      setTitle('')
      setDescription('')
      setTempCol([{
        ...keyColumn('checkbox', checkboxColumn),
        title: 'Checkbox',
        type: 'checkbox'
      }])   
      setData([])
    }else{
     errorNotif('error', result.data.message)
    }
  }

  const showImage = () => { //for viewing image
    setIsModalVisible(true);
  };

  const handleOk = () => { //modal
    setIsModalVisible(false);
  };

  const handleCancel = () => {//modal
    setIsModalVisible(false);
  };

  function clearFields(){
      setTitle('')
      setDescription(' ')
      setData('')
  }


  return (
    <div>
         <div style={{display: 'none'}}>
              <GridTable data={addTable}/>
        </div>
        <div style={{display: 'grid', rowGap:'0px', gap:'5px', maxWidth:'100%', margin:'10px'}}>
          <div style={{display:'grid'}}>
          <label style={{fontSize: '20px'}}>Table Title</label>
          <Input  placeholder="Input table title" onChange={(e)=> {setTitle(e.target.value)}} value={title}/> 
          </div>
          <div style={{display:'grid'}}>
          <label style={{fontSize: '20px'}}>Table Description</label>
          <Input  placeholder="Enter table description" onChange={(e)=> {setDescription(e.target.value)}} value={description}></Input>
          </div>
          <div style={{display:'grid'}}>
          <label style={{fontSize: '20px'}}>Column Title</label>
          <div style={{display:'flex', flexDirection:'row', gap:'3px'}}>
          <Input  placeholder="Enter Column title" onChange={(e)=> {setAddColumnTitle(e.target.value)}} value={addColumnTitle}></Input>
            <Button disabled={disabledColumn}  onClick={addTextColumn}><FontSizeOutlined /></Button>
            <Button disabled={disabledColumn}  onClick={addCheckboxColumn} ><CheckSquareFilled /></Button>
            <Button disabled={disabledColumn} onClick={addCameraColumn} ><CameraFilled /></Button>
            </div>
          </div>
          <div style={{display:'grid'}}>
          </div>
          <div style={{display:'grid'}}>
          <label style={{fontSize: '20px'}}>Delete Column </label>
          <div style={{display:'flex', flexDirection:'row', gap:'5px'}}>
          <Select placeholder="Select column title to delete" onChange={handleColumnToDelete} mode="tags" tokenSeparators={[',']} style={{ width: '100%' }}>
            {columnsData.map(column => (
                            <Option key={column.key} value={column.value}>{column.name}</Option>
                        ))}
            </Select>
          <Button danger onClick={() => removeColumn(toRemoveColumn)}><DeleteFilled/></Button> 
          <Button><CSVLink data={data}><DownloadOutlined/></CSVLink></Button>
            </div>
          </div>
          <div style={{marginTop:'30px'}}>
            <DynamicDataSheetGrid
                    data={data}
                    onChange={setData}
                    columns={columns}
                    createRow={createRow}
                />
                <Modal title="View Image" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                    <div style={{display: 'grid' }}>
                      <Image
                      src={`http://localhost:8080/datagrid/${imageFilename}`}
                      />
                    <a href={`http://localhost:8080/datagrid/${imageFilename}`} download target="_blank"><Button type="primary" block icon={<DownloadOutlined/>}>Download</Button></a>
                    </div>
                </Modal>
            <div style={{float:'right', rowGap:'0px', gap:'5px', display:'flex', marginTop:'20px'}}>
            <Button type="primary" disabled={disabledCreate} onClick={saveToDB}>Create</Button>
            <Button type="primary" onClick={clearFields}>Clear</Button>
            </div>
            </div>
          </div>
           
    </div>
  )
}

export default DataGrid