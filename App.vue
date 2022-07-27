<script>
	export default {
		onLaunch: function() {
			this.$store.commit('initUser')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import './common/uni.css';
	@import './common/common.css';
	@import './common/iconfont.css';
	/* 解决小程序和app滚动条的问题 */
		/* #ifdef MP-WEIXIN || APP-PLUS */
			::-webkit-scrollbar {
			    display: none;
			    width: 0 !important;
			    height: 0 !important;
			    -webkit-appearance: none;
			    background: transparent;
			    color: transparent;
			  }
		/* #endif */
		
		/* 解决H5 的问题 */
		/* #ifdef H5 */
		    uni-scroll-view .uni-scroll-view::-webkit-scrollbar {
		    	/* 隐藏滚动条，但依旧具备可以滚动的功能 */
				display: none;
			    width: 0 !important;
			    height: 0 !important;
			    -webkit-appearance: none;
			    background: transparent;
			    color: transparent;
		    }
		/* #endif */
		::v-deep .uni-page-head .uni-btn-icon{
			overflow: visible;
		}
		::v-deep .uni-page-head .uni-page-head-ft{
			text-align: center;
		}
</style>
