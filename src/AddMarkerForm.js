import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import {addSpotThunk} from './reducers/spots'
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
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,

  },
  form:{
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  items:{
    marginTop: 10
  }
});

class AddMarkerForm extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      name:'',
      description:'',
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
    const {name, description} = this.state;
    const spot = {
      name,
      description,
      lat,
      lng
    }
    await this.props.saveSpot(spot);
    this.setState({success:true})
  }
  render() {
    const { classes, lat, lng } = this.props;
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
              <Button
              className = {classes.items}
                type = 'submit'
                variant = 'outlined'
                size = 'small'
                color = 'primary' >
                Save
              </Button>
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
    dispatch(addSpotThunk(spot));
  }
})


export default withStyles(styles)(connect(null,mapDispatch)(AddMarkerForm));
