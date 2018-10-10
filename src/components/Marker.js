import React from 'react';
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
    return <img className = 'user-marker' alt="" src={imgUrl} />
  }
  return <img className = 'user-marker' alt="" src ={`https://robohash.org/${idx}.png?set=set4`}/>
}

const OfflineUser = ({imgUrl, idx}) => {
  if (imgUrl){
    return <img className = 'user-marker-offline' alt="" src={imgUrl} />
  }
  return <img className = 'user-marker-offline' alt="" src ={`https://robohash.org/${idx}.png?set=set4`}/>
}

const OfflineAdmin = () => {
  return (
    <div className = 'admin-marker-offline' />
  );
}


export {Spot, Admin, User, OfflineAdmin, OfflineUser}
