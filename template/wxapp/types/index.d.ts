/// <reference types="weixin-app" />
declare namespace wx {
    interface App {
        // 全局变量
        globalData: {
            // 基础配置-不要修改
            setting: Record<any, any>;
            // 用户信息-不要修改
            user: {
                // 微信 js code
                weixin_code: string,
                // 后台自定义登录态 关联用户唯一标识openid和会话密钥session_key
                weixin_token: string,
                // 微信小程序用户唯一标识
                open_id: string,
                // 乐居用户体系登录态
                ucenter_token: string,
                // 微信用户信息
                weixin: Record<any, any>,
                // 乐居用户信息
                ucenter: Record<any, any>,
                // 电话信息
                phone: Record<any, any>
            },
            // 定位|选择城市-不要修改
            city: Record<any, any>,
            // 业务数据
            info: {
                // 授权页标记（只作为记录用）
                messageLock: boolean,
                // 场景值
                scene: string | number,
                // 已准备好更新
                onUpdateReady: boolean,
                // 记录授权once参数
                authOnce: Set<any>,
                // 新增其它数据...
                // defaultCity: { lat: "39.921849", lng: "116.396713", city_en: "bj", city_cn: "北京" },
            },
            // ext.json自定义字段-不要修改
            ext: Record<any, any>,
            // 接口列表-app.config.urls.js
            urls: Record<any, any>
        };
        /**
         * 版本
         */
        version: string;
        /**
         * 框架版本
         */
        BASE_VERSION: string;
        /**
         * 获取ext.json，同步
         */
        getExtSync(): Promise<void>;
        /**
         * 获取后台配置
         */
        getSetting(params: Record<any, any>): Promise<void>;
        /**
         * 自动在page.onLoad执行setBasic
         */
        setBasic(): Promise<void>;
        /**
         * 自动在page.onLoad执行setTabBar,bool 或 todo:Array<string>
         * 获取基础页面的配置(getSetting)之后会默认执行一次 setBasic则不会执行
         */
        setTabBar(): Promise<void>;

        getCity(params: Record<any, any>): Promise<void>;
        getCityInfo(options: Record<any, any>): Promise<void>;

        weixinLogin(params: Record<any, any>): Promise<void>;
        checkWeixinToken(options: Record<any, any>): Promise<void>;
        getWeixinToken(params: Record<any, any>): Promise<void>;
        weixinTokenMain(params: Record<any, any>): Promise<void>;

        weixinUserMain(params: Record<any, any>): Promise<void>;
        getWeixinUser(params: Record<any, any>): Promise<void>;
        weixinPhoneMain(params: Record<any, any>): Promise<void>;
        getWeixinPhone(params: Record<any, any>): Promise<void>;

        clearWeixin(scope?: string | string[]): boolean;
        clearUcenter(): boolean;

        ucenterLogin(params: Record<any, any>): Promise<void>;
        ucenterTimeout(params: Record<any, any>): Promise<void>;

        check(params: Record<any, any>): Record<any, any>;
        checkApply(params: Record<any, any>): void;
        checkAuth(params: Record<any, any>): void;

        getAuthOnce(url: string, type: string): boolean;
        setAuthOnce(url: string, type: string): void;
        deleteAuthOnce(url: string, type: string): void;
    }

    interface Page {
        /**
         * 授权标记
         */
        AUTH_STATUS: string;
        getAuthOnce(type: string): boolean;
        setAuthOnce(type: string): void;
        deleteAuthOnce(type: string): void;
        /**
         * 同时在key下再设置一个同样的值，防止原型丢失，一般用于给setData赋值类实例
         */
        setDataExt(options: Record<any, any>, key?: string): void;
        sendMsgChance(e: Record<any, any>): void;
    }
}
