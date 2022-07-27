<template>
	<view>
		<Lines></Lines>
		
		<view class="content">
			<view class="content-item">
				<view class="f-color">最近搜索</view>
				<view class="iconfont icon-iconset0213 f-color" @click="clearStorage"></view>
			</view>
				<block v-if="searchData.length>0">
					<text @click="goSearchList(item)" class="f-color content-text" v-for="(item,index) in searchData" :key="index">{{item}}</text>
				</block>
				<view v-else class="f-color content-search" >暂无搜索记录</view>
		</view>
		
		<view class="content">
			<view class="content-item">
				<view class="f-color">热门搜索</view>
			</view>
			<text class="f-color content-text">雪花啤酒</text>
			<text class="f-color content-text">崂山啤酒</text>
		</view>
		
	</view>
</template>

<script>
import Lines from '../../components/common/Lines.vue'
export default {
	components:{
		Lines
	},
	data() {
		return {
			keyWord:'',
			// 最近搜索的数据
			searchData:[]
		}
	},
	// 页面加载时
	onLoad(){
		uni.getStorage({
			key:"searchData",
			success: (res) => {
				this.searchData = JSON.parse(res.data)
			}
		})
	},
	// 监听点击搜索跳转页面
	onNavigationBarButtonTap(){
		this.search()
	},
	// 监听头部输入框为空，不能跳转
	onNavigationBarSearchInputChanged(e){
		this.keyWord = e.text
	},
	// 监听软键盘的搜索
	onNavigationBarSearchInputConfirmed(){
		this.search()
	},
	methods: {
		search(){
			if(this.keyWord == ''){
				return uni.showToast({
					title:"关键字不能为空",
					icon:"none"
				})
			}else{
				uni.navigateTo({
					url:`/pages/shop-list/shop-list?key=${this.keyWord}`
				})
				uni.hideKeyboard()
				this.addSearch()
			}
		},
		// 添加搜索记录
		addSearch(){
			let idx = this.searchData.indexOf(this.keyWord)
			if(idx == -1){
				this.searchData.unshift(this.keyWord)
			}else{
				this.searchData.unshift(JSON.parse((this.searchData.splice(idx,1))))
			}
			// 持久化存储
			uni.setStorage({
				key:"searchData",
				data:JSON.stringify(this.searchData)
			})
		},
		// 清除历史记录
		clearStorage(){
			uni.showModal({
				title:"重要提示",
				content:"确定要删除历史记录吗",
				success: (res) => {
					if(res.confirm){
						uni.removeStorage({
							key:"searchData"
						})
						this.searchData = []
					}
				}
			})
		},
		// 点击历史记录跳转
		goSearchList(item){
			uni.navigateTo({
				url:`/pages/shop-list/shop-list?key=${item}`,
				// data:{
				// 	name:item,
				// 	pprice:'desc'
				// }
			})
		}
	}
}
</script>

<style lang="scss" scoped>
	.content{
		padding: 20rpx;
		.content-item{
			display: flex;
			justify-content: space-between;
		}
		.content-text{
			display: inline-block;
			border: 1px solid #636263;
			border-radius: 20rpx;
			margin: 20rpx;
			padding: 8rpx 15rpx;
			font-size: 30rpx;
			background-color: #dddddd;
		}
		.content-search{
			text-align: center;
		}
	}

</style>
