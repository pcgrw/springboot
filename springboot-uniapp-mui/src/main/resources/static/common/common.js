/* 封装自定义弹窗 */
var HuanziDialog = {
    mask: null,//mui遮阴层对象
    showSpeed: 700,//弹出速度
    hideSpeed: 500,//隐藏速度
    removeFlag: true,//close内部是否执行操作
    /**
     * 隐藏弹窗，内部方法
     * @param select jq元素选择器，#xxx、.xxx等，如果为空，则隐藏所有
     * @param callback 回调方法
     * @param speed 速度
     */
    hideFun: function (select, callback, speed) {
        let $huanziDialog = select ? $(select) : $(".huanzi-dialog");
        speed = speed ? speed : HuanziDialog.hideSpeed;

        //上右下左，居中
        $huanziDialog.each(function () {
            let dialog = $(this);
            let clazz = dialog.attr("class");
            if (clazz.indexOf("huanzi-dialog-top") > -1) {
                dialog.animate({top: '-100%'}, speed);
            } else if (clazz.indexOf("huanzi-dialog-right") > -1) {
                dialog.animate({right: '-85%'}, speed);
            } else if (clazz.indexOf("huanzi-dialog-bottom") > -1) {
                dialog.animate({bottom: '-100%'}, speed);
            } else if (clazz.indexOf("huanzi-dialog-left") > -1) {
                dialog.animate({left: '-85%'}, speed);
            } else if (clazz.indexOf("huanzi-dialog-center") > -1) {
                dialog.animate({opacity: 0}, speed);
            }
            setTimeout(function () {
                dialog.css("z-index", "-1");
            }, speed)
        });

        callback && callback();
    },

    /**
     * 显示弹窗，内部方法
     * @param select jq元素选择器，#xxx、.xxx等，如果为空，则显示所有
     * @param callback 回调方法
     * @param speed 速度
     */
    showFun: function (select, callback, speed) {
        let $huanziDialog = select ? $(select) : $(".huanzi-dialog");
        speed = speed ? speed : HuanziDialog.hideSpeed;

        //上右下左，居中
        $huanziDialog.each(function () {
            let dialog = $(this);
            dialog.css("z-index", "999");

            let clazz = dialog.attr("class");
            if (clazz.indexOf("huanzi-dialog-top") > -1) {
                dialog.animate({top: '0%'}, speed);
            } else if (clazz.indexOf("huanzi-dialog-right") > -1) {
                dialog.animate({right: '0%'}, speed);
            } else if (clazz.indexOf("huanzi-dialog-bottom") > -1) {
                dialog.animate({bottom: '0%'}, speed);
            } else if (clazz.indexOf("huanzi-dialog-left") > -1) {
                dialog.animate({left: '0%'}, speed);
            } else if (clazz.indexOf("huanzi-dialog-center") > -1) {
                dialog.animate({opacity: 1}, speed);
            }
        });
        HuanziDialog.removeFlag = true;
        callback && callback();
    },

    /**
     * 初始化mui遮阴层对象
     */
    init: function () {
        HuanziDialog.mask = mui.createMask();

        /**
         * 重写close方法
         */
        HuanziDialog.mask.close = function () {
            if (!HuanziDialog.removeFlag) {
                return;
            }
            //方法直接在这里执行
            HuanziDialog.hideFun();
            //调用删除
            HuanziDialog.mask._remove();
        };
    },

    /**
     * 显示弹窗，供外部调用（参数同内部方法一致）
     */
    show: function (select, callback, speed) {
        HuanziDialog.showFun(select, callback, speed);
        HuanziDialog.mask.show();//显示遮罩
    },

    /**
     * 隐藏弹窗，供外部调用（参数同内部方法一致）
     */
    hide: function (select, callback, speed) {
        HuanziDialog.hideFun(select, callback, speed);
        HuanziDialog.mask.close();//关闭遮罩
    },

    /**
     * 警告框
     * @param title 标题
     * @param message 内容
     * @param callback 点击确认的回调
     */
    alert: function (title, message, callback) {
        let $html = $("<div class=\"mui-popup mui-popup-in\" style=\"display: block;\">" +
            "<div class=\"mui-popup-inner\">" +
            "   <div class=\"mui-popup-title\">" + title + "</div>" +
            "   <div class=\"mui-popup-text\">" + message + "</div>" +
            "</div>" +
            "<div class=\"mui-popup-buttons\">" +
            "<span class=\"mui-popup-button mui-popup-button-bold confirm-but\">确定</span>" +
            "</div>" +
            "</div>");
        $html.find(".confirm-but").click(function () {
            HuanziDialog.removeFlag = true;
            HuanziDialog.mask.close();
            $html.remove();
            callback && callback();
        });
        HuanziDialog.mask.show();//显示遮罩
        HuanziDialog.removeFlag = false;
        $("body").append($html);
    },

    /**
     * 确认消息框
     * @param title 标题
     * @param message 内容
     * @param callback 点击确认的回调
     */
    confirm: function (title, message, callback) {
        let $html = $("<div class=\"mui-popup mui-popup-in\" style=\"display: block;\">" +
            "<div class=\"mui-popup-inner\">" +
            "   <div class=\"mui-popup-title\">" + title + "</div>" +
            "   <div class=\"mui-popup-text\">" + message + "</div>" +
            "</div>" +
            "<div class=\"mui-popup-buttons\">" +
            "<span class=\"mui-popup-button mui-popup-button-bold cancel-but\" style='color: #585858;'>取消</span>" +
            "<span class=\"mui-popup-button mui-popup-button-bold confirm-but\">确定</span>" +
            "</div>" +
            "</div>");
        $html.find(".cancel-but").click(function () {
            HuanziDialog.removeFlag = true;
            HuanziDialog.mask.close();
            $html.remove();
        });
        $html.find(".confirm-but").click(function () {
            $html.find(".cancel-but").click();
            callback && callback();
        });

        HuanziDialog.mask.show();//显示遮罩
        HuanziDialog.removeFlag = false;
        $("body").append($html);
    },

    /**
     * 自动消失提示弹窗
     * @param message 内容
     * @param speed 存在时间
     */
    toast: function (message, speed) {
        speed = speed ? speed : 2000;
        let $html = $("<div class=\"huanzi-dialog huanzi-dialog-center\" style=\"width: 45%;height: 20%;opacity: 1;z-index: 999;background-color: #5a5a5ad1;\">" +
            "    <p style=\" position: relative; top: 50%; left: 50%; transform: translate3d(-50%, -50%, 0) scale(1); color: #e0e0e0; font-size: 20px; \">" + message + "</p>" +
            "</div>");
        $("body").append($html);
        setTimeout(function () {
            $html.remove();
        }, speed);
    }
};

//先初始化自定义弹窗
HuanziDialog.init();

//底部按钮点击切换颜色
$(document).on("click",".huanzi-footer-buttom", function (e) {
    $(".huanzi-footer-buttom").each(function () {
        $(this).removeClass("select");
    });
    $(this).addClass("select");
});