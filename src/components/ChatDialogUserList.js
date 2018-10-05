import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { setCurrentUser, getAllUsers } from '../reducers/user';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  paper: {
    width: '80%',
    maxHeight: 435,
  },
});

class ChatDialogUserList extends Component {
  constructor() {
    super();
    this.state = {
      value: '',
      selectedUid: '',
      userlist: [],
      currentuser: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({ value: nextProps.value });
    }
  }

  handleEntering = () => {
    this.radioGroupRef.focus();
  };

  handleCancel = () => {
    this.props.onClose(this.props.value);
  };

  handleOk = () => {
    this.props.onClose(this.state.value, this.state.selectedUid);
  };

  handleChange = (event, value) => {
    const selectedUid = this.props.userlist.filter(
      user => user.name === value
    )[0].uid;
    this.setState({ value, selectedUid });
  };

  async componentDidMount() {
    await this.props.getUsers;
    const userlist = this.props.userlist;
    const value = userlist[0].name;
    const selectedUid = userlist[0].uid;
    this.setState({ value, selectedUid, userlist });
  }

  render() {
    const { value, ...other } = this.props;
    const list = this.state.userlist;
    return (
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        maxWidth="xs"
        onEntering={this.handleEntering}
        aria-labelledby="confirmation-dialog-title"
        {...other}
      >
        <DialogTitle id="confirmation-dialog-title">Member List</DialogTitle>
        <DialogContent>
          <RadioGroup
            ref={ref => {
              this.radioGroupRef = ref;
            }}
            aria-label="UserList"
            name="userlist"
            value={this.state.value}
            onChange={this.handleChange}
          >
            {list.map(item => (
              <FormControlLabel
                key={item.uid}
                value={item.name}
                control={<Radio />}
                label={item.name}
              />
            ))}
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={this.handleOk} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

ChatDialogUserList.propTypes = {
  onClose: PropTypes.func,
  value: PropTypes.string,
};

const mapState = ({ user }) => ({
  userlist: user.list,
  currentuser: user.currentUser,
});

const mapDispatch = dispatch => ({
  getUsers() {
    dispatch(getAllUsers());
  },
  getCurrentUser() {
    dispatch(setCurrentUser());
  },
});

export default withStyles(styles)(
  connect(
    mapState,
    mapDispatch
  )(ChatDialogUserList)
);
