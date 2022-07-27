<template>
	<view>
		
		<shopList :keyWord="keyWord"></shopList>
		
	</view>
</template>

<script>
import shopList from '../../components/common/shopLIst.vue'
export default {
	components:{
		shopList
	},
	data() {
		return {
			keyWord:''
		}
	},
	onLoad(e){
		this.keyWord = e.key
		// #ifdef APP-PLUS
		var webView = this.$mp.page.$getAppWebview()
		webView.setTitleNViewSearchInputText(e.key)   
		// #endif
	},
	methods: {
		
	}
}
</script>

<style>

</style>
