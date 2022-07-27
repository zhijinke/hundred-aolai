<template>
	<view class="index">
		
		<scroll-view scroll-x="true" class="scroll-view" :scroll-into-view="scrollIntoId">
			<view class="scroll-item" v-for="(item,index) in topBar" :key="index" @click="changIndex(index)" :id="'top'+index">
				<text class="scroll-text" :class="currentIndex===index?'f-active-color':'f-color'">{{item.name}}</text>
			</view>
		</scroll-view>
		
		<swiper @change="changeTopbar" :current="currentIndex" :style="'height: '+seeContent+'px;'" >
			<swiper-item v-for="(item,index) in newTopBar" :key="index">
				<view class="swiper-item">
					
						<scroll-view scroll-y="true" :style="'height: '+seeContent+'px;'" @scrolltolower="loadMore(index)">
							<block v-if="item.data.length>0">
								<block v-for="(k,i) in item.data" :key="i">
									<!-- 推荐 -->
									<IndexSwiper v-if="k.type==='swiperList'" :dataList="k.data"></IndexSwiper>
									<template v-if="k.type==='recommendList'">
										<Recommend :dataList="k.data"></Recommend>
										<Card>猜你喜欢</Card>
									</template>
									<!-- 运动户外 -->
									<Banner v-if="k.type==='bannerList'" :dataList="k.imgUrl"></Banner>
									<template v-if="k.type==='iconsList'">
										<Icons :dataList="k.data"></Icons>
										<Card>热销爆品</Card>
									</template>
									<template v-if="k.type==='hotList'">
										<Hot :dataList="k.data"></Hot>
										<Card>推荐店铺</Card>
									</template>
									<template v-if="k.type==='shopList'" >
										<Shop :dataList="k.data"></Shop>
										<Card>为您推荐</Card>
									</template>
									<CommodityList v-if="k.type==='commodityList'" :dataList="k.data"></CommodityList>
								</block>
							</block>
							<view v-else>暂无数据...</view>
							<view class="upMore f-color">
								{{item.loadText}}
							</view>
						</scroll-view>
						
				</view>
			</swiper-item>
		</swiper>
		<Tabbar currentPage="index"></Tabbar>
	</view>
</template>

<script>
import Tabbar from '../../components/common/Tabbar.vue'
import $http from '../../common/api/request.js'
import IndexSwiper from '../../components/index/IndexSwiper.vue';
import Recommend from '../../components/index/Recommend.vue';
import Card from '../../components/common/Card.vue';
import CommodityList from '../../components/common/CommodityList.vue';
import Banner from '../../components/index/Banner.vue';
import Icons from '../../components/index/Icons.vue';
import Hot from '../../components/index/Hot.vue';
import Shop from '../../components/index/Shop.vue'
export default {
	components:{
		IndexSwiper,
		Recommend,
		Card,
		CommodityList,
		Banner,
		Icons,
		Hot,
		Shop,
		Tabbar
	},
	data() {
		return {
			// 选中的下标
			currentIndex:0,
			// 顶部跟随下标
			scrollIntoId:'top0',
			// 可视区域内容的高度
			seeContent:0,
			// 顶部数据
			topBar:[],
			// 承载数据
			newTopBar:[]
		}
	},
	onLoad() {
		this.getData()
	},
	onReady(){
		uni.getSystemInfo({
			success: (res) => {
				// this.clentHeight = res.windowHeight - uni.upx2px(80)-this.getClientHeight();
				this.seeContent = res.windowHeight - uni.upx2px(-20)-this.getClientHight();
			}
		})
	},
	onNavigationBarButtonTap(e){
		if(e.float == 'left'){
			uni.navigateTo({
				url:"/pages/search/search"
			})
		}
	},
	methods: {
		// 改变topbar上方点击文字变色
		changIndex(index){
			if(this.currentIndex===index){
				return;
			}
			this.currentIndex = index,
			this.scrollIntoId = 'top'+index
			// 当滑动的次数为第一次的时候才加载数据
			if(this.newTopBar[index].load == "first"){
				this.addData()
			}
		},
		// 对应滑动
		changeTopbar(e){
			this.changIndex(e.detail.current)
		},
		// 获取首页数据
		getData(){
			$http.request({
				url:'/index_list/data',
			}).then(res=>{
				this.topBar = res.topBar
				this.newTopBar = this.initData(res)
			}).catch((err)=>{
				uni.showToast({
					title:'出错啦',
					icon:'none'
				})
			})
		},
		// 添加数据
		initData(res){
			let arr = []
			for(let i=0;i<this.topBar.length;i++){
				let obj = {
					data:[],
					load:'first',
					loadText:'上拉加载更多...'
				}
				// 获取首次数据
				if(i==0){
					obj.data = res.data;
				}
				arr.push(obj)
			}
			return arr
		},
		// 获取可视区域高度 【兼容】
		getClientHight(){
			const res =	uni.getSystemInfoSync()
			const system = res.platform
			if(system === 'ios'){
				return 44+res.statusBarHeight
			}else if(system === 'android'){
				return 48+res.statusBarHeight;
			}else{
				return 0;
			}
		},
		// 获取对应数据
		addData(callback){
			let index = this.currentIndex
			let id = this.topBar[index].id
			// 请求不同的数据
			let  page = Math.ceil(this.newTopBar[index].data.length / 5) + 1
			$http.request({
				url:`/index_list/${id}/data/${page}`
			}).then(res=>{
				this.newTopBar[index].data = [...this.newTopBar[index].data,...res]
			}).catch((err)=>{
				uni.showToast({
					title:'我也是有底线的...',
					icon:'none'
				})
			})
			// 请求完数据以后把first改掉，防止重复请求
			this.newTopBar[index].load = "last" 
			
			if(typeof callback == 'function'){
				callback()
			}
		},
		// 上拉加载
		loadMore(index){
			this.newTopBar[index].loadText = '加载中...'
			// 获取数据后，文字变回【上拉加载更多】
			this.addData(()=>{
				this.newTopBar[index].loadText = '上拉加载更多...'
			})
		}
	}
}
</script>

<style lang="scss" scoped>
	.scroll-view{
		width: 100%;
		height: 80rpx;
		white-space: nowrap;
		.scroll-item{
			display: inline-block;
			padding: 10rpx 30rpx;
			.scroll-text{
				font-size: 30rpx;
				padding-bottom: 10rpx;
			}
		}
	}
	.f-active-color{
		border-bottom: 4rpx solid #49BDFB;
	}
	.upMore{
		text-align: center;
		padding: 10rpx 0;
		border-top:2rpx solid #636263 ;
	}
</style>
