// import { getUrlParam } from './tool';

let domain = "http://opdash.baimaodai.cn:24020/";
let browser_host = window.location.hostname;

// if(browser_host==="open.zhiyoou.com"){
// 	domain = "http://merchant.api.zhiyoou.com";
// }else if(browser_host==="open.heimaodai.com"){
// 	domain = "http://merchant.api.heimaodai.com";
// }else{
// 	// domain = "http://open.baimaodai.cn:8080/";
// 	domain="http://merchant.api.baimaodai.cn";
// 	// domain=""
// }

// 通用host
export const host = domain;

// 列表每页条数
export const page = {size:50}

// 分期订单状态
export const order_status_map = {
	"-6" : "未绑卡", 
	"-5" : "已退保",
	"-4" : "放款失败",
	"-3" : "审核未通过",
	"-2" : "进审未通过",
	"-1" : "已失效",
	"0" : "待签约",
	"1" : "待首付",
	"2" : "待进审",
	"3" : "待审核",  //待初审
	"4" : "待审核",  //待复审
	"5" : "待放款", 
	"6" : "待放款", 
	"7" : "待还款", 
	"8" : "已结清",
	"11":"待还款",
	"12":"还款处理中",
	"13":"逾期未还款",
	"21":"提前结清",
	"22":"正常结清",
	"23":"逾期结清"
}

// 分期订单状态下拉列表
export const order_status_select = [
	{val:"" ,name: "全部"}, 
	{val:"2" ,name: "待进审"}, 
	{val:"-2" ,name: "进审未通过"}, 
	{val:"3,4" ,name: "待审核"},
	{val:"-3" ,name: "审核未通过"},
	{val:"0" ,name: "待签约"},
	{val:"1" ,name: "待首付"},
	// {val:"2" ,name: "待商户审核"}, 

	{val:"5,6" ,name: "待放款"}, 
	//{val:"6" ,name: "放款中"},
	{val:"-4" ,name: "放款失败"},
	{val:"11" ,name: "待还款"},
	{val:"12" ,name: "还款处理中"},
	{val:"13" ,name: "逾期未还款"},
	{val:"21" ,name: "提前结清"},
	{val:"22" ,name: "正常结清"},
	{val:"23" ,name: "逾期结清"}
]
