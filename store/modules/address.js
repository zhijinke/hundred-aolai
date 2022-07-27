export default{
	state:{
		list:[]
	},
	getters:{
		// 筛选默认值为true的
		defaultPath(state){
			return state.list.filter(v=>{
				return v.isDefault==1
			})
		}
	},
	mutations:{
		// 新增地址
		addListItem(state,obj){
			state.list.push(obj)
		},
		// 修改地址
		updateAddress(state,{item}){
			state.list.splice(item.index,1)
			state.list.unshift(item.item)
		},
		// 唯一的默认地址，排他思想
		removeDefault(state,item){
			// state.list.forEach(v=>{
			// 	v.isDefault = true
			// })
			item.isDefault = false
		},
		// 相应用户的地址存到list
		insertAddress(state,item){
			state.list = item
		},
		// 删除地址
		deleteAddress(state,id){
			state.list.forEach((v,i)=>{
				if(v.id==id){
					state.list.splice(i,i)
				}
			})
		}
	},
	actions:{
		addListItemFn({commit},obj){
			if(obj.isDefault){
				commit('removeDefault',obj)
			}
			commit('addListItem',obj)
		},
		updateAddressFn({commit},item){
			if(item.item.isDefault){
				commit('removeDefault',item.item)
			}
			commit('updateAddress',{item})
		},
		deleteAddressFn({commit},id){
			commit('deleteAddress',id)
		}
	}
}