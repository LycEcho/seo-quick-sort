layui.define(['jquery', 'layer', 'laytpl', 'element'], function (exports) {

    var $ = layui.$;
    var laytpl = layui.laytpl;
    var layer = layui.layer;
    var element = layui.element;

    var obj = {

        showNumber: (num) => {
            let result = '';
            if (num > 100000000) {
                result = (num / 10000000).toFixed(2) + '亿';
            } else if (num > 100000) {
                result = (num / 10000).toFixed(2) + '万';
            } else {
                result = num;
            }

            return result;
        }
        , randomString: function (len) {
            len = len || 32;
            var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
            /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
            var maxPos = $chars.length;
            var pwd = '';
            for (i = 0; i < len; i++) {
                pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
            }
            return pwd;
        }
        , getQueryString: function (name) {
            var reg = new RegExp(name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);

            if (r != null) return unescape(r[1]);
            return null;
        }
        , getData: function (urlA, data, sussess, construct = '') {
            if (typeof construct == "function") {
                construct()
            }
            data = this.formatParam(data)
            return $.ajax({
                url: urlA,
                data: data,
                headers: {'token': this.getStore('token')},
                dataType: "json",
                success: function (res) {
                    if (sussess !== false) {
                        if (typeof sussess == "function") {
                            return sussess(res)
                        }
                        var msg = res.code !== 1 ? '失败' : '成功';
                        layer.msg(res.msg ? res.msg : "操作" + msg, {time: 1000, icon: res.code - 1 + 1});
                    }
                }
            })

        }

        , formatParam: function (obj) {

            var numbers = ['num_count', 'num_count_add', 'limit_day', 'num_day', 'status', 'type', 'num_day_add', 'push_cron', 'platform', 'push_end_time_minute', 'push_end_time_hour', 'push_start_time_minute', 'push_start_time_hour', 'push_num_day', 'sync', 'site[add_time_type]', 'language', 'version', 'curren', 'model', 'relation', 'interval_time']

            numbers.map(v => {
                if (typeof obj[v] != "undefined") {
                    obj[v] = Number(obj[v])
                }
            })
            return obj

        }
        ,
        putData: function (e, i = 1, Name, listName, sussess, construct = '', async = true, headers = {}) {
            if (typeof construct == "function") {
                construct()
            }
            var obj = e?.field ?? e

            obj = this.formatParam(obj)


            let types = obj.id || (obj.order_id && !obj.id && obj.id !== false) || (obj.uid && !obj.id) ? "PUT" : "POST"

            let Return = "操作"//obj.id ? "修改"  :"新增"
            $.ajax({
                url: Name,
                dataType: 'json',
                type: "POST",
                headers: Object.assign({'Accept': 'application/json', 'token': this.getStore('token')}, headers),
                data: JSON.stringify(obj),
                async: async,
                success: function (res) {

                    if (typeof sussess == "function") {
                        return sussess(res)
                    }

                    if (res.code == 1) {
                        layer.close(layer.index); //执行关闭
                        layer.alert(Return + '成功！', {time: 300, icon: res.code})

                        if (listName !== false) {
                            var ln = listName ? listName : Name
                            layui.table.reload(ln + "Lists")
                        }
                    } else {
                        layer.alert(res.msg, {time: 1000, icon: 2})
                    }

                }
            })
        }
        , putDataAi: function (e, i = 1, Name, listName, sussess, construct = '', async = true, headers = {}) {
            if (typeof construct == "function") {
                construct()
            }
            var obj = e?.field ?? e

            obj = this.formatParam(obj)


            let types = obj.id || (obj.order_id && !obj.id && obj.id !== false) || (obj.uid && !obj.id) ? "PUT" : "POST"

            let Return = "操作"//obj.id ? "修改"  :"新增"
            $.ajax({
                url: Name,
                dataType: 'json',
                type: "POST",
                headers: Object.assign({'token': this.getStore('tokenAi')}, headers),
                data: obj,
                async: async,
                success: function (res) {

                    if (typeof sussess == "function") {
                        return sussess(res)
                    }

                    if (res.code == 1) {
                        layer.close(layer.index); //执行关闭
                        layer.alert(Return + '成功！', {time: 300, icon: res.code})

                        if (listName !== false) {
                            var ln = listName ? listName : Name
                            layui.table.reload(ln + "Lists")
                        }
                    } else {
                        layer.alert(res.msg, {time: 1000, icon: 2})
                    }

                }
            })
        }
        ,
        //请求路径/请求数据/模板对象/模板渲染数据/渲染对象/成功回调/调用前置函数
        renderDate: function (url, getData, tplHtml, tplData, objDiv, sussess = "", construct = '') {
            if (typeof construct == "function") {
                construct()
            }
            $.ajax({
                type: 'GET',
                url: url,
                data: getData,
                headers: {'token': this.getStore('token')},
                dataType: "json",
                success: function (res) {
                    if (typeof sussess == "function") {
                        return sussess(res)
                    }
                    data = Object.assign(res.data, tplData);
                    laytpl(tplHtml).render(data, function (html) {
                        $(objDiv).html(html);
                    })

                }
            })

        }
        ,
        //渲染模板
        render: function (tplHtml, data, divObj) {
            var tplHtml = tplHtml.innerHTML
            laytpl(tplHtml).render(data, function (html) {
                divObj.html(html)
            })
        }
        ,

        //渲染数据 弹窗
        renderDiy: function (tplHtml, data, openObj) {
            var telHtml = tplHtml.innerHTML
            laytpl(telHtml).render(data, function (html) {
                openObj.content = html;
                return layer.open(openObj)
            })
        }
        //拿数据渲染弹窗
        ,
        openRender: function (url, urlData, tplHtml, openObj, openData = {}) {

            var index = layer.load(3)
            var that = this
            if (url === false) {
                return $.renderDiy(tplHtml, openData, openObj)
            }
            $.ajax({
                url: url,
                dataType: 'json',
                data: urlData,
                headers: {'token': this.getStore('token')},
                type: "GET",
                success: function (res) {
                    layer.close(index)
                    if (res.code !== 1) {
                        layer.alert(res.msg, function () {
                            layer.close(layer.index);
                        });
                    } else {
                        var data = {}
                        if (res.data) {
                            data = Object.assign(res.data, openData)
                        } else {
                            data = openData
                        }

                        that?.renderDiy(tplHtml, data, openObj)
                    }
                }, error: function () {
                    layer.close(index)
                }
            })

        }
        ,
        formatDate: function (sj, hms = false, hmsdiv = false, $splicing = '-', $b0 = false) {
            //sj,hms=是否显示秒,hmsdiv 是否回车,$splicing 拼接符号 ,$b0 补 0
            if (sj) {
                var now = new Date(sj * 1000);
                var year = now.getFullYear();
                var month = now.getMonth() + 1;
                var date = now.getDate();

                if ($b0) {
                    month = String(now.getMonth() + 1).padStart(2, 0);
                    date = String(now.getDate()).padStart(2, 0);
                }

                var hour = now.getHours();
                var minute = now.getMinutes();
                var second = now.getSeconds();
                return year + $splicing + month + $splicing + date + (hmsdiv ? '<br>' : ' ') + (hms ? (hour + ":" + minute + ":" + second) : '')
            }
            return "";
        }
        ,
        setStore: (key, value) => {
            let data = JSON.stringify(value);
            return localStorage.setItem('lycecho' + key, data);
        }, getStore: (key) => {
            let data = localStorage.getItem('lycecho' + key);

            if (data !== '' && data != 'undefined') {
                return JSON?.parse(data);
            }
            return null;
        }
        , removeStore(key) {
            return localStorage.removeItem('lycecho' + key)
        }
        ,
        formatData: (data) => {
            if (data.log !== undefined) data.log = Number(data.log)
            if (data.twoTyle !== undefined) data.twoTyle = Number(data.twoTyle)
            if (data.h2 !== undefined) data.h2 = Number(data.h2)
            if (data.order !== undefined) data.order = Number(data.order)
            if (data.image !== undefined) data.image = Number(data.image)
            if (data.tag !== undefined) data.tag = Number(data.tag)
            if (data.abstract !== undefined) data.abstract = Number(data.abstract)
            if (data.originalV !== undefined) data.originalV = Number(data.originalV)
            if (data.quantity !== undefined) data.quantity = Number(data.quantity)
            if (data.good_id !== undefined) data.good_id = Number(data.good_id)
            if (data.amount !== undefined) data.amount = Number(data.amount)
            if (data.currency !== undefined) data.currency = Number(data.currency)
            if (data['ip_pool[currency]'] !== undefined) data['ip_pool[currency]'] = Number(data['ip_pool[currency]'])
            if (data['quick_task[end_time]'] !== undefined) data['quick_task[end_time]'] = Number(data['quick_task[end_time]'])
            return data
        }
        , parseFormToObject: (formField) => {
            const result = {};
            for (const key in formField) {
                if (formField.hasOwnProperty(key)) {
                    const keys = key.split("[");
                    let currentObj = result;
                    for (let i = 0; i < keys.length; i++) {
                        const currentKey = keys[i].replace("]", "");

                        if (!currentObj[currentKey]) {
                            if (i === keys.length - 1) {
                                currentObj[currentKey] = formField[key];
                            } else {
                                currentObj[currentKey] = {};
                            }
                        }

                        if (i < keys.length - 1) {
                            currentObj = currentObj[currentKey];
                        }
                    }
                }
            }
            return result;
        }
        , load: (time = 100, txt = '') => {
            var t = 1, fun;

            layer.open({
                type: 1,
                title: ''
                , area: ['300px', '55px']
                , content: `<div class="padding10">  
                                    <div class="textAlignCenter marginBottom10">${txt}</div>
                                    <div class="layui-progress" lay-filter="progress" lay-showPercent="yes">
                                <div class="layui-progress-bar" lay-percent="0%"></div>          
                            </div></div>`
                , closeBtn: 0
                , success: function (layero, index) {
                    fun = setInterval(function () {
                        element.progress('progress', t + '%');
                        if (t >= 95) {
                            clearInterval(fun);
                        } else {
                            t++;
                        }
                    }, time)
                },
                end: function () {
                    element.progress('progress', '0%');
                    clearInterval(fun);
                }
            });
        }
    }

    exports('common', obj);
})