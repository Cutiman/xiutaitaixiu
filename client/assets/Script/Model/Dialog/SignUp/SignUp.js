
var BrowserUtil = require('BrowserUtil');

cc.Class({
	extends: cc.Component,

	properties: {
		username: {
			default: null,
			type: cc.EditBox,
		},
		password: {
			default: null,
			type: cc.EditBox,
		},
		repassword: {
			default: null,
			type: cc.EditBox,
		},
		captcha: {
			default: null,
			type: cc.EditBox,
		},
		capchaSprite: cc.Sprite,
	},
	onLoad () {
		var self = this;
		this.editboxs = [this.username, this.password, this.repassword, this.captcha];
		this.keyHandle = function(t) {
			return t.keyCode === cc.macro.KEY.tab ? (self.changeNextFocusEditBox(),
				t.preventDefault && t.preventDefault(),
				!1) : t.keyCode === cc.macro.KEY.enter ? (BrowserUtil.focusGame(), self.onSignUpClick(),
				t.preventDefault && t.preventDefault(),
				!1) : t.keyCode === cc.macro.KEY.escape ? (cc.RedT.inGame.dialog.onClickBack(),
				t.preventDefault && t.preventDefault(),
				!1) : void 0
		}
	},
	onEnable: function () {
		cc.sys.isBrowser && this.addEvent();
		this.node.runAction(cc.RedT.inGame.dialog.actionShow);
		this.reCaptcha();
	},
	onDisable: function () {
		cc.sys.isBrowser && this.removeEvent();
		this.clean();
		cc.RedT.inGame.dialog.resetSizeDialog(this.node);
	},
	addEvent: function() {
		cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
		for (var t in this.editboxs) {
			BrowserUtil.getHTMLElementByEditBox(this.editboxs[t]).addEventListener("keydown", this.keyHandle, !1)
		}
	},
	removeEvent: function() {
		for (var t in this.editboxs) {
			BrowserUtil.getHTMLElementByEditBox(this.editboxs[t]).removeEventListener("keydown", this.keyHandle, !1)
		}
		cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
	},
	onKeyDown: function (event) {
		switch(event.keyCode) {
			case cc.macro.KEY.escape:
				this.isTop() && cc.RedT.inGame.dialog.onClickBack();
				break;
			case cc.macro.KEY.tab:
				this.isTop() && this.changeNextFocusEditBox();
				break;
			case cc.macro.KEY.enter:
				this.isTop() && this.onSignUpClick();
		}
	},
	changeNextFocusEditBox: function() {
		for (var t = !1, e = 0, i = this.editboxs.length; e < i; e++){
            if (BrowserUtil.checkEditBoxFocus(this.editboxs[e])) {
                BrowserUtil.focusEditBox(this.editboxs[e]);
                t = !0;
                break
            }
        }
        !t && 0 < this.editboxs.length && BrowserUtil.focusEditBox(this.editboxs[0]);
	},
	isTop: function() {
		return !cc.RedT.inGame.notice.node.active && !cc.RedT.inGame.loading.active;
	},
	clean: function(){
		this.username.string = this.password.string = this.repassword.string = this.captcha.string = '';
	},
	onSignUpClick: function() {
		var error = null;

		if (this.username.string.length > 32 || this.username.string.length < 3)
			error = '????? d??i T??n t??i kho???n 3 - 32 k?? t???!!';
		else if (this.password.string.length > 32 || this.password.string.length < 6)
			error = '????? d??i m???t kh???u 6 - 32 k?? t???!!';
		else if (this.password.string !== this.repassword.string)
			error = 'X??c nh???n m???t kh???u kh??ng kh???p!';
		else if (this.captcha.string.length < 4)
		  error = 'Vui l??ng nh???p Captcha.';
		else if (this.username.string == this.password.string)
			error = 'T??i kho???n kh??ng ???????c tr??ng v???i m???t kh???u!!';
		else if (this.username.string.match(new RegExp("^[a-zA-Z0-9]+$")) === null)
			error = 'T??n ch??? g???m Ch??? v?? S???!';

		if (error) {
			cc.RedT.inGame.notice.show({title:"????NG K??", text:error});
			return;
		};
		cc.RedT.inGame.auth({authentication:{username: this.username.string, password: this.password.string, register: true, captcha: this.captcha.string}});
	},
	initCaptcha: function(t) {
		var i = this
		  , o = new Image;
		o.src = t,
		o.width = 150,
		o.height = 50,
		setTimeout(function() {
			var t = new cc.Texture2D;
			t.initWithElement(o),
			t.handleLoadedTexture();
			var e = new cc.SpriteFrame(t);
			i.capchaSprite.spriteFrame = e
		}, 10)
	},
	reCaptcha: function(){
		cc.RedT.send({captcha: 'signUp'});
	},
});
