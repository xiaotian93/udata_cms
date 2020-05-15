/**
 * Created by 叶子 on 2017/7/30.
 * http通用工具函数
 */
import ax from 'axios';
import { message } from 'antd';
import { host } from './config';
import { set_logstate } from './tool'

const error_info = {
    net: "网络异常",
    404: "请求地址错误",
    500: "服务器异常",
    401: "未登录",
    302: "未登录",
    403: "认证失败",
    502: "服务器正在部署",
    405: "请求方法错误"
}

// 数据请求参数
const axios_config_json = {
	timeout: 50000,
    responseType: 'json',
    withCredentials: true,
    headers:{ "Content-Type":"application/json" },
    validateStatus: function(status) {
        return (status >= 200 && status < 300);
    },
    transformRequest: [function(data) {
        if(typeof(data)==="string"){
            return decodeURI(data);
        }
        return JSON.stringify(data);
    }],
    transformResponse: [function(data) {
        let res;
        try {
            res = JSON.parse(JSON.stringify(data));
        } catch (e) {
            message.error("返回值格式错误");
        }
        // 100 未登录 200 权限不足 300 权限不足 0 未定义错误
        if(res.code===1003000001){
            message.warn(res.msg);
            set_logstate(false);
	        return Promise.reject(res.msg);
        }
        // if(res.code===1002000001){
        //     message.warn(res.errMsg);
        //     return Promise.reject(res.errMsg);
        // }
        // if(res.code===1000000000){
        //     message.warn(res.errMsg);
        //     return Promise.reject(res.errMsg);
        //     //return res
        // }
        // if(res.code===1002000015){
        //     message.warn(res.errMsg);
        //     return Promise.reject(res.errMsg);
        // }
        if(res.errorMsg){
           message.warn(res.errorMsg);
           return Promise.reject(res);
        }
        if(res.code!==0){

		    // message.error("错误信息："+res.msg, 5);
		    return Promise.reject(res.msg)
        }
        
        return res;
    }]
}

const axios_config = {
	timeout: 50000,
    responseType: 'json',
    withCredentials: true,
    validateStatus: function(status) {
        return (status >= 200 && status < 300);
    },
    // headers:{"MERCHANT-AUTH-TOKEN":window.localStorage.getItem("isLogin")||""},
    transformRequest:[function(data){
        if(typeof(data)==="string"){
            return data;
        }
        let ret = [];
        for (let it in data) {
            ret.push(it + "=" + encodeURIComponent(data[it]));
        }
        return ret.join("&");
    }],
    transformResponse: [function(data) {
        let res;
        try {
            res = JSON.parse(JSON.stringify(data));
            // 100 未登录 200 权限不足 300 权限不足 0 未定义错误
            if(res.code===1010000000||res.code===1010000001){
// alert(1)
                window.localStorage.setItem("isLogin","");
                //alert(1)
                window.location.href = window.location.href;
                return Promise.reject(res.msg);
            }
            if(res.code===1003000001){
                set_logstate(false);
                message.warn(res.msg);
		        return Promise.reject(res.msg);
            }
            // if(res.code===1000000000){
            //     message.warn("错误代码："+res.code+"--错误信息："+res.errMsg, 5);
            //     return Promise.reject(res.msg)
            // }
            // if(res.data){
            //     if(res.data.isValid===false){
            //         return Promise.resolve(res)
            //     }
            // }
            if(res.errorMsg){
                if(res.code===1014000000){
                    if(res.errorMsg.indexOf("{")!==-1){
                        message.warn("标记字段信息填写错误");
                    }else{
                        message.warn(res.errorMsg);
                    }
                }else{
                    message.warn(res.errorMsg);
                }
                
                return Promise.resolve(res);
             }
            if(res.code!==0){
			    // message.error("错误代码："+res.code+"--错误信息："+res.msg, 5);
			    return Promise.reject(res.msg)
            }
        } catch (e) {
            message.error("返回值格式错误");
            res = { state: -100, msg: "HAHA", data: null };
        }
        return res;
    }]
}

// 拦截器处理
const interceptors_res = (response) => {
    
    return response.data;
}
const interceptors_ers = (err) => {
    let status = err.response ? err.response.status : "net";
    message.error(error_info[status], 3);
    if(status==='net'){
    }
    return Promise.reject(error_info[status])
}
// 请求实例JSON
const axios = ax.create(axios_config);
axios.defaults.baseURL = host;
axios.interceptors.response.use(interceptors_res, interceptors_ers);
export default axios;
// export const axios_f=axios

const axiosa = ax.create(axios_config);
axiosa.defaults.baseURL = host;
axiosa.interceptors.response.use(interceptors_res, interceptors_ers);
// export default axios;
export const axios_f=axiosa

const axios_j = ax.create(axios_config_json);
axios_j.defaults.baseURL = host;
axios_j.interceptors.response.use(interceptors_res, interceptors_ers);
export const axios_json=axios_j;
// 请求实例JSON
// const axios_f = ax.create(axios_config);
// axios_f.defaults.baseURL = host;
// axios_f.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
// axios_f.interceptors.response.use(interceptors_res, interceptors_ers);
// export const axios_form = axios_f;

// 上传文件
export const upload_file = (key,path,rqd,backfn)=>{
    return {
        action:host + path,
        accept:"image/*",
        listType:"picture-card",
        data:rqd,
        headers:{
            "X-Requested-With": null
        },
        multiple:true,
        name:key,
        withCredentials:true,
        onChange:function(data){
            backfn(data,rqd)
        }
    }
}
