<template>
	<view class="card">
		
		<view class="card-icon">—</view>
		<view class="card-name">
			<slot>
				猜你喜欢
			</slot>
		</view>
		<view class="card-icon">—</view>
		
	</view>
</template>

<script>
</script>

<style scoped>
	.card{
		display: flex;
		flex-direction: row;
		justify-content: center;
		font-weight: bold;
		margin: 20rpx;
	}
	.card-name{
		padding: 0 20rpx;
		font-size: 32rpx;
	}
</style>