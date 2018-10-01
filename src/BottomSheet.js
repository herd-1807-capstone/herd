import React from 'react';
import {Carousel} from 'react-responsive-carousel'
import { Drawer, Paper } from '@material-ui/core';
import {withStyles} from '@material-ui/core';
import PropTypes from 'prop-types'


const styles = {
  root:{
    height: '35vh',
    position: 'fixed',
    overflowY: 'scroll'
  },
  heading:{
    margin: 0
  }
}

class BottomSheet extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      open: true,
    };
  }

  toggle = () => {
    this.setState({
      open: !this.state.open,
    });
  };

  render() {
    const {classes} = this.props
    return (
        <Paper className={classes.root}>
          <h1 className = {classes.heading}>Spot1</h1>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc scelerisque purus sed aliquet semper. Nullam eu risus eleifend nisl aliquam tincidunt. Nullam non mi auctor, vulputate felis in, vulputate sem.</p>
        </Paper>
      )
  }
}
BottomSheet.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(BottomSheet);
