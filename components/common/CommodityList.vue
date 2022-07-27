<template>
	<view class="commodity-list">
		
		<!-- 单个商品的封装 -->
		<Commodity :dataList="dataList"></Commodity>
		
	</view>
</template>

<script>
import Commodity from './Commodity.vue'
export default {
	components:{
		Commodity
	},
	props:{
		dataList:Array
	},
	data(){
		return{
			
		}
	}
}
</script>

<style>
</style>