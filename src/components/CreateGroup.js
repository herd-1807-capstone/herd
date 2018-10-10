import React, { Component } from 'react';
import axios from 'axios';
import {auth} from '../utils/api-config';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { setCurrentUser } from '../reducers/user';
import { withRouter } from 'react-router-dom';
import {API_ROOT} from '../utils/api-config';
import { changeLoadingState } from '../reducers/user';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles ={
  outer:{
    marginTop: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 20,
  },
  inner:{
    width: 300,
    alignItems: 'center',
  },
  header:{
    marginTop: 50,
  },
  button:{
    width: 50,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: 10,
    marginRight: 10,
    width: 300,
  },
  }

class CreateGroup extends Component {
  constructor(props){
    super(props)
    this.state = {
      tourName: "",
      address: "",
      imgUrl: "",
      description: "",
      tourStart: this.getCurrentDate(),
      tourEnd: this.getCurrentDate(),
      formTip: "",
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleTimeChange = this.handleTimeChange.bind(this)
    this.handleBack = this.handleBack.bind(this)
  }

  async handleSubmit (evt){
    let newName = this.state.tourName.split(' ').join('')
    evt.preventDefault()
    if(newName){
      evt.persist()
      const { tourName, imgUrl, description, tourStart, tourEnd, formTip } = this.state
      let tourStartTime = new Date(tourStart).getTime()
      let tourEndTime = new Date(tourEnd).getTime()
      if(formTip !== '') {
        return
      }
      if(tourStartTime >= tourEndTime) {
        this.setState({formTip: "The Tour Ending Time should be later than Starting Time"})
        return
      }
      let access_token = await auth.currentUser.getIdToken(/* forceRefresh */ true)
      let createResult = await axios.post(`${API_ROOT}/tours?access_token=${access_token}`, {
                          "name": tourName,
                          "imgUrl": imgUrl,
                          "description": description,
                          "startDateTime": new Date(tourStart).getTime(),
                          "endDateTime": new Date(tourEnd).getTime(),
                          })
      if(createResult.status === 200){
        let newCurrentUser = {...this.props.currentUser, tour: createResult.data.key}
        this.props.updateUser(newCurrentUser)
        this.props.history.push('/admin/group')
      } else {
        return (<h1>{createResult.statusText}</h1>)
      }
    }
  }

  handleChange (evt) {
    this.setState({
      [evt.target.name]: evt.target.value
    })
  }

  handleTimeChange (evt) {
    let target = evt.target.id
    let targetValue = new Date(evt.target.value).getTime()
    let isValid = true
    let newMsg = ""
      if(Number.isNaN(targetValue)) {
        this.setState({formTip: "Tour Start / End Time Can Not Be Empty."})
        return
      }
    if(target === "tourStart"){
      if(targetValue >= new Date(this.state.tourEnd).getTime()){
        isValid = false
      }
    } else {
      if(targetValue <= new Date(this.state.tourStart).getTime()){
        isValid = false
      }
      if(targetValue < new Date().getTime()){
        newMsg = "The Tour Ending Time Should Be Later Than Current Time"
      }
    }
    if(!isValid){
      newMsg = "The Tour Ending Time Should Be Later Than Starting Time"
    }
    this.setState({[target]: [evt.target.value], formTip: newMsg})
  }

  handleBack(evt) {
    this.props.history.push('/admin')
  }

  getCurrentDate(){
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    let hh = today.getHours();

    if(dd<10) {
        dd = '0'+dd
    }

    if(mm<10) {
        mm = '0'+mm
    }
    today = yyyy + '-' + mm + '-' + dd + 'T' + hh + ':00';
    return today
  }

  render(){
    const { currentUser, classes } = this.props
    if(currentUser && currentUser.tour){
      this.props.history.push('/admin/group')
    }

    return (
      <div>
        <Typography style={styles.header} variant="title" gutterBottom>
          Create New Tour Group
        </Typography>
        <Grid container style={styles.outer}  spacing={24}>
          {/* <form onSubmit={this.handleSubmit} id='createTour'> */}
          <Grid style={styles.inner} item xs={12} sm={8}>
            <TextField
              required
              id="tourName"
              name="tourName"
              label="Tour Group Name"
              fullWidth
              autoComplete="organization"
              onChange={this.handleChange}
            />
          </Grid>
          <Grid style={styles.inner} item xs={12} sm={8}>
            <TextField
              id="address"
              name="address"
              label="Address"
              fullWidth
              autoComplete="billing address-line1"
              multiline={true}
              onChange={this.handleChange}
            />
          </Grid>
          <Grid style={styles.inner} item xs={12} sm={8}>
            <TextField
              id="imgUrl"
              name="imgUrl"
              label="Image Url Address"
              fullWidth
              autoComplete="url"
              multiline={true}
              onChange={this.handleChange}
            />
          </Grid>
          <Grid style={styles.inner} item xs={12} sm={8}>
            <TextField
              required
              id="description"
              name="description"
              label="Tour Description"
              fullWidth
              multiline={true}
              onChange={this.handleChange}
            />
          </Grid>
          {/* </form> */}
          <Grid style={styles.inner} item xs={12} sm={8}>
            <form className={classes.container} noValidate>
              <TextField
                id="tourStart"
                label="Tour Starts At:"
                type="datetime-local"
                defaultValue={this.getCurrentDate()}
                className={classes.textField}
                onChange={this.handleTimeChange}
                InputLabelProps={{
                shrink: true,

                }}
              />
            </form>
            <form className={classes.container} noValidate>
              <TextField
                id="tourEnd"
                label="Tour Ends At:"
                type="datetime-local"
                defaultValue={this.getCurrentDate()}
                className={classes.textField}
                onChange={this.handleTimeChange}
                InputLabelProps={{
                shrink: true,
                }}
              />
            </form>
            <label>
              <font color="red">
                {this.state.formTip}
              </font>
            </label>
          </Grid>
          <Grid style={styles.inner} item xs={12} sm={8}>
            <Button style={styles.button}
                  variant="contained"
                  color="primary"
                  type="submit"
                  onClick={this.handleSubmit}
            >Save</Button>
            <Button style={styles.button}
                    variant="contained"
                    color="primary"
                    onClick={this.handleBack}
            >Back</Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}

const mapProps = (state) => {
  return ({
  currentUser: state.user.currentUser,
  })
}

const mapDispatch = (dispatch) => ({
  updateUser: (user) => dispatch(setCurrentUser(user)),
  changeLoadingState: () => dispatch(changeLoadingState())
})

CreateGroup.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(connect(mapProps, mapDispatch)(withStyles(styles)(CreateGroup)));
