// 数据请求接口地址
const api = {
	//主机监控
	//列表页
	get_dashboard_base_info:"/api/get_dashboard_base_info",
	//详情接口
	get_base_info:"/api/get_base_info",
	//获取CPU状态数据
	get_cpu_info:"/api/get_cpu_info",
	//获取内存信息
	get_mem_info:"/api/get_mem_info",
	//获取磁盘列表
	get_disk_list:"/api/get_disk_list",
	//获取磁盘状态
	get_disk_info:"/api/get_disk_info",
	//获取磁盘负载列表
	get_disk_util_list:"/api/get_disk_util_list",
	//获取磁盘负载详情
	get_disk_util_info:"/api/get_disk_util_info",
	//获取网络接口
	get_network_interface_list:"/api/get_network_interface_list",
	//获取网络详情
	get_network_info:"/api/get_network_info"
}

module.exports = api ;
