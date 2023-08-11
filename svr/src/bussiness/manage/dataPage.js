const daoDog = require("./../../dao/dog/dog")
const { inject_env_config } = require("../../../conf/env_config");
const cfg = inject_env_config(require("../../../conf/cfg.json"));
const dbOpen = cfg.db.open

/**
 * 获取数据传输页面
 * @param {*} data 
 * @returns 
 */
async function getDataPageHtml(data) {
    if (!dbOpen) {
        return 'db配置未开启';
    }
    let resData = await daoDog.getDogManageInfo({
        day: data.day,
    }, data.tables, data.dbClient)

    return `
    <style>
        .layui-layer{
            transition: all 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.28) 0s;
        }
        .layui-layer-page .layui-layer-content {
            background: #ededed;
        }
        .layuiadmin-span-color, .layuiadmin-big-font{
            font-weight: bold;
        }
        .layui-table{
            word-break: break-all;box-shadow: 10px 3px 15px 3px rgb(0 0 0 / 5%);
        }
        .room-recent-title{
            margin-left: 10px;margin-top: 10px;font-weight: bold;font-size: 17px;
        }
        .room-status-svg{
            width: 15px; height: 15px; top: 2px; position: relative;
        }
        .layui-layer .layui-layer-page .layui-layer-tab{
            box-sizing: content-box;
        }
        .layui-layer-tab .layui-layer-title span {
            min-width: unset;
            max-width: unset;
        }
        .layui-layer-tab .layui-layer-title {
            display: inline-flex;
            width: 100%;
            padding: 0;
        }
    </style>
    <link rel="stylesheet" href="static/layui/css/admin.css" media="all">
    <div class="layui-fluid" id="manageFile" v-cloak>
        <span style="position: absolute; top: 22px; font-size: 20px; color: cadetblue; font-weight: 900;  margin-left: 15px;"> 当前查询时间： </span>
        <input type="text" class="layui-input" value="${data.day}" id="dayFile" style="padding-right: 12px;text-align: right;margin-bottom: 10px; font-size: 20px; color: cadetblue; font-weight: 900;margin-bottom: 10px;" onclick="reRenderDateFile()">
        <div class="layui-row layui-col-space15" id="tl_console_data_tpl_view">
            <div class="layui-col-sm6 layui-col-md3">
                <div class="layui-card">
                    <div class="layui-card-header">
                    {{chooseDay}}文件传输 <span class="layui-badge layui-bg-blue layuiadmin-badge">天</span>
                    </div>
                    <div class="layui-card-body layuiadmin-card-list">
                        <p class="layuiadmin-big-font">{{transferFileToday}}次</p>
                        <p> 总计文件传输
                            <span class="layuiadmin-span-color">{{transferFileAll}}次
                                <i class="layui-inline layui-icon layui-icon-home"></i>
                            </span>
                        </p>
                    </div>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3">
                <div class="layui-card">
                    <div class="layui-card-header">
                        {{chooseDay}}文件传输大小
                        <span class="layui-badge layui-bg-cyan layuiadmin-badge">天</span>
                    </div>
                    <div class="layui-card-body layuiadmin-card-list">
                        <p class="layuiadmin-big-font">{{transferFileSizeTodady}}M</p>
                        <p>
                            总计文件传输大小
                            <span class="layuiadmin-span-color">暂不统计
                                <i class="layui-inline layui-icon layui-icon-user"></i></span>
                        </p>
                    </div>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3">
                <div class="layui-card">
                    <div class="layui-card-header">
                        {{chooseDay}}文本传输
                        <span class="layui-badge layui-bg-green layuiadmin-badge">天</span>
                    </div>
                    <div class="layui-card-body layuiadmin-card-list">
    
                        <p class="layuiadmin-big-font">{{transferTxtTodady}}次</p>
                        <p>
                            总计文本传输
                            <span class="layuiadmin-span-color"> {{transferTxtAll}}次
                                <i class="layui-inline layui-icon layui-icon-top" style="font-size: 25px;"></i></span>
                        </p>
                    </div>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3">
                <div class="layui-card">
                    <div class="layui-card-header">
                        {{chooseDay}}公共频道发言
                        <span class="layui-badge layui-bg-orange layuiadmin-badge">天</span>
                    </div>
                    <div class="layui-card-body layuiadmin-card-list">
    
                        <p class="layuiadmin-big-font">{{transferCommTxtToday}}次</p>
                        <p>
                            总计公共频道发言
                            <span class="layuiadmin-span-color">{{transferCommTxtAll}}次
                                <i class="layui-inline layui-icon layui-icon-top" style="font-size: 25px;"></i></span>
                        </p>
                    </div>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3">
                <div class="layui-card">
                    <div class="layui-card-header">
                        {{chooseDay}}暂存文件
                        <span class="layui-badge layui-bg-orange layuiadmin-badge">天</span>
                    </div>
                    <div class="layui-card-body layuiadmin-card-list">
    
                        <p class="layuiadmin-big-font">{{transferCodeFileToday}}次</p>
                        <p>
                            总计暂存文件
                            <span class="layuiadmin-span-color">{{transferCodeFileAll}}次
                                <i class="layui-inline layui-icon layui-icon-top" style="font-size: 25px;"></i></span>
                        </p>
                    </div>
                </div>
            </div>
    
            <div class="layui-col-sm12">
                <div class="layui-row layui-col-space15">
                    <div class="layui-col-sm12">
                        <div class="room-recent-title">{{chooseDay}}文件传输列表</div>
                        <table class="layui-table">
                            <thead> <tr> <th>房间频道</th> <th>文件名称</th> <th>文件大小</th> <th>发送时间</th> </tr> </thead>
                            <tbody>
                                <tr v-for="file in fileList">
                                    <td>{{file.room}}</td>
                                    <td><pre>{{file.name}}</pre></td>
                                    <td>{{file.size}}M</td>
                                    <td>{{file.createTime}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
    
            <div class="layui-col-sm12">
                <div class="layui-row layui-col-space15">
                    <div class="layui-col-sm12">
                        <div class="room-recent-title">{{chooseDay}}文本传输列表</div>
                        <table class="layui-table">
                            <thead> <tr> <th>房间频道</th> <th>文本内容</th> <th>文本长度</th> <th>发送时间</th> </tr> </thead>
                            <tbody>
                                <tr v-for="txt in txtList">
                                    <td>{{txt.room}}</td>
                                    <td><pre>{{txt.content}}</pre></td>
                                    <td>{{txt.size}}字符</td>
                                    <td>{{txt.createTime}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            <div class="layui-col-sm12">
                <div class="layui-row layui-col-space15">
                    <div class="layui-col-sm12">
                        <div class="room-recent-title">{{chooseDay}}公共频道发言</div>
                        <table class="layui-table">
                            <thead> <tr> <th>房间频道</th> <th>文本内容</th> <th>文本长度</th> <th>发送时间</th> </tr> </thead>
                            <tbody>
                                <tr v-for="txt in commTxtList">
                                    <td>{{txt.room}}</td>
                                    <td><pre>{{txt.content}}</pre></td>
                                    <td>{{txt.size}}字符</td>
                                    <td>{{txt.createTime}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div class="layui-col-sm12">
                <div class="layui-row layui-col-space15">
                    <div class="layui-col-sm12">
                        <div class="room-recent-title">{{chooseDay}}文件暂存列表</div>
                        <table class="layui-table">
                            <thead> <tr> <th>房间频道</th> <th>文件名称</th> <th>取件码</th> <th>暂存时间</th> </tr> </thead>
                            <tbody>
                                <tr v-for="file in codeFileList">
                                    <td>{{file.room}}</td>
                                    <td><pre>{{file.name}} - {{file.type}} - {{file.size}}</pre></td>
                                    <td>{{file.code}}</td>
                                    <td>{{file.createTime}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
    
        </div>
    </div>
    
    <script>
        window.reRenderDateFile = function(){
            layui.laydate.render({
                elem: '#dayFile',
                closeStop: '#dayFile',
                trigger: 'click',
                max : '${new Date()}',
                done: function(value, date, endDate){
                    if(value){
                        window.manageReload({
                            time : value
                        })
                    }
                }
            });
        }
        
        layui.use(['laydate'], function () {
            window.reRenderDateFile()
        });
    
        new Vue({
            el: '#manageFile',
            data: function () {
                return ${JSON.stringify(resData)}
            },
            methods: {
                sortList : function(list, fields){
                    return list.sort(function(a, b){return a[fields].localeCompare(b[fields],'zh-CN')})
                }
            },
            mounted: function () {
            }
        })
    </script>
    `
}


module.exports = {
    getDataPageHtml,
}
