// import { browserHistory } from 'react-router';
import moment from 'moment';

// 设置登录状态
export const set_logstate = (iflog,data) => {
	if(iflog){
		localStorage.setItem("isLogin",data);
	}else{
		localStorage.setItem("isLogin","");
	}
    // browserHistory.push(window.location.pathname+window.location.search);
}

// 获取地址栏参数
export const getUrlParam = (name) => {  
    let reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");  
    let r = window.location.search.substr(1).match(reg);  
    if (r!=null) 
      return decodeURI(r[2]); 
    return null;  
}

// 格式化表格参数  添加需要
export const format_table_data = (data) => {
	let source = JSON.parse(JSON.stringify(data));
	for(let s in source){
		var test_key=(parseInt(s,10)+1)<10?"0"+(parseInt(s,10)+1):(parseInt(s,10)+1);
		source[s].key = test_key;
		// source[s] = fmt_obj(source[s]);
		// source[s] = fmt_json(source[s])
	}
	return source;
}

// 格式化日期
export const format_date = (date)=>{
	let format = "YYYY-MM-DD";
	if(typeof date==="object"){
		return date?date.format(format):"";
	}else{
		return date?moment(date).format(format):"";
	}
}
// 格式化日期
export const format_time = (date)=>{
	let format = "YYYY-MM-DD HH:mm:ss";
	if(typeof date==="object"){
		return date?date.format(format):"";
	}else{
		return date?moment(date).format(format):"";
	}
}

// 添加滚动事件
export const add_event = (scrollFunc,ele) => {
	let doc = ele||document;
	if(document.addEventListener){
		doc.addEventListener("DOMMouseScroll",scrollFunc,false);
	}
	doc.onmousewheel = scrollFunc;
}
export const arr_chunk=(array,size)=>{
	//获取数组的长度，如果你传入的不是数组，那么获取到的就是undefined
	const length = array.length
	//判断不是数组，或者size没有设置，size小于1，就返回空数组
	if (!length || !size || size < 1) {
	  return []
	}
	//核心部分
	let index = 0 //用来表示切割元素的范围start
	let resIndex = 0 //用来递增表示输出数组的下标
  
	//根据length和size算出输出数组的长度，并且创建它。
	let result = new Array(2);
	// let result = new Array(Math.ceil(length / size))
	//进行循环
	while (index < length) {
	  //循环过程中设置result[0]和result[1]的值。该值根据array.slice切割得到。
	  result[resIndex++] = array.slice(index, (index += size))
	}
	//输出新数组
	return result
}
//表格排序
export const get_sort=(a,b,str,time)=>{
	if(a.key==="合计"||b.key==="合计"){
		return;
	}
	// alert(1)
	if(time){
		return (a[str]?this.getTimes(a[str]):0) - (b[str]?this.getTimes(b[str]):0)
	}else{
		return (a[str]?Number(a[str]):0) - (b[str]?Number(b[str]):0)
	}
}
