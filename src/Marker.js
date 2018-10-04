import React from 'react';
import PlaceOutlined from '@material-ui/icons/PlaceOutlined';
import Place from '@material-ui/icons/Place';



const Spot = () => {

  const styles = {
    transform: 'translate(-50%, -100%)',
    fontSize: 40
  }
  return (
            <Place style = {styles} />
          );
}


const Admin = () => {
  return (
            <div className = 'admin-marker' />
          );
}

const User = ({imgUrl, idx}) => {
  if (imgUrl){
    return <img className = 'user-marker' src={imgUrl} />
  }
  return <img className = 'user-marker' src ={`https://robohash.org/${idx}.png?set=set4`}/>
}

export {Spot, Admin, User}
