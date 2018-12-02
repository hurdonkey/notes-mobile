
import vue from "vue";
import {mapGetters, mapActions, mapMutations} from "vuex";

import _ from "../libs/lodash.min.js";

import api from "../commons/api/index.js";
//import io from "socket.io-client";

export default {
	data: function() {
		return {
			api: api,
		}
	},

	props: {
	},

	computed: {
		...mapGetters({
			token: "token",
			user: "user",
			isAuthenticated: "isAuthenticated",
			getData: "getData",
		}),
		authUserId() {
			if (this.user && this.user.id) return this.user.id;
			return 0;
		},
		authUsername() {
			if (this.user && this.user.username) return this.user.username;
			return "";
		},
		isSmallScreen() {
			return this.$store.state.isSmallScreen;
		},
		editorMode() {
			return this.getData("__editor_mode__")  || "normal";
		},
		currentUrl() {
			return this.getData("__currentUrl__");
		},
		currentContent() {
			return this.getData("__currentContent__");
		},
		socketState() {
			return this.getData("__socket_state__");
		},
	},

	methods: {
		...mapMutations({
			setUser: "setUser",
			setToken: "setToken",
			setMsg: "setMsg",
		}),
		systemPortrait(username = "username") {
			const key = username.toLowerCase()[0] + 1;
			return g_app.portraits[key];
		},
		initSocket() {
			const user = jwt.decode(this.token, null, true);
			if (!user || !user.userId) { 
				console.log("token 无效", this.token);
				return ;
			}

			if (g_app.socket) {
				console.log("socket already exist");
				return g_app.socket;
			}

			const socket = io(config.socketUrl, {
				query: {
					token: this.token,
					userId: user.id || user.userId,
				},
				transports: ['websocket'],
			});


			socket.on("connect", () => {
				console.log("socket connect successful", socket);
				this.setData("__socket_state__", "connect");
			});

			socket.on("disconnect", msg => {
				console.log("socket disconnect", msg);
				//g_app.socket = undefined;
				this.setData("__socket_state__", "disconnect");
			});

			socket.on("error", e => {
				console.log("socket error", e);
			});

			g_app.socket = socket;

			return socket;
		},
		authenticated() {
			if (this.isAuthenticated) return {...this.user, userId:this.user.id};

			uni.reLaunch({url:"/pages/login/index"});
			//this.$router.push({path:"/note/users/login"});
		},
		setShareData(key, data) {
			g_app.setData(key, data);
		},
		getShareData(key, defaultValue) {
			return g_app.getData(key, defaultValue);
		},
		setData(key, data, replace=false) {
			data = _.cloneDeep(data);
			if (!replace && typeof(data) == "object") data = _.merge({}, this.getData(key), data);
			this.$store.commit("setData", {[key]:data});
		},
		on(eventName, callback) {
			events.$on(eventName, callback);
		},
		emit(eventName, ...args) {
			events.$emit(eventName, ...args);
		},
		push(path, data = {}) {
			g_app.storage.sessionStorageSetItem(path, _.cloneDeep(data));
			this.$router.push({path});
		},
		go(number) {
			this.$router.go(number);
		},
		setEditorMode(mode) {
			this.setData("__editor_mode__", mode);
		},
		setCurrentUrl(url) {
			this.setData("__currentUrl__", url);
		},
		setCurrentContent(content) {
			this.setData("__currentContent__", content || "");
		},
	},

	beforeMount() {
	},
}

