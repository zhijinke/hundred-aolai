let user = {
	// 查询用户手机号|用户名
	queryUserName(param){
		if(param.userName){
			//phone = 应该是手机号这个变量[属性],为了后面好操作所有名称改为:userName
			return ` select * from user where userName = '${param.userName}' or phone = '${param.userName}' `
		}else{
			return ` select * from user where provider = '${param.provider}' or openid = '${param.openid}' `
		}
		
	},
	// 验证用户和密码
	queryUserPwd(param){
		return ` select * from user where (userName = '${param.userName}' or phone = '${param.userName}') and (userPwd = '${param.userPwd}') `
	},
	// 增加一条用户数据
	insertData(param){
		let userName = param.userName || param.openid
		const jwt = require('jsonwebtoken')
		let payload = {name:userName} // 用户名
		let secret = 'zhijinke'  // 口令
		let imgUrl = param.avatarUrl || '/static/img/userImg.png'  // 头像
		let nickName = param.nickName || '默认昵称'
		let token = jwt.sign(payload,secret)
		
		return ` insert into user (userName,userPwd,phone,imgUrl,nickName,token,provider,openid) values ('','666666','${userName}','${imgUrl}','${nickName}','${token}','${param.provider}','${param.openid}') `
	}
}	

exports = module.exports = user