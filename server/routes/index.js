var express = require('express');
var router = express.Router();
const cors = require('cors')
router.use(cors())
const connection = require('../db/sql')
var user = require('../db/userSql')
const jwt = require('jsonwebtoken')
//验证码
let code = '';
//接入短信的sdk
var QcloudSms = require("qcloudsms_js");
//引入支付宝沙箱配置
const alipaySdk = require('../db/alipay.js');
const AlipayFormData = require('alipay-sdk/lib/form').default;

router.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Content-Type', 'application/json;charset=utf-8');
  next();
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//支付接口
router.post('/api/payment', function(req, res, next) {
    //接收前端给后端的订单号
    let orderId = req.body.orderId;
    //总价
    let price = req.body.price;
    //商品名称
    let list = req.body.list.join('');
    console.log(req.body)
    const formData = new AlipayFormData();
    //调用get方法
    formData.setMethod('get');
    //支付时 的信息
    formData.addField('bizContent', {
      outTradeNo: orderId,//订单号
      productCode: 'FAST_INSTANT_TRADE_PAY',//写死的
      totalAmount: price,//金额
      subject: list//商品名称
    });
    //支付成功或者失败打开的页面
    formData.addField('returnUrl', 'http://192.168.1.12:8080/#/pages/payment-success/payment-success');
    
    const result = alipaySdk.exec(
      'alipay.trade.page.pay',
      {},
      { formData: formData },
    );
    result.then(resp=>{
        res.send({
            data:{
                code:200,
                success:true,
                paymentUrl:resp
            }
        })
    })
})


// 修改订单状态
router.post('/api/changeOrderStatus',(req,res,next)=>{
	// 拿到前端传递的token ，解码
	let token = req.headers.token
	let phone = jwt.decode( token )
	// 商品订单号
	let orderId = req.body.orderId
	// 商品id号(数组)
	let shopArr = req.body.shopArr
	// 拿到用户的id
	connection.query(` select * from user where phone = ${phone.name} `,(error,results)=>{
		let id = results[0].id
		// 先查询到【自增长的订单id】
		connection.query(` select * from store_order where uid = '${id}' and order_id = '${orderId}' `,(err,result)=>{
			let store_id =  result[0].id
			connection.query(` update store_order set order_status = 2 where id = ${store_id} `,(e,r)=>{
				// 删除购物车中的这俩商品
				shopArr.forEach(v=>{
					connection.query(` delete from goods_cart where id = ${v} `,(errors,ress)=>{
						
					})
				})
				res.send({
					data:{
						code:200,
						success:true,
					}
				})
			})
		})
	})
})
// 生成商品订单
router.post('/api/addOrder',(req,res,next)=>{
	// 拿到前端传递的token ，解码
	let token = req.headers.token
	let phone = jwt.decode( token )
	// 拿到前端给的数据
	let item = req.body.OrderItem
	let goods_name = []
	let goods_price = 0
	let goods_num = 0
	item.forEach(v=>{
		goods_name.push(v.name)
		goods_price += parseInt(v.pprice) * parseInt(v.num)
		goods_num += parseInt(v.num)
	})
	// console.log(goods_name,goods_price,goods_num)
	// 订单号用 时间戳+随机数 时间戳需要补零
	function zeroize(s){
		return s < 10 ? '0'+s : s 
	}
	function orderId(){
		let d = new Date()
		let year = d.getFullYear()
		let month = zeroize(d.getMonth()+1) 
		let day = zeroize(d.getDate()) 
		let hours = zeroize(d.getHours()) 
		let minutes = zeroize(d.getMinutes()) 
		let seconds = zeroize(d.getSeconds()) 
		let orderId = year+month+day+hours+minutes+seconds+Math.round(Math.random()*1000000)
		return orderId
	}
	// 订单号
	let OrderId = orderId()
	// 拿到用户的id
	connection.query(` select * from user where phone = ${phone.name} `,(error,results)=>{
		let id = results[0].id
		connection.query(` insert into store_order (uid,order_id,goods_name,goods_price,goods_num,order_status)
		values ( '${id}','${OrderId}','${goods_name}','${goods_price}','${goods_num}','1' ) `,(err,result)=>{
			connection.query(` select * from store_order where uid = '${id}' and order_id = '${OrderId}' `,(e,r)=>{
				res.send({
					data:{
						code:200,
						success:true,
						data:r
					}
				})
			})
		})
	})
})

// 修改购物车中商品的数量
router.post('/api/updateShopCart',(req,res,next)=>{
	// 拿到前端传递的token ，解码
	let token = req.headers.token
	let phone = jwt.decode( token )
	let newNum = req.body.newNum
	let cartId = req.body.cartId
	// 拿到用户的id
	connection.query(` select * from user where phone = ${phone.name} `,(error,results)=>{
		let id = results[0].id
		connection.query(` update goods_cart set num = '${newNum}' where uid = '${id}' and id = ${cartId} `,(err,result)=>{
			res.send({
				data:{
					success:true,
					msg:'修改成功'
				}
			})
		})
	})
})

// 添加购物车商品
router.post('/api/addShopCart',(req,res,next)=>{
	// 拿到前端传递的token ，解码
	let token = req.headers.token
	let phone = jwt.decode( token )
	
	let name = req.body.name
	let num = req.body.num
	let imgUrl = req.body.imgUrl
	let pprice = req.body.pprice
	let goods_id = req.body.id
	// 拿到用户的id
	connection.query(` select * from user where phone = ${phone.name} `,(error,results)=>{
		let id = results[0].id
		// 查询是否有此商品
		connection.query(` select * from goods_search where id = ${goods_id} `,(err,result)=>{
			// console.log(result)
			// 查询购物车中有没有添加过该商品
			connection.query(` select * from goods_cart where uid = ${id} and goods_id = ${goods_id} `,(e,r)=>{
				if(r.length>0){
					let newNum = r[0].num
					// 如果有,则让数量相加
					// console.log(num,newNum)
					connection.query(` update goods_cart set num = (${num}+${newNum}) where uid = ${id} and goods_id = ${goods_id} `,(errors,data)=>{
						 res.send({
							data:{
								success:true,
								msg:'成功'
							}
						 })
					})
				}else{
					// 如果没有，正常添加
					connection.query(` insert into goods_cart (name,imgUrl,pprice,num,uid,goods_id) values ( '${name}','${imgUrl}','${pprice}','${num}',${id},${goods_id} ) `,(err,result)=>{
						if(err) throw error
						res.send({
							data:{
								success:true,
								msg:'成功'
							}
						})
					})
				}
			})
		})
		// 如果添加的商品，购物车中已有，就累积数量
		// connection.query(` insert into goods_cart (uid,name,imgUrl,pprice,num) values ( ${id},'${name}','${imgUrl}','${pprice}','${num}' ) `,(err,result)=>{
		// 	if(err) throw error
		// 	res.send({
		// 		data:{
		// 			success:true,
		// 			msg:'成功'
		// 		}
		// 	})
		// })
	})
	
})

// 删除购物车里的商品
router.post('/api/deleteShopCart',(req,res,next)=>{
	// 拿到前端传递的token ，解码
	let token = req.headers.token
	let phone = jwt.decode( token )
	let cartId = req.body.id
	// 拿到用户的id
	connection.query(` select * from user where phone = ${phone.name} `,(error,results)=>{
		let id = results[0].id
		// 因为删除的可能是多条 所以要循环
		for(let i=0;i<cartId.length;i++){
			connection.query(` delete from goods_cart where uid = ${id} and id = ${cartId[i]} `,(err,result)=>{
			})
		}
		res.send({
			data:{
				success:true,
				msg:'删除成功'
			}
		})
	})
})

// 读取用户数据库的购物车商品
router.post('/api/selectShopCart',(req,res,next)=>{
	// 拿到前端传递的token ，解码
	let token = req.headers.token
	let phone = jwt.decode( token )
	// 拿到用户的id
	connection.query(` select * from user where phone = ${phone.name} `,(error,results)=>{
		let id = results[0].id
		connection.query(` select * from goods_cart where uid = ${id} `,(err,result)=>{
				res.send({
					data:{
						success:true,
						data:result
					}
				})
		})
	})
})

// 删除用户收货地址
router.post('/api/deleteAddress',(req,res,next)=>{
	// 拿到前端传递的token ，解码
	let token = req.headers.token
	let phone = jwt.decode( token )
	var addressId = req.body.iid
	var defaultAddress = req.body.isDefault ? '1' : '0'
	// 拿到用户的id
	connection.query(` select * from user where phone = ${phone.name} `,(error,results)=>{
		let id = results[0].id
		// 判断删除的是否是 默认地址 如果是则把最近的地址设置为默认地址
		if(defaultAddress==1){
			let sql = ` delete from address where userId = '${id}' and id = ${addressId} `
			connection.query(sql,(err,result)=>{
				// 查询最近的，把最近地址变为默认地址
				connection.query(` select * from address where userId = '${id}' `,(e,r)=>{
					if(r.length>0){
						let id = r[0].id
						connection.query(` update address set isDefault = 1 where id = ${id} `,(errors,ress)=>{
							res.send({
								data:{
									success:true,
									msg:'删除成功'
								}
							})
						})
					}else{
						res.send({
							data:{
								success:true,
								msg:'删除成功'
							}
						})
					}
				})
			})
		}else{
			let sql = ` delete from address where userId = '${id}' and id = ${addressId} `
			connection.query(sql,(err,result)=>{
				res.send({
					data:{
						success:true,
						msg:'删除成功'
					}
				})
			})
		}
	})
})

// 修改用户的收货地址
router.post('/api/updateAddress',(req,res,next)=>{
	// 拿到前端传递的token ，解码
	let token = req.headers.token
	let phone = jwt.decode( token )
	let name = req.body.name
	let userPhone = req.body.tel
	let province = req.body.province
	let city = req.body.city
	let district = req.body.district
	let detail = req.body.address
	let defaultAddress = req.body.isDefault ? '1' : '0'
	let addressId = req.body.id
	// 拿到用户的id
	connection.query(` select * from user where phone = ${phone.name} `,(error,results)=>{
		let id = results[0].id
		let sql = ` update address set name = '${name}',tel = '${userPhone}',province = '${province}',city = '${city}',district = '${district}',address = '${detail}',isDefault = '${defaultAddress}' where userId = '${id}' and id = ${addressId} `
		// 在插入之前判断 用户是否修改成默认地址
		if(defaultAddress==1){
			// 如果是默认值  把改用户之前的默认值全变为0，然后添加
			connection.query(` update address set isDefault = 0 where userId = ${id} `,(e,r)=>{
				connection.query(sql,(err,result)=>{
					res.send({
						data:{
							success:'成功'
						}
					})
				})
			})
		}else{
			// 不是默认值
			connection.query(sql,(err,result)=>{
				res.send({
					data:{
						success:'成功'
					}
				})
			})
		}
	})
})

// 新增用户的收货地址
router.post('/api/addAddress',(req,res,next)=>{
	// 拿到前端传递的token ，解码
	let token = req.headers.token
	let phone = jwt.decode( token )
	let name = req.body.name
	let userPhone = req.body.tel
	let province = req.body.province
	let city = req.body.city
	let district = req.body.district
	let detail = req.body.address
	let defaultAddress = req.body.isDefault ? '1' : '0'
	// 拿到用户的id
	connection.query(` select * from user where phone = ${phone.name} `,(error,results)=>{
		let id = results[0].id
		// 在插入之前判断 用户是否设置成默认地址
		if(defaultAddress==1){
			// 如果是默认地址  把之前的默认值改为0，把当前的改为1
			connection.query(` update address set isDefault = 0 where userId = ${id} `,(e,r)=>{
				let sqlInert = ` insert into address (name,tel,province,city,district,address,isDefault,userId) values('${name}','${userPhone}','${province}','${city}','${district}','${detail}','${defaultAddress}','${id}') `
				connection.query(sqlInert,(err,result)=>{
					res.send({
						data:{
							success:'成功'
						}
					})
				})
			})
		}else{
			// 如果不设置成默认值 直接写入就可以了
			let sqlInert = ` insert into address (name,tel,province,city,district,address,isDefault,userId) values('${name}','${userPhone}','${province}','${city}','${district}','${detail}','${defaultAddress}','${id}') `
			connection.query(sqlInert,(err,result)=>{
				res.send({
					data:{
						success:'成功'
					}
				})
			})
		}
	})
	
	
})

// 查询用户对象的收货地址
router.post('/api/selectAddress',(req,res,next)=>{
	// 拿到前端传递的token ，解码
	let token = req.headers.token
	let phone = jwt.decode( token )
	connection.query(` select * from user where phone = ${phone.name} `,(error,results)=>{
		let id = results[0].id
		connection.query(` select * from address where userId = ${id} `,(err,result)=>{
			if(result.length>0){
				res.send({
					data:result
				})
			}
		})
	})
})

// 第三方登录
router.post('/api/loginOther',(req,res,next)=>{
	// 拿到前端给的数据
	let params = {
		provider : req.body.provider,
		openid : req.body.openid,
		nickName : req.body.nickName,
		avatarUrl : req.body.avatarUrl
	}
	// 先查询数据库中有没有，有就读取，没有添加
	connection.query( user.queryUserName( params ),(error,results)=>{
		if(results.length>0){
			// 说明数据库中存在====》读取
				res.send({
					data:results[0]
				})
		}else{
			// 不存在===》添加
			connection.query( user.insertData( params ),(err,result)=>{
				// 查找 给前端返回数据
				connection.query( user.queryUserName( params ),(e,r)=>{
					res.send({
						data:r[0]
					})
				})
			})
		}
	})
	
	
})

// 注册 ===》向数据库中添加数据
router.post('/api/addUser',(req,res,next)=>{
	//前端给后端的数据
	let params = {
		userName : req.body.userName,
		userCode : req.body.userCode
	};
	if( params.userCode == code ){
		connection.query( user.insertData( params ),(error,results)=>{
			connection.query( user.queryUserName( params ) ,(error,results)=>{
				res.send({
					data:{
						success:true,
						data:results[0],
						msg:'注册成功'
					}
				})
			})
		} )
	}
	
})

// 发送验证码
router.post('/api/code', function(req, res, next) {
	//前端给后端的数据
	let params = {
		userName : req.body.userName
	};
	// 短信应用 SDK AppID
	var appid = 1400187558;  // SDK AppID 以1400开头
	// 短信应用 SDK AppKey
	var appkey = "dc9dc3391896235ddc2325685047edc7";
	// 需要发送短信的手机号码
	var phoneNumbers = [params.userName];
	// 短信模板 ID，需要在短信控制台中申请
	var templateId = 298000;  // NOTE: 这里的模板ID`7839`只是示例，真实的模板 ID 需要在短信控制台中申请
	// 签名
	var smsSign = "三人行慕课";  // NOTE: 签名参数使用的是`签名内容`，而不是`签名ID`。这里的签名"腾讯云"只是示例，真实的签名需要在短信控制台申请
	// 实例化 QcloudSms
	var qcloudsms = QcloudSms(appid, appkey);
	// 设置请求回调处理, 这里只是演示，用户需要自定义相应处理回调
	function callback(err, ress, resData) {
	  if (err) {
	      console.log("err: ", err);
	  } else {
		  code = ress.req.body.params[0];
	      res.send({
			  data:{
				  success:true,
				  code:code
			  }
		  })
	  }
	}
	var ssender = qcloudsms.SmsSingleSender();
	var paramss = [  Math.floor( Math.random()*(9999-1000))+1000 ];//发送的验证码
	ssender.sendWithParam("86", phoneNumbers[0], templateId,
	paramss, smsSign, "", "", callback); 
	
})


// 用户注册 查询数据库中有没有相应的手机号
router.post('/api/registered',(req,res,next)=>{
	// 拿到前端传递的数据
	let phone = req.body.phone
	connection.query(` select * from user where phone = '${phone}' `,(error,results)=>{
		if(!results.length){
			res.send({
				data:{
					success:true
				}
			})
		}else{
			res.send({
				data:{
					success:false,
					msg:'该用户已注册'
				}
			})
		}
	})
})

// 用户登录
router.post('/api/login',(req,res,next)=>{
	// 拿到前端给的数据
	let params = {
		userName : req.body.userName,
		userPwd : req.body.userPwd
	}
	connection.query( user.queryUserName( params ),(error,results)=>{
		if(error) throw error
		if(results.length>0){
			connection.query( user.queryUserPwd(params),(err,result)=>{
				// console.log(user.queryUserPwd(params))
				if(result.length>0){
					res.send({
						data:{
							success:true,
							data:result[0],
							msg:'登录成功'
						}
					})
				}else{
					res.send({
						data:{
							success:false,
							msg:'密码不正确'
						}
					})
				}
			} )
		}else{
			res.send({
				data:{
					success:false,
					msg:"用户名或手机号不存在哦"
				}
			})
		}
	} )
	
})

// 详情页相应的数据，点击跳转到详情页
router.get('/api/goods/detailData',(req,res,next)=>{
	// 拿到前端给的数据
	let id = req.query.id
	connection.query(` select * from goods_search where id = ${id} `,(error,result)=>{
		res.send({
			code:0,
			data:result
		})
	})
})

// 分类页面的数据
router.get('/api/goods/list',(req,res,next)=>{
	res.send({
		code:0,
		data:[
			{
				id:1,
				title:'家居家纺',
				data:[
					{
						title:'家纺',
						list:[
							{
								id:1,
								imgUrl:'../../static/img/Furnishing1.jpg',
								title:'毛巾/浴巾'
							},
							{
								id:2,
								imgUrl:'../../static/img/Furnishing1.jpg',
								title:'枕头'
							},
							{
								id:3,
								imgUrl:'../../static/img/Furnishing1.jpg',
								title:'被子'
							},
							{
								id:4,
								imgUrl:'../../static/img/Furnishing1.jpg',
								title:'被套'
							},
							{
								id:5,
								imgUrl:'../../static/img/Furnishing1.jpg',
								title:'套件'
							},
							{
								id:6,
								imgUrl:'../../static/img/Furnishing1.jpg',
								title:'毛巾/浴巾'
							},
							{
								id:7,
								imgUrl:'../../static/img/Furnishing1.jpg',
								title:'枕头'
							},
							{
								id:8,
								imgUrl:'../../static/img/Furnishing1.jpg',
								title:'被子'
							},
							{
								id:9,
								imgUrl:'../../static/img/Furnishing1.jpg',
								title:'被套'
							},
							{
								id:10,
								imgUrl:'../../static/img/Furnishing1.jpg',
								title:'套件'
							}
						]
					},
					{
						title:'生活日用',
						list:[
							{
								id:1,
								imgUrl:'../../static/img/Furnishing1.jpg',
								title:'毛巾/浴巾'
							},
							{
								id:2,
								imgUrl:'../../static/img/Furnishing1.jpg',
								title:'枕头'
							},
							{
								id:3,
								imgUrl:'../../static/img/Furnishing1.jpg',
								title:'被子'
							},
							{
								id:4,
								imgUrl:'../../static/img/Furnishing1.jpg',
								title:'被套'
							},
							{
								id:5,
								imgUrl:'../../static/img/Furnishing1.jpg',
								title:'套件'
							},
							{
								id:6,
								imgUrl:'../../static/img/Furnishing1.jpg',
								title:'毛巾/浴巾'
							},
							{
								id:7,
								imgUrl:'../../static/img/Furnishing1.jpg',
								title:'枕头'
							},
							{
								id:8,
								imgUrl:'../../static/img/Furnishing1.jpg',
								title:'被子'
							},
							{
								id:9,
								imgUrl:'../../static/img/Furnishing1.jpg',
								title:'被套'
							},
							{
								id:10,
								imgUrl:'../../static/img/Furnishing1.jpg',
								title:'套件'
							}
						]
					}
				]
			},
			{
				id:2,
				title:'男装',
				data:[
					{
						title:'男装-家纺',
						list:[
							{
								id:1,
								imgUrl:'../../static/img/Furnishing1.jpg',
								title:'毛巾/浴巾'
							},
							{
								id:2,
								imgUrl:'../../static/img/Furnishing1.jpg',
								title:'枕头'
							},
							{
								id:3,
								imgUrl:'../../static/img/Furnishing1.jpg',
								title:'被子'
							},
							{
								id:4,
								imgUrl:'../../static/img/Furnishing1.jpg',
								title:'被套'
							},
							{
								id:5,
								imgUrl:'../../static/img/Furnishing1.jpg',
								title:'套件'
							},
							{
								id:6,
								imgUrl:'../../static/img/Furnishing1.jpg',
								title:'毛巾/浴巾'
							},
							{
								id:7,
								imgUrl:'../../static/img/Furnishing1.jpg',
								title:'枕头'
							},
							{
								id:8,
								imgUrl:'../../static/img/Furnishing1.jpg',
								title:'被子'
							},
							{
								id:9,
								imgUrl:'../../static/img/Furnishing1.jpg',
								title:'被套'
							},
							{
								id:10,
								imgUrl:'../../static/img/Furnishing1.jpg',
								title:'套件'
							}
						]
					},
					{
						title:'男装-生活日用',
						list:[
							{
								id:1,
								imgUrl:'../../static/img/Furnishing1.jpg',
								title:'毛巾/浴巾'
							},
							{
								id:2,
								imgUrl:'../../static/img/Furnishing1.jpg',
								title:'枕头'
							},
							{
								id:3,
								imgUrl:'../../static/img/Furnishing1.jpg',
								title:'被子'
							},
							{
								id:4,
								imgUrl:'../../static/img/Furnishing1.jpg',
								title:'被套'
							},
							{
								id:5,
								imgUrl:'../../static/img/Furnishing1.jpg',
								title:'套件'
							},
							{
								id:6,
								imgUrl:'../../static/img/Furnishing1.jpg',
								title:'毛巾/浴巾'
							},
							{
								id:7,
								imgUrl:'../../static/img/Furnishing1.jpg',
								title:'枕头'
							},
							{
								id:8,
								imgUrl:'../../static/img/Furnishing1.jpg',
								title:'被子'
							},
							{
								id:9,
								imgUrl:'../../static/img/Furnishing1.jpg',
								title:'被套'
							},
							{
								id:10,
								imgUrl:'../../static/img/Furnishing1.jpg',
								title:'套件'
							}
						]
					}
				]
			},
			{
				id:3,
				title:'女装',
				data:[
					{
						title:'女装-家纺',
						list:[
							{
								id:1,
								imgUrl:'../../static/img/Furnishing1.jpg',
								title:'毛巾/浴巾'
							},
							{
								id:2,
								imgUrl:'../../static/img/Furnishing1.jpg',
								title:'枕头'
							},
							{
								id:3,
								imgUrl:'../../static/img/Furnishing1.jpg',
								title:'被子'
							},
							{
								id:4,
								imgUrl:'../../static/img/Furnishing1.jpg',
								title:'被套'
							},
							{
								id:5,
								imgUrl:'../../static/img/Furnishing1.jpg',
								title:'套件'
							},
							{
								id:6,
								imgUrl:'../../static/img/Furnishing1.jpg',
								title:'毛巾/浴巾'
							},
							{
								id:7,
								imgUrl:'../../static/img/Furnishing1.jpg',
								title:'枕头'
							},
							{
								id:8,
								imgUrl:'../../static/img/Furnishing1.jpg',
								title:'被子'
							},
							{
								id:9,
								imgUrl:'../../static/img/Furnishing1.jpg',
								title:'被套'
							},
							{
								id:10,
								imgUrl:'../../static/img/Furnishing1.jpg',
								title:'套件'
							}
						]
					},
					{
						title:'女装-生活日用',
						list:[
							{
								id:1,
								imgUrl:'../../static/img/Furnishing1.jpg',
								title:'毛巾/浴巾'
							},
							{
								id:2,
								imgUrl:'../../static/img/Furnishing1.jpg',
								title:'枕头'
							},
							{
								id:3,
								imgUrl:'../../static/img/Furnishing1.jpg',
								title:'被子'
							},
							{
								id:4,
								imgUrl:'../../static/img/Furnishing1.jpg',
								title:'被套'
							},
							{
								id:5,
								imgUrl:'../../static/img/Furnishing1.jpg',
								title:'套件'
							},
							{
								id:6,
								imgUrl:'../../static/img/Furnishing1.jpg',
								title:'毛巾/浴巾'
							},
							{
								id:7,
								imgUrl:'../../static/img/Furnishing1.jpg',
								title:'枕头'
							},
							{
								id:8,
								imgUrl:'../../static/img/Furnishing1.jpg',
								title:'被子'
							},
							{
								id:9,
								imgUrl:'../../static/img/Furnishing1.jpg',
								title:'被套'
							},
							{
								id:10,
								imgUrl:'../../static/img/Furnishing1.jpg',
								title:'套件'
							}
						]
					}
				]
			}
		]
	})
})

//搜索页的商品展示，排序
router.get('/api/goods/search',(req,res,next)=>{
	// desc 降序   asc 升序
	// 拿到的是键
	let [goodsName,orderName] = Object.keys(req.query)
	// 拿到的是值
	let name = req.query.name
	let order = req.query[orderName]
	connection.query(`select * from goods_search where name like '%${name}%' order by ${orderName} ${order}`,(error,results)=>{
		if(error) throw error
		res.send({
			data:{
				code:0,
				data:results
			}
		})
	})
})

//首次第一次触底的数据
router.get('/api/index_list/1/data/2', function(req, res, next) {
	res.json({
		code:"0",
		data:[
			{
				type:"commodityList",
				data:[
					{
						id:1,
						imgUrl:"../../static/img/commodity1.jpg",
						name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
						pprice:"299",
						oprice:"659",
						discount:"5.2"
					},
					{
						id:2,
						imgUrl:"../../static/img/commodity2.jpg",
						name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
						pprice:"299",
						oprice:"659",
						discount:"5.2"
					},
					{
						id:3,
						imgUrl:"../../static/img/commodity3.jpg",
						name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
						pprice:"299",
						oprice:"659",
						discount:"5.2"
					},
					{
						id:4,
						imgUrl:"../../static/img/commodity4.jpg",
						name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
						pprice:"299",
						oprice:"659",
						discount:"5.2"
					}
				]
			}
		]
	})
})

//运动户外第二次触底的数据
router.get('/api/index_list/2/data/3', function(req, res, next) {
	res.json({
		code:"0",
		data:[
			{
				type:"commodityList",
				data:[
					{
						id:1,
						imgUrl:"../../static/img/commodity1.jpg",
						name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
						pprice:"299",
						oprice:"659",
						discount:"5.2"
					},
					{
						id:2,
						imgUrl:"../../static/img/commodity2.jpg",
						name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
						pprice:"299",
						oprice:"659",
						discount:"5.2"
					},
					{
						id:3,
						imgUrl:"../../static/img/commodity3.jpg",
						name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
						pprice:"299",
						oprice:"659",
						discount:"5.2"
					},
					{
						id:4,
						imgUrl:"../../static/img/commodity4.jpg",
						name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
						pprice:"299",
						oprice:"659",
						discount:"5.2"
					}
				]
			}
		]
	})
})

//运动户外第一次触底的数据
router.get('/api/index_list/2/data/2', function(req, res, next) {
	res.json({
		code:"0",
		data:[
			{
				type:"commodityList",
				data:[
					{
						id:1,
						imgUrl:"../../static/img/commodity1.jpg",
						name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
						pprice:"299",
						oprice:"659",
						discount:"5.2"
					},
					{
						id:2,
						imgUrl:"../../static/img/commodity2.jpg",
						name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
						pprice:"299",
						oprice:"659",
						discount:"5.2"
					},
					{
						id:3,
						imgUrl:"../../static/img/commodity3.jpg",
						name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
						pprice:"299",
						oprice:"659",
						discount:"5.2"
					},
					{
						id:4,
						imgUrl:"../../static/img/commodity4.jpg",
						name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
						pprice:"299",
						oprice:"659",
						discount:"5.2"
					}
				]
			}
		]
	})
})

// 户外运动的数据
router.get('/api/index_list/2/data/1', function(req, res, next) {
  res.json({
	  code:"0",
	  data:[
		  {
			  type:"bannerList",
			  imgUrl:"../../static/img/banner1.jpg"
		  },
		  {
			  type:"iconsList",
			  data:[
				  {imgUrl:"../../static/img/icons1.png",name:"运动户外"},
				  {imgUrl:"../../static/img/icons2.png",name:"运动户外"},
				  {imgUrl:"../../static/img/icons3.png",name:"运动户外"},
				  {imgUrl:"../../static/img/icons4.png",name:"运动户外"},
				  {imgUrl:"../../static/img/icons5.png",name:"运动户外"},
				  {imgUrl:"../../static/img/icons6.png",name:"运动户外"},
				  {imgUrl:"../../static/img/icons7.png",name:"运动户外"},
				  {imgUrl:"../../static/img/icons8.png",name:"运动户外"}
			  ]
		  },
		  {
			  type:"hotList",
			  data:[
				  {
				  	id:1,
				  	imgUrl:"../../static/img/hot1.jpg",
				  	name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
				  	pprice:"299",
				  	oprice:"659",
				  	discount:"5.2"
				  },
				  {
				  	id:2,
				  	imgUrl:"../../static/img/hot2.jpg",
				  	name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
				  	pprice:"299",
				  	oprice:"659",
				  	discount:"5.2"
				  },
				  {
				  	id:3,
				  	imgUrl:"../../static/img/hot3.jpg",
				  	name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
				  	pprice:"299",
				  	oprice:"659",
				  	discount:"5.2"
				  }
			  ]
		  },
		  {
			  type:"shopList",
			  data:[
				  {
					  bigUrl:"../../static/img/shop.jpg",
					  data:[
						 {
						 	id:1,
						 	imgUrl:"../../static/img/shop1.jpg",
						 	name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
						 	pprice:"299",
						 	oprice:"659",
						 	discount:"5.2"
						 },
						 {
						 	id:2,
						 	imgUrl:"../../static/img/shop2.jpg",
						 	name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
						 	pprice:"299",
						 	oprice:"659",
						 	discount:"5.2"
						 },
						 {
						 	id:3,
						 	imgUrl:"../../static/img/shop3.jpg",
						 	name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
						 	pprice:"299",
						 	oprice:"659",
						 	discount:"5.2"
						 },
						 {
						 	id:4,
						 	imgUrl:"../../static/img/shop4.jpg",
						 	name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
						 	pprice:"299",
						 	oprice:"659",
						 	discount:"5.2"
						 },
						 {
						 	id:1,
						 	imgUrl:"../../static/img/shop1.jpg",
						 	name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
						 	pprice:"299",
						 	oprice:"659",
						 	discount:"5.2"
						 },
						 {
						 	id:2,
						 	imgUrl:"../../static/img/shop2.jpg",
						 	name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
						 	pprice:"299",
						 	oprice:"659",
						 	discount:"5.2"
						 },
						 {
						 	id:3,
						 	imgUrl:"../../static/img/shop3.jpg",
						 	name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
						 	pprice:"299",
						 	oprice:"659",
						 	discount:"5.2"
						 },
						 {
						 	id:4,
						 	imgUrl:"../../static/img/shop4.jpg",
						 	name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
						 	pprice:"299",
						 	oprice:"659",
						 	discount:"5.2"
						 }
					  ]
				  },
				  {
					  bigUrl:"../../static/img/shop.jpg",
					  data:[
						 {
						 	id:1,
						 	imgUrl:"../../static/img/shop1.jpg",
						 	name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
						 	pprice:"299",
						 	oprice:"659",
						 	discount:"5.2"
						 },
						 {
						 	id:2,
						 	imgUrl:"../../static/img/shop2.jpg",
						 	name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
						 	pprice:"299",
						 	oprice:"659",
						 	discount:"5.2"
						 },
						 {
						 	id:3,
						 	imgUrl:"../../static/img/shop3.jpg",
						 	name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
						 	pprice:"299",
						 	oprice:"659",
						 	discount:"5.2"
						 },
						 {
						 	id:4,
						 	imgUrl:"../../static/img/shop4.jpg",
						 	name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
						 	pprice:"299",
						 	oprice:"659",
						 	discount:"5.2"
						 },
						 {
						 	id:1,
						 	imgUrl:"../../static/img/shop1.jpg",
						 	name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
						 	pprice:"299",
						 	oprice:"659",
						 	discount:"5.2"
						 },
						 {
						 	id:2,
						 	imgUrl:"../../static/img/shop2.jpg",
						 	name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
						 	pprice:"299",
						 	oprice:"659",
						 	discount:"5.2"
						 },
						 {
						 	id:3,
						 	imgUrl:"../../static/img/shop3.jpg",
						 	name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
						 	pprice:"299",
						 	oprice:"659",
						 	discount:"5.2"
						 },
						 {
						 	id:4,
						 	imgUrl:"../../static/img/shop4.jpg",
						 	name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
						 	pprice:"299",
						 	oprice:"659",
						 	discount:"5.2"
						 }
					  ]
				  }				  
			  ]
		  },
		  {
		  	type:"commodityList",
		  	data:[
		  		{
		  			id:1,
		  			imgUrl:"../../static/img/commodity1.jpg",
		  			name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
		  			pprice:"299",
		  			oprice:"659",
		  			discount:"5.2"
		  		},
		  		{
		  			id:2,
		  			imgUrl:"../../static/img/commodity2.jpg",
		  			name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
		  			pprice:"299",
		  			oprice:"659",
		  			discount:"5.2"
		  		},
		  		{
		  			id:3,
		  			imgUrl:"../../static/img/commodity3.jpg",
		  			name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
		  			pprice:"299",
		  			oprice:"659",
		  			discount:"5.2"
		  		},
		  		{
		  			id:4,
		  			imgUrl:"../../static/img/commodity4.jpg",
		  			name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
		  			pprice:"299",
		  			oprice:"659",
		  			discount:"5.2"
		  		}
		  	]
		  }
	  ]
  })
});

// 服饰内衣的数据
router.get('/api/index_list/3/data/1', function(req, res, next) {
  res.json({
	  code:"0",
	  data:[
		  {
			  type:"bannerList",
			  imgUrl:"../../static/img/banner1.jpg"
		  },
		  {
			  type:"iconsList",
			  data:[
				  {imgUrl:"../../static/img/icons1.png",name:"服饰内衣"},
				  {imgUrl:"../../static/img/icons2.png",name:"服饰内衣"},
				  {imgUrl:"../../static/img/icons3.png",name:"服饰内衣"},
				  {imgUrl:"../../static/img/icons4.png",name:"服饰内衣"},
				  {imgUrl:"../../static/img/icons5.png",name:"服饰内衣"},
				  {imgUrl:"../../static/img/icons6.png",name:"服饰内衣"},
				  {imgUrl:"../../static/img/icons7.png",name:"服饰内衣"},
				  {imgUrl:"../../static/img/icons8.png",name:"服饰内衣"}
			  ]
		  },
		  {
			  type:"hotList",
			  data:[
				  {
				  	id:1,
				  	imgUrl:"../../static/img/hot1.jpg",
				  	name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
				  	pprice:"299",
				  	oprice:"659",
				  	discount:"5.2"
				  },
				  {
				  	id:2,
				  	imgUrl:"../../static/img/hot2.jpg",
				  	name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
				  	pprice:"299",
				  	oprice:"659",
				  	discount:"5.2"
				  },
				  {
				  	id:3,
				  	imgUrl:"../../static/img/hot3.jpg",
				  	name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
				  	pprice:"299",
				  	oprice:"659",
				  	discount:"5.2"
				  }
			  ]
		  },
		  {
			  type:"shopList",
			  data:[
				  {
					  bigUrl:"../../static/img/shop.jpg",
					  data:[
						 {
						 	id:1,
						 	imgUrl:"../../static/img/shop1.jpg",
						 	name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
						 	pprice:"299",
						 	oprice:"659",
						 	discount:"5.2"
						 },
						 {
						 	id:2,
						 	imgUrl:"../../static/img/shop2.jpg",
						 	name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
						 	pprice:"299",
						 	oprice:"659",
						 	discount:"5.2"
						 },
						 {
						 	id:3,
						 	imgUrl:"../../static/img/shop3.jpg",
						 	name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
						 	pprice:"299",
						 	oprice:"659",
						 	discount:"5.2"
						 },
						 {
						 	id:4,
						 	imgUrl:"../../static/img/shop4.jpg",
						 	name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
						 	pprice:"299",
						 	oprice:"659",
						 	discount:"5.2"
						 },
						 {
						 	id:1,
						 	imgUrl:"../../static/img/shop1.jpg",
						 	name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
						 	pprice:"299",
						 	oprice:"659",
						 	discount:"5.2"
						 },
						 {
						 	id:2,
						 	imgUrl:"../../static/img/shop2.jpg",
						 	name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
						 	pprice:"299",
						 	oprice:"659",
						 	discount:"5.2"
						 },
						 {
						 	id:3,
						 	imgUrl:"../../static/img/shop3.jpg",
						 	name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
						 	pprice:"299",
						 	oprice:"659",
						 	discount:"5.2"
						 },
						 {
						 	id:4,
						 	imgUrl:"../../static/img/shop4.jpg",
						 	name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
						 	pprice:"299",
						 	oprice:"659",
						 	discount:"5.2"
						 }
					  ]
				  },
				  {
					  bigUrl:"../../static/img/shop.jpg",
					  data:[
						 {
						 	id:1,
						 	imgUrl:"../../static/img/shop1.jpg",
						 	name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
						 	pprice:"299",
						 	oprice:"659",
						 	discount:"5.2"
						 },
						 {
						 	id:2,
						 	imgUrl:"../../static/img/shop2.jpg",
						 	name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
						 	pprice:"299",
						 	oprice:"659",
						 	discount:"5.2"
						 },
						 {
						 	id:3,
						 	imgUrl:"../../static/img/shop3.jpg",
						 	name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
						 	pprice:"299",
						 	oprice:"659",
						 	discount:"5.2"
						 },
						 {
						 	id:4,
						 	imgUrl:"../../static/img/shop4.jpg",
						 	name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
						 	pprice:"299",
						 	oprice:"659",
						 	discount:"5.2"
						 },
						 {
						 	id:1,
						 	imgUrl:"../../static/img/shop1.jpg",
						 	name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
						 	pprice:"299",
						 	oprice:"659",
						 	discount:"5.2"
						 },
						 {
						 	id:2,
						 	imgUrl:"../../static/img/shop2.jpg",
						 	name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
						 	pprice:"299",
						 	oprice:"659",
						 	discount:"5.2"
						 },
						 {
						 	id:3,
						 	imgUrl:"../../static/img/shop3.jpg",
						 	name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
						 	pprice:"299",
						 	oprice:"659",
						 	discount:"5.2"
						 },
						 {
						 	id:4,
						 	imgUrl:"../../static/img/shop4.jpg",
						 	name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
						 	pprice:"299",
						 	oprice:"659",
						 	discount:"5.2"
						 }
					  ]
				  }				  
			  ]
		  },
		  {
		  	type:"commodityList",
		  	data:[
		  		{
		  			id:1,
		  			imgUrl:"../../static/img/commodity1.jpg",
		  			name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
		  			pprice:"299",
		  			oprice:"659",
		  			discount:"5.2"
		  		},
		  		{
		  			id:2,
		  			imgUrl:"../../static/img/commodity2.jpg",
		  			name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
		  			pprice:"299",
		  			oprice:"659",
		  			discount:"5.2"
		  		},
		  		{
		  			id:3,
		  			imgUrl:"../../static/img/commodity3.jpg",
		  			name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
		  			pprice:"299",
		  			oprice:"659",
		  			discount:"5.2"
		  		},
		  		{
		  			id:4,
		  			imgUrl:"../../static/img/commodity4.jpg",
		  			name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
		  			pprice:"299",
		  			oprice:"659",
		  			discount:"5.2"
		  		}
		  	]
		  }
	  ]
  })
});

// 首页的数据
router.get("/api/index_list/data",function(req,res,next){
	res.send({
		"code":0,
		"data":{
			topBar:[
				{id:1,name:'推荐'},
				{id:2,name:'运动户外'},
				{id:3,name:'服饰内衣'},
				{id:4,name:'鞋靴箱包'},
				{id:5,name:'美妆个护'},
				{id:6,name:'家居数码'},
				{id:7,name:'食品母婴'}
			],
			data:[
				{
					type:"swiperList",
					data:[
						{imgUrl:'../../static/img/swiper1.jpg'},
						{imgUrl:'../../static/img/swiper2.jpg'},
						{imgUrl:'../../static/img/swiper3.jpg'}
					]
				},
				{
					type:"recommendList",
					data:[
						{
							bigUrl:"../../static/img/Children.jpg",
							data:[
								{imgUrl:"../../static/img/Children1.jpg"},
								{imgUrl:"../../static/img/Children2.jpg"},
								{imgUrl:"../../static/img/Children3.jpg"}
							]
						},
						{
							bigUrl:"../../static/img/Furnishing.jpg",
							data:[
								{imgUrl:"../../static/img/Furnishing1.jpg"},
								{imgUrl:"../../static/img/Furnishing2.jpg"},
								{imgUrl:"../../static/img/Furnishing3.jpg"}
							]
						}
					]
				},
				{
					type:"commodityList",
					data:[
						{
							id:1,
							imgUrl:"../../static/img/commodity1.jpg",
							name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
							pprice:"299",
							oprice:"659",
							discount:"5.2"
						},
						{
							id:2,
							imgUrl:"../../static/img/commodity2.jpg",
							name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
							pprice:"299",
							oprice:"659",
							discount:"5.2"
						},
						{
							id:3,
							imgUrl:"../../static/img/commodity3.jpg",
							name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
							pprice:"299",
							oprice:"659",
							discount:"5.2"
						},
						{
							id:4,
							imgUrl:"../../static/img/commodity4.jpg",
							name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
							pprice:"299",
							oprice:"659",
							discount:"5.2"
						}
					]
				}
			]
		}
	})
});

module.exports = router;
