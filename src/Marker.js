import React from 'react';
import Place from '@material-ui/icons/PlaceOutlined';



const Spot = () => {
  const styles = {
    marker: {
      transform: 'translate(-50%, -100%)',
      fontSize: 36
    }
  }
  return (
            <Place style= {styles.marker}/>
          );
}


const Admin = () => {
  const styles = {
    marker: {
      backgroundColor: 'red',
      border: 'solid 3px white',
      borderRadius: '50%',
      transform: 'translate(-50%, -50%)',
      width: 20,
      height: 20
    }
  }
  return (
            <div style = {styles.marker}> </div>
          );
}

const User = () => {
  const styles = {
    marker: {
      backgroundColor: 'green',
      border: 'solid 3px white',
      borderRadius: '50%',
      transform: 'translate(-50%, -50%)',
      width: 20,
      height: 20
    }
  }
  return (
            <div style = {styles.marker}> </div>
          );
}

export {Spot, Admin, User}
