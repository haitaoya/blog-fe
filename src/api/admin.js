import axios from 'axios'
export default{
    toLogin(args){
        return axios.post('/login', args);
    },
    toFindAllUser(){
        return axios.post('/user/findAll');
    }
}
