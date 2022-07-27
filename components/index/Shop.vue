<template>
	<view class="shop">
		<view class="shop-item" v-for="(item,index) in dataList" :key="index">
			
			<view class="shop-big">
				<!-- {{item}} -->
				<image class="shop-big" :src="item.bigUrl" mode=""></image>
			</view>
			<scroll-view scroll-x="true" class="scroll-content">
				<view class="scroll-item">
					<Commodity
					 :dataList="item.data" 
					 wrap='no-wrap'
					 itemW='200rpx'
					 bigH='200rpx'
					 nameSize="20rpx"
					 ></Commodity>
				</view>
			</scroll-view>
			
		</view>
	</view>
</template>

<script>
import Commodity from '../../components/common/Commodity.vue'
export default{
	props:{
		dataList:Array
	},
	components:{
		Commodity
	},
	data(){
		return{
			shopList:[
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
								imgUrl:"../../static/img/shop1.jpg",
								name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
								pprice:"299",
								oprice:"659",
								discount:"5.2"
							},
							{
								id:1,
								imgUrl:"../../static/img/shop2.jpg",
								name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
								pprice:"299",
								oprice:"659",
								discount:"5.2"
							},
							{
								id:2,
								imgUrl:"../../static/img/shop3.jpg",
								name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
								pprice:"299",
								oprice:"659",
								discount:"5.2"
							},
							{
								id:3,
								imgUrl:"../../static/img/shop1.jpg",
								name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
								pprice:"299",
								oprice:"659",
								discount:"5.2"
							},
							{
								id:4,
								imgUrl:"../../static/img/shop2  .jpg",
								name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
								pprice:"299",
								oprice:"659",
								discount:"5.2"
							}
						]
		}
	}
}
</script>

<style lang="scss" scoped>
	.shop-big{
		width: 100%;
		height: 350rpx;
	}
	.scroll-content{
		width: 100%;
		white-space: nowrap;
		.scroll-item{
			display: inline-block;
		}
	}

</style>