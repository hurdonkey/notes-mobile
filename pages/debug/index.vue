<template>
	<view>
		<uni-nav-bar 
			status-bar=true 
			left-icon="back" 
			left-text="返回"
			@click-left="back"
		   	title="调试">
		</uni-nav-bar>
		<scroll-view scroll-x=true scroll-y=true>
			{{debug}}
		</scroll-view>
	</view>
</template>

<script>
import config from "../../commons/config.js";
import component from "../../components/component.js";
import uniNavBar from "../../components/unis/uni-nav-bar.vue";

export default {
	mixins:[component],

	components: {
		"uni-nav-bar": uniNavBar,
	},

	data() {
		return {
		}
	},

	computed: {
		debug() {
			const sysinfo = uni.getSystemInfoSync();
			return JSON.stringify({
				...config,
				sysinfo,
			}, undefined, 4);
		}
	},
	async onLoad() {
	},

	methods: {
	}
}
</script>

<style lang="less" scoped>
</style>
