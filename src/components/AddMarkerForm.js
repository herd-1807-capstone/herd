import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import {addSpotThunk, setSelected} from '../reducers/spots'
import { connect } from 'react-redux'

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const styles = theme => ({
  paper: {
    position: 'absolute',
    // width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    borderRadius: 4
  },
  form:{
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  items:{
    marginTop: 10,
    width: '60vw'
  },
  buttons:{
    marginTop: 10,
    display: 'flex',
    justifyContent: 'flex-end'
  },
  buttonItems:{
    margin: 10
  }
});

class AddMarkerForm extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      name:'',
      description:'',
      imgUrl: '',
      success:false
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(evt){
    this.setState({
      [evt.target.name]: evt.target.value
    })
  }
  async handleSubmit(evt){
    evt.preventDefault();

    const {lat, lng} = this.props;
    const {name, description, imgUrl} = this.state;
    const spot = {
      name,
      description,
      imgUrl,
      lat,
      lng
    }
    let res = await this.props.saveSpot(spot);
    if (res) {
      this.setState({success:true});
      this.props.reselect(spot);
    }
  }
  render() {
    const { classes, handleClose } = this.props;
    if(this.state.success) return (
      <div style = {getModalStyle()} className={classes.paper}>
        <h1 className = 'success'>Spot saved!</h1>
      </div>
    )
    return (

          <div style={getModalStyle()} className={classes.paper}>
            <form
              onSubmit={this.handleSubmit}
              className = {classes.form}
            >
              <h1>Add a spot</h1>
              <TextField
                required = {true}
                className = {classes.items}
                onChange={this.handleChange}
                value = {this.state.name}
                name = 'name'
                label = 'Name'/>
              <TextField
                required = {true}
              className = {classes.items}
                onChange={this.handleChange}
                value = {this.state.description}
                name = 'description'
                label = 'Description'
                multiline = {true}/>
                <TextField
                  type = 'url'
                  className={classes.items}
                  label="Image url"
                  name = "imgUrl"
                  value={this.state.imgurl}
                  onChange = {this.handleChange}
                />
              <div className = {classes.buttons}>
                <Button
                className = {classes.buttonItems}
                  onClick={handleClose('addMarkerWindow')}

                  size = 'small'
                  color = 'secondary' >
                  Cancel
                </Button>
                <Button
                  className = {classes.buttonItems}
                  type = 'submit'

                  size = 'small'
                  color = 'primary' >
                  Save
                </Button>
              </div>
            </form>
          </div>

    );
  }
}

AddMarkerForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapDispatch = dispatch => ({
  saveSpot(spot){
    return dispatch(addSpotThunk(spot));
  },
  reselect(spot){
    dispatch(setSelected(spot))
  }
})


export default withStyles(styles)(connect(null,mapDispatch)(AddMarkerForm));
