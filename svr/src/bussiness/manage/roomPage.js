const daoRoom = require("./../../dao/room/room")
const {inject_env_config} = require("../../../conf/env_config")
const cfg = inject_env_config(require("../../../conf/cfg.json"));
const dbOpen = cfg.db.open

/**
 * 获取房间页面
 * @param {*} data 
 * @returns 
 */
async function getRoomPageHtml(data) {
    if (!dbOpen) {
        return 'db配置未开启';
    }
    let resData = await daoRoom.getRoomHistoryInfo({
        day: data.day,
    }, data.tables, data.dbClient, data.sockets)

    return `
    <style>
        .layui-layer{
            box-sizing: content-box;
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
    <div class="layui-fluid" id="manageRoom" v-cloak>
        <span style="position: absolute; top: 22px; font-size: 20px; color: cadetblue; font-weight: 900;  margin-left: 15px;"> 当前查询时间： </span>
        <input type="text" value="${data.day}" class="layui-input" id="dayRoom" style="padding-right: 12px;text-align: right;margin-bottom: 10px; font-size: 20px; color: cadetblue; font-weight: 900;margin-bottom: 10px;" onclick="reRenderDateRoom()">
        <div class="layui-row layui-col-space15" id="tl_console_home_tpl_view">
            <div class="layui-col-sm6 layui-col-md3">
                <div class="layui-card">
                    <div class="layui-card-header">
                    {{chooseDay}}房间频道创建/加入 <span class="layui-badge layui-bg-blue layuiadmin-badge">天</span>
                    </div>
                    <div class="layui-card-body layuiadmin-card-list">
                        <p class="layuiadmin-big-font">{{createRoomToday}}个</p>
                        <p> 总计房间频道创建/加入
                            <span class="layuiadmin-span-color">{{createRoomAll}}个
                                <i class="layui-inline layui-icon layui-icon-home"></i>
                            </span>
                        </p>
                    </div>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3">
                <div class="layui-card">
                    <div class="layui-card-header">
                        {{chooseDay}}加入房间人数
                        <span class="layui-badge layui-bg-cyan layuiadmin-badge">天</span>
                    </div>
                    <div class="layui-card-body layuiadmin-card-list">
                        <p class="layuiadmin-big-font">{{joinRoomTodady}}人</p>
                        <p>
                            总计加入房间人数
                            <span class="layuiadmin-span-color">{{joinRoomAll}}人
                                <i class="layui-inline layui-icon layui-icon-user"></i></span>
                        </p>
                    </div>
                </div>
            </div>
            <div class="layui-col-sm12">
                <div class="layui-row layui-col-space15">
                    <div class="layui-col-sm12">
                        <div class="room-recent-title">在线房间列表</div>
                        <table class="layui-table">
                            <thead> <tr> <th>房间频道</th> <th>在线状态</th> <th>房间人数</th> <th>创建时间</th> </tr> </thead>
                            <tbody>
                                <tr v-for="r in onlineRoomList">
                                    <td style="font-weight: bold;">{{r.room}}</td>
                                    <td style="font-weight: bold;">
                                        <svg class="room-status-svg" viewBox="0 0 1024 1024" p-id="4241" width="128" height="128">
                                            <path d="M512 277.333333a234.666667 234.666667 0 1 0 0 469.333334 234.666667 234.666667 0 0 0 0-469.333334z" p-id="4242" fill="#1afa29"></path>
                                        </svg>
                                        {{r.status}}
                                    </td>
                                    <td style="font-weight: bold;">{{r.userNumber}}</td>
                                    <td>{{r.createTime}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="layui-col-sm12">
                <div class="layui-row layui-col-space15">
                    <div class="layui-col-sm12">
                        <div class="room-recent-title">{{chooseDay}}房间统计</div>
                        <table class="layui-table">
                            <thead> <tr> <th>房间频道</th> <th>聚合创建次数</th> <th>最近创建时间</th> </tr> </thead>
                            <tbody>
                                <tr v-for="r in todayRoomList">
                                    <td style="font-weight: bold;">{{r.room}}</td>
                                    <td style="font-weight: bold;">{{r.count}}</td>
                                    <td>{{r.createTime}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            <div class="layui-col-sm12">
                <div class="layui-row layui-col-space15">
                    <div class="layui-col-sm12">
                        <div class="room-recent-title">{{chooseDay}}访问设备/IP</div>
                        <table class="layui-table">
                            <thead> <tr> <th>房间频道</th> <th>IP地址</th> <th>设备信息</th> <th>时间</th> </tr> </thead>
                            <tbody>
                                <tr v-for="userAgentIp in userAgentIpList">
                                    <td style="font-weight: bold;">{{userAgentIp.room}}</td>
                                    <td >{{userAgentIp.Ip}}</td>
                                    <td>{{userAgentIp.userAgent}}</td>
                                    <td>{{userAgentIp.createTime}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
    
        </div>
    </div>
    
    <script>
        window.reRenderDateRoom = function(){
            layui.laydate.render({
                elem: '#dayRoom',
                closeStop: '#dayRoom',
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
            window.reRenderDateRoom()
        });

        new Vue({
            el: '#manageRoom',
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
    getRoomPageHtml
}

