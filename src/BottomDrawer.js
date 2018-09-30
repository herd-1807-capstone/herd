import React, {Fragment} from 'react';
import {Carousel} from 'react-responsive-carousel'
import UpIcon from '@material-ui/icons/ExpandLessOutlined'
import DownIcon from '@material-ui/icons/ExpandMoreOutlined'
import IconButton  from '@material-ui/core/IconButton';
import { Drawer } from '@material-ui/core';

const styles = {
  color: 'white',
  backgroundColor: 'black',
  display:'flex',
  justifyContent: 'center'
}

class BottomSheet extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      open: false,
    };
  }

  toggleDrawer = () => {
    this.setState({
      open: !this.state.open,
    });
  };

  render() {
    return (

        <div style={{backgroundColor:'transparent'}}>
          {this.state.open?
          <IconButton onClick={this.toggleDrawer}>
            <DownIcon />
          </IconButton>
          :<IconButton onClick={this.toggleDrawer}>
            <UpIcon />
          </IconButton>}

          <Carousel id = 'bottom-sheet'
            showArrows={false}
            width={'100vw'}
            infiniteLoop={true}
            useKeyboardArrows ={true}
            emulateTouch= {true}
            showIndicators={false}
            showThumbs={false}
            centerMode={true}
            centerSlidePercentage={60}
            // selectedItem = {num}//on marker click select that marker
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
        </div>

    );
  }
}

export default BottomSheet;
