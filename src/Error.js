import React, { Component } from 'react';
import { Link } from 'react-router-dom';



export default class Error extends Component{
    render(){
        return(
            <div>
                {this.props.match.params.id == 401 ? <h1>Sorry, you are not in a group</h1> : <h1>Sorry, you do not have a pre-register information</h1>}
                <Link to='/login'>Login</Link>
            </div>
        )
    }
}