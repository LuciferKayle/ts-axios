import axios from '../../src/axios';
import { AxiosTransformer } from '../../src/types'
import qs from 'qs';

const instance = axios.create({
    transformRequest: [(function (data) {
        return qs.stringify(data)
    }), ...(axios.defaults.transformRequest as AxiosTransformer[])],
    transformResponse: [...(axios.defaults.transformResponse as AxiosTransformer[]), function (data) {
        if (typeof data === 'object') {
            data.b = 2
        }
        return data
    }]
})

console.log(instance.defaults);

instance({
    url: '/config/post',
    method: 'post',
    data: {
        a: 1
    }
}).then((res) => {
    console.log(res.data)
}).catch()