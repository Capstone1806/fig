import React, {Component} from 'react'

class Output extends Component {
  constructor(props) {
    super(props)
    this.state = {
      output: ''
    }
    this.run = this.run.bind(this)
  }

  run() {
    const {input} = this.props
    console.log(input)
    this.setState({
      output: eval(input)
    })
  }

  render() {
    return (
      <div>
        <button type="submit" className="button is-primary" onClick={this.run}>
          Run
        </button>
        <p id="terminal1">
          >_
          {this.state.output1}
        </p>
      </div>
    )
  }
}

export default Output

{
  /* <span>
  <p>Output</p>
  <button type="submit" onClick={this.run}>
    Run
  </button>
</span>
<p className="terminal-output">>_ {this.state.output}</p> */
}
