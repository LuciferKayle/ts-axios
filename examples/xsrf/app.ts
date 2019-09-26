import axios from '../../src/index';

const instance = axios.create({
    xsrfHeaderName: 'XSRF-TOKEN-D',
    xsrfCookieName: 'X-XSRF-TOKEN-D'
})

instance.get('/more/get').then(res => {
    console.log(res);
}).catch()
