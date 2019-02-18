import React from 'react'
import axios from 'axios'
import ReactJson from 'react-json-view'
import Funcs from '../../../services/index'

class DebugView extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      formatData: {},
      originData: {},
      transform: false,
      editSrc: true,
    }
  }

  onConfirm = () => {
    const input = document.getElementById('input')
    const area = document.getElementById('area')
    
    var jsonInput = ""
    if(!area){
      jsonInput = JSON.stringify(this.state.originData)
    }
    else{
      if (!area.value) {
        alert('没有输入json')
        return
      }
      jsonInput = area.value
    }

    const funcName = input.value

    if(!funcName){
      alert('没有输入url')
      return
    }

    var data = {}
    try {
      data = JSON.parse(jsonInput)
    } catch (error) {
      alert('无效json，请检查输入')
      return
    }
    var passValue = data
    if(data.response){
      passValue = data.response
    }

    const params = {
      data: passValue
    }
    const result = Funcs[funcName](jsonInput)
    // 使用本地js调用
    this.setState({
      formatData: JSON.parse(result),
      originData: data,
      transform: true,
      editSrc: false
    })
  }

  onReset = () => {
    window.location.reload()
  }

  onEdit = () => {
    this.setState({
      editSrc: true
    })
  }

  handleChange = (event) => {
    const input = document.getElementById('input')
    const name = event.target.value
    input.value = name
    this.setState({
      func: name
    })
  }

  render() {
    const { transform, formatData, originData, editSrc} = this.state
    const leftView = transform && !editSrc ? <ReactJson src={originData} id='area'/> : <textarea id='area' defaultValue={JSON.stringify(originData, null, 4)} />

    const options = []
    for(var f in Funcs){
      if(f != 'version'){
        options.push(<option value={f}>{f}</option>)
      }
    }

    return (
      <div className='container'>
        <div className='header'>
          <span>chaos-debugger</span>
          <select value={this.state.func} onChange={this.handleChange} className="select">
            {
                options
            }
          </select>
          <input
            placeholder='请输入url'
            id='input'
            defaultValue={this.state.func}
          />
          <button onClick={this.onConfirm} className='confirm'>确定</button>
          <button onClick={this.onReset} className='reset'>重置</button>
          <button onClick={this.onEdit} className='edit'>编辑</button>
        </div>
        <div className='json-content'>
          <div className='left'>
            {leftView}
          </div>
          <div className='right'>
            {transform && <ReactJson src={formatData} />}
          </div>
        </div>
      </div>
    )
  }
}

export default DebugView