export default{
	state:{
		list:[],
		// 存放的是选中的id
		selectList:[]
	},
	getters:{
		isCheckAll(state){
			// 判断他们俩长度是否相等，如果相等返回 true 说明 要全不选。 反之亦然
			return state.list.length == state.selectList.length
		},
		// 价格+结算数量
		totalCount(state){
			let total = {
				price:0,
				num:0
			}
			state.list.forEach(v=>{
				//判断是否选中
				if(state.selectList.indexOf(v.id)>-1){
					//价格
					total.price += v.pprice * v.num
					//数量
					total.num += parseInt(v.num)
				}
			})
			return total
		},
		getListItem(state){
			return state.selectList
		}
	},
	mutations:{
		// 全选
		checkAll(state){
			state.selectList = state.list.map(v=>{
				v.checked = true
				return v.id
			})
		},
		
		// 全不选
		unCheckAll(state){
			state.list.forEach(v=>{
				v.checked = false
				state.selectList = []
			})
		},
		// 单选
		selectItem(state,index){
			let id = state.list[index].id
			let i = state.selectList.indexOf(id)
			// 如果i>-1,说明i在selectList中，要取消，
			if(i > -1){
				state.list[index].checked = false
				return state.selectList.splice(i,1)
			}
				state.list[index].checked = true
				state.selectList.push(id)
		},
		// 判断selectList中是否有，如果有就删除
		isSelectListHas(state){
			state.list = state.list.filter(v=>{
				return state.selectList.indexOf(v.id) == -1
			})
		},
		// 加入购物车 存入数据list
		addShopcart(state,item){
			state.list.push(item)
		},
		// 拿到数据库的数据，存入list
		initGetData(state,list){
			state.list = list
		},
	},
	actions:{
		isCheckedAll({commit,getters}){
			getters.isCheckAll ? commit('unCheckAll') : commit('checkAll')
		},
		// 删除
		deleteItem({commit}){
			commit('isSelectListHas')
			commit('unCheckAll')
			uni.showToast({
				title:'商品删除成功',
				icon:'none'
			})
		}
	}
}