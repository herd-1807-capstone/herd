import React, { Component } from 'react';
import axios from 'axios';
import firebase from '../fire';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { setCurrentUser } from '../reducers/user';
import { Route, withRouter } from 'react-router-dom';
import ManageGroup from './ManageGroup';
import {API_ROOT} from '../api-config';

const styles = {
  outer:{
    marginTop: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 20,
  },
  inner:{
    width: 300,
  },
  header:{
    marginTop: 50,
  },
  button:{
    width: 50,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
  }
  }

class CreateGroup extends Component {
  constructor(props){
    super(props)
    this.state = {
      tourName: "",
      address: "",
      imgUrl: "",
      description: "",
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  async handleSubmit (evt){
    // let inputs = document.getElementById('createTour').elements["groupName"]
    let newName = this.state.tourName.split(' ').join('')
    evt.preventDefault()
    if(newName){
      // console.log(this.state)
      evt.persist()
      const { tourName, imgUrl, address, description } = this.state
      let access_token = await firebase.auth().currentUser.getIdToken(/* forceRefresh */ true)
      // console.log(access_token)
      let createResult = await axios.post(`${API_ROOT}/tours?access_token=${access_token}`, {
                          "name": tourName,
                          "imgUrl": imgUrl,
                          "description": description,
                          })
      // console.log(createResult.data)
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
    // console.log(evt.target.name)
    this.setState({
      [evt.target.name]: evt.target.value
    })
  }

  render(){
    const { currentUser } = this.props
    console.log(currentUser.tour)
    if(currentUser && currentUser.hasOwnProperty('tour') && currentUser.tour !== 'null'){
      this.props.history.push('/admin/group')
    }

    return (
      <div>
        <Typography style={styles.header} variant="title" gutterBottom>
          Create New Tour Group
        </Typography>
        <Grid container style={styles.outer}  spacing={24}>
          <form onSubmit={this.handleSubmit} id='createTour'>
          <Grid style={styles.inner} item xs={12} sm={8}>
            <TextField
              required
              id="tourName"
              name="tourName"
              label="Tour Group Name"
              fullWidth
              autoComplete="organization"
              multiline={true}
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
              id="description"
              name="description"
              label="Tour Description"
              fullWidth
              multiline={true}
              onChange={this.handleChange}
            />
          </Grid>
          <Grid style={styles.inner} item xs={12} sm={8}>
          </Grid>
          <Grid style={styles.inner} item xs={12} sm={8}>
          <Button style={styles.button} variant="contained" color="primary" type="submit" onClick={this.handleSubmit} >Save</Button>
            <Button style={styles.button} variant="contained" color="primary" >Cancel</Button>
          </Grid>
          </form>
        </Grid>

      </div>
    );
  }
}

const mapProps = (state) => {
  // console.log(state.user.currentUser)
  return ({
  currentUser: state.user.currentUser,
  })
}

const mapDispatch = (dispatch) => ({
  updateUser: (user) => dispatch(setCurrentUser(user))
})

export default withRouter(connect(mapProps, mapDispatch)(CreateGroup));
