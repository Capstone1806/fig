import React, {Component} from 'react'
import AceEditor from 'react-ace'
import db from '../firestore'
import Output from './Output'

import 'brace/mode/javascript'
import 'brace/theme/monokai'

class CodeEditor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      code1: '',
      code2: '',
      docId: '',
      roomId: ''
    }
    this.onChange1 = this.onChange1.bind(this)
    this.onChange2 = this.onChange2.bind(this)
  }

  async componentDidMount() {
    const {fireCodesId, roomId} = this.props
    const doc = await db.collection('fireCodes').doc(fireCodesId)
    this.setState({docId: doc.id, roomId: roomId})
    doc.onSnapshot(code => {
      const key = Object.keys(code.data())[0]
      this.setState({
        [key]: code.data()[key]
      })
    })
  }

  onChange1(value) {
    this.setState({
      code1: value
    })
    db.collection('fireCodes')
      .doc(this.state.docId)
      .set({
        code1: value,
        code2: this.state.code2
      })
  }
  onChange2(value) {
    this.setState({
      code2: value
    })
    db.collection('fireCodes')
      .doc(this.state.docId)
      .set({
        code1: this.state.code1,
        code2: value
      })
  }

  render() {
    return (
      <div className="columns">
        <div className="column">
          <AceEditor
            mode="javascript"
            theme="monokai"
            onChange={this.onChange1}
            value={this.state.code1}
            name="code-editor"
            editorProps={{$blockScrolling: true}}
          />
          <Output input={this.state.code1} />
        </div>
        <div className="column">
          <AceEditor
            mode="javascript"
            theme="monokai"
            onChange={this.onChange2}
            value={this.state.code2}
            name="code-editor"
            editorProps={{$blockScrolling: true}}
          />
          <Output input={this.state.code2} />
        </div>
      </div>
    )
  }
}

export default CodeEditor
