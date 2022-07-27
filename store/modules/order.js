export default{
	state:{
		order_id:''
	},
	getters:{},
	mutations:{
		initOrder(state,id){
			state.order_id = id
		}
	}
}