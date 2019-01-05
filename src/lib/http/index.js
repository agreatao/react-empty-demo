import axios from 'axios';
import config from 'config';
import _Error from '../error';
import { browserHistory } from 'react-router';

if(config.request)
    axios.defaults.baseURL = config.request;

let http = {};

['get', 'post'].forEach(method => {
    http[method] = (...args) => axios[method](...args).then(response => {
        if (response) {
            let { status, data } = response
            if (status && status == 200 && data) {
                if (data.code == 0) {
                    return data;
                } else if(data.code == -2) {
                    browserHistory.push('/index');
                    return data;
                }else {
                    throw new _Error(data);
                }
            } else {
                throw new _Error(data);
            }
        } else {
            throw new _Error('接口没有返回值');
        }
    }).catch(e => {
        let response = e.response;
        if (response) {
            let status = response.status;
            if (status === 403) {
                throw new _Error('您没有权限进行此项操作')
            } else if (status === 404 || status === 502 || status === 504) {
                throw new _Error('网络异常')
            }
            if ('data' in response) {
                throw new _Error(response.data)
            } else if ('statusText' in response) {
                throw new _Error(response.statusText)
            }
        } else if (e.message === 'Network Error') {
            throw new _Error('网络异常')
        }
        throw e;
    })
});

module.exports = http;