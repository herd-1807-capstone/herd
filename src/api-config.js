let backendHost;

if(process.env.NODE_ENV === 'development'){
  backendHost = 'http://localhost:8080';
}else{
  backendHost = 'https://herd-capstone.herokuapp.com';
}

export const API_ROOT = `${backendHost}/api`;
