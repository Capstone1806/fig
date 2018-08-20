import React, {Component} from 'react'
import CodeEditor from './CodeEditor'
import PropTypes from 'prop-types'
import {DragSource} from 'react-dnd'
import db from '../firestore'

import {withStyles} from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Dialog from '@material-ui/core/Dialog'
import EditIcon from '@material-ui/icons/Edit'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Snackbar from '@material-ui/core/Snackbar'
import DialogTitle from '@material-ui/core/DialogTitle'
import DoneIcon from '@material-ui/icons/Done'
import CancelIcon from '@material-ui/icons/Cancel'
import Button from '@material-ui/core/Button'
import Input from '@material-ui/core/Input'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import Notification from './Notification'

const codeEditorSource = {
  beginDrag(props) {
    return props
  },
  endDrag(props, monitor) {
    if (!monitor.didDrop()) {
      return
    }
    return props.handleDrop()
  }
}

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  }
}

const styles = theme => ({
  card: {
    minWidth: 275
  },
  button: {
    margin: theme.spacing.unit,
    textAlign: 'float-right'
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  iconSmall: {
    fontSize: 20
  }
})

class CodeEditorCard extends Component {
  constructor() {
    super()
    this.state = {
      mode: 'javascript',
      theme: 'monokai',
      fontSize: 12,
      showGutter: true,
      showLineNumber: true,
      tabSize: 2,
      settingsFormOpen: false,
      snackBarMessage: '',
      snackBarVariant: '',
      open: false
    }
  }

  componentDidMount() {
    db.collection('codeEditors')
      .doc(this.props.codeEditorId)
      .get()
      .then(editor => {
        this.setState({
          mode: editor.data().settings.mode,
          theme: editor.data().settings.theme,
          fontSize: editor.data().settings.fontSize,
          showGutter: editor.data().settings.showGutter,
          showLineNumber: editor.data().settings.showLineNumber,
          tabSize: editor.data().settings.tabSize
        })
      })
    // db.collection('codeEditors')
    //   .doc(this.props.codeEditorId)
    //   .onSnapshot(snapshot => {
    //     console.log('snapshot data', snapshot.data())
    //     this.setState({
    //       mode: snapshot.data().settings.mode,
    //       theme: snapshot.data().settings.theme,
    //       fontSize: snapshot.data().settings.fontSize,
    //       showGutter: snapshot.data().settings.showGutter,
    //       showLineNumber: snapshot.data().settings.showLineNumber,
    //       tabSize: snapshot.data().settings.tabSize
    //     })
    //   })
  }

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    this.setState({
      open: false,
      settingsFormOpen: false
    })
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleEdit = () => {
    try {
      db.collection('codeEditors')
        .doc(this.props.codeEditorId)
        .update({
          settings: {
            mode: this.state.mode,
            theme: this.state.theme,
            fontSize: this.state.fontSize,
            showGutter: this.state.showGutter,
            showLineNumber: this.state.showLineNumber,
            tabSize: this.state.tabSize
          }
        })
        .then(() => {
          this.setState({
            settingsFormOpen: false,
            snackBarMessage: 'Settings updated!',
            snackBarVariant: 'success'
          })
        })
        .then(() => {
          this.setState({
            open: true
          })
        })
    } catch (error) {
      this.setState({
        settingsFormOpen: false,
        snackBarMessage: `Oops... unable to save settings. Error: ${
          error.message
        }`,
        snackBarVariant: 'error',
        open: true
      })
    }
  }

  render() {
    const {classes, connectDragSource, isDragging} = this.props
    return connectDragSource(
      <div className="item">
        <Card
          className={classes.card}
          style={{
            opacity: isDragging ? 0.3 : 1,
            cursor: 'move',
            resize: 'both'
          }}
        >
          <CardContent>
            <Typography className={classes.title} color="textSecondary">
              Code Editor
            </Typography>
            <div>
              <Button
                variant="fab"
                mini
                color="primary"
                className={classes.button}
                onClick={() => this.setState({settingsFormOpen: true})}
              >
                <EditIcon />
              </Button>
              <CodeEditor
                codeEditorId={this.props.codeEditorId}
                roomId={this.props.roomId}
                settings={this.state}
              />
              <Dialog
                open={this.state.settingsFormOpen}
                onClose={this.handleClose}
                aria-labelledby="form-dialog-title"
              >
                <DialogTitle id="form-dialog-title">
                  Code Editor Settings
                </DialogTitle>

                <DialogContent>
                  <form className={classes.container}>
                    <FormControl className={classes.formControl}>
                      <Select
                        native
                        value={this.state.theme}
                        onChange={this.handleChange}
                        input={<Input id="native-simple" />}
                        name="theme"
                      >
                        <option value="monokai">Monokai</option>
                        <option value="github">GitHub</option>
                        <option value="tomorrow">Tomorrow</option>
                        <option value="kuroir">Kuroir</option>
                        <option value="twilight">Twilight</option>
                        <option value="xcode">Xcode</option>
                        <option value="textmate">TextMate</option>
                        <option value="solarized_dark">Solarized Dark</option>
                        <option value="solarized_light">Solarized Light</option>
                        <option value="terminal">Terminal</option>
                      </Select>
                    </FormControl>
                    <FormControl className={classes.formControl}>
                      <Select
                        native
                        value={this.state.mode}
                        name="mode"
                        onChange={this.handleChange}
                        input={<Input id="native-simple" />}
                      >
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                        <option value="ruby">Ruby</option>
                      </Select>
                    </FormControl>
                  </form>
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.handleClose} color="secondary">
                    <CancelIcon />
                  </Button>
                  <Button onClick={this.handleEdit} color="primary">
                    <DoneIcon />
                  </Button>
                </DialogActions>
              </Dialog>
              <Snackbar
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left'
                }}
                open={this.state.open}
                autoHideDuration={6000}
                onClose={this.handleClose}
              >
                <Notification
                  onClose={this.handleClose}
                  variant={this.state.snackBarVariant}
                  message={this.state.snackBarMessage}
                />
              </Snackbar>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
}

CodeEditorCard.propTypes = {
  classes: PropTypes.object.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired
}

export default DragSource('MODULE', codeEditorSource, collect)(
  withStyles(styles)(CodeEditorCard)
)
