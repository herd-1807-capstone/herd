import React from 'react';
import {Carousel} from 'react-responsive-carousel'
import { Drawer } from '@material-ui/core';
import {withStyles} from '@material-ui/core';
import PropTypes from 'prop-types'


const styles = {
  paperAnchorBottom: {
    position:'fixed',
    maxHeight: '30vh',
    overflowY: 'scroll'
  }
}

class BottomSheet extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      open: true,
    };
  }

  toggleDrawer = () => {
    this.setState({
      open: !this.state.open,
    });
  };

  render() {
    const {classes} = this.props
    return (
          <Drawer
            variant = 'persistent'
            anchor='bottom'
            open = {this.state.open}
            classes={{
              paperAnchorBottom: classes.paperAnchorBottom}} >
            <Carousel
              showArrows={false}
              width={'100vw'}
              infiniteLoop={true}
              useKeyboardArrows ={true}
              emulateTouch= {true}
              showIndicators={false}
              showThumbs={false}
              centerMode={true}
              centerSlidePercentage={60}
              // selectedItem = {num}//TODO: on marker click, pass props of selected
                          >
              <div>
                  <h1>this is the real content</h1>
              </div>
              <div>
                  <h1>this is the real content</h1>
              </div>
              <div>
                  <h1>this is the real content</h1>
              </div>
              <div>
                  <h1>this is the real content</h1>
              </div>
              <div>
                  <h1>this is the real content</h1>
              </div>
          </Carousel>
            <div>
              <h1>calendar stuff</h1>
              <h1>calendar stuff</h1>
              <h1>calendar stuff</h1>
            </div>
          </Drawer>
    );
  }
}

BottomSheet.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(BottomSheet);
