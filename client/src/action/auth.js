import axios from 'axios';

export const register = (data) => {
    return (dispatch) => {
        axios.post('http://localhost:5000/api/users/register' , data)
              .then(res => console.log(res.data))
              .catch(console.log);
    }
}