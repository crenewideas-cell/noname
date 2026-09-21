import { lib, game, ui, get, ai, _status } from "noname";

export default {
    phone() {
        //获取浏览器navigator对象的userAgent属性（浏览器用于HTTP请求的用户代理头的值）
        var info = navigator.userAgent;
        //通过正则表达式的test方法判断是否包含“Mobile”字符串
        var isPhone = /mobile|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|OperaMini/i.test(info);
        //如果包含“Mobile”（是手机设备）则返回true
        return isPhone;
    },
    singleCard(obj, method) {
        if (typeof obj == "string") {
            obj = { name: obj };
        }
        if (typeof obj != "object") {
            return;
        }
        return get.type(obj, method ? "trick" : false) == "trick" && !get.info("xunshi").isXunshi(obj);
    },
};
