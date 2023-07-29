const daoRoom = require("./../../dao/room/room")
const cfg = require("../../../conf/cfg.json");
const dbOpen = cfg.db.open

/**
 * 获取设置房间页面
 * @param {*} data 
 * @returns 
 */
async function getSettingPageHtml(data) {
    if (!dbOpen) {
        return 'db配置未开启';
    }
    let resData = await daoRoom.getOrCreateManageRoom({
        socket_id: data.socketId,
        ip: data.ip,
        device: data.userAgent,
    }, data.tables, data.dbClient)

    return `
    <style>
        .layui-layer{
            transition: all 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.28) 0s;
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
        .layui-form-item {
            margin-top: 15px;
        }
        .switch-form .layui-input-block {
            margin-left: 15px;
        }
        @media screen and (min-width: 445px){
            .info-form .layui-form-item:first-child .layui-input-block {
                display: inline-flex;
                margin-left: 15px;
            }
        }
    </style>
    <div class="layui-fluid">
        <div class="layui-row layui-col-space15" id="tl_console_setting_tpl_view">
            <div class="layui-col-sm12">
                <div class="layui-row layui-col-space15">
                    <div class="layui-col-sm12">
                        <div class="room-recent-title">数据传输功能开关设置</div>
                        <form class="layui-form switch-form" style="display: inline-flex; flex-wrap: wrap;" lay-filter="switch-form">
                            <div class="layui-form-item">
                                <div class="layui-input-block">
                                    <input type="checkbox" name="openSendBug" title="开启意见反馈" lay-skin="primary">
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <div class="layui-input-block">
                                    <input type="checkbox" name="openScreen" title="开启网页录屏" lay-skin="primary">
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <div class="layui-input-block">
                                    <input type="checkbox" name="openScreenShare" title="开启屏幕共享" lay-skin="primary">
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <div class="layui-input-block">
                                    <input type="checkbox" name="openVideoShare" title="开启音视频通话" lay-skin="primary">
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <div class="layui-input-block">
                                    <input type="checkbox" name="openLiveShare" title="开启直播功能" lay-skin="primary">
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <div class="layui-input-block">
                                    <input type="checkbox" name="openRemoteDraw" title="开启远程画笔" lay-skin="primary">
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <div class="layui-input-block">
                                    <input type="checkbox" name="openPasswordRoom" title="开启密码房间" lay-skin="primary">
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <div class="layui-input-block">
                                    <input type="checkbox" name="openOnlineUser" title="开启在线人数显示" lay-skin="primary">
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <div class="layui-input-block">
                                    <input type="checkbox" name="openShareRoom" title="开启房间链接分享" lay-skin="primary">
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <div class="layui-input-block">
                                    <input type="checkbox" name="openFileTransfer" title="开启文件传输" lay-skin="primary" checked disabled>
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <div class="layui-input-block">
                                    <input type="checkbox" name="openTxtTransfer" title="开启文本传输" lay-skin="primary" checked disabled>
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <div class="layui-input-block">
                                    <input type="checkbox" name="openTurnServer" title="开启中继设置" lay-skin="primary">
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <div class="layui-input-block">
                                    <input type="checkbox" name="openCommRoom" title="开启公共频道发言" lay-skin="primary">
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <div class="layui-input-block">
                                    <input type="checkbox" name="openGetCodeFile" title="开启取件码取件" lay-skin="primary">
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <div class="layui-input-block">
                                    <input type="checkbox" name="openAiChat" title="开启AI对话聊天" lay-skin="primary">
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <div class="layui-input-block">
                                    <input type="checkbox" name="openNotice" title="开启网站公告" lay-skin="primary">
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <div class="layui-input-block">
                                    <input type="checkbox" name="openRefleshRoom" title="开启随机刷新房间号" lay-skin="primary">
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <div class="layui-input-block">
                                    <input type="checkbox" name="openNetworkIcon" title="展示网络状态图标" lay-skin="primary">
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <div class="layui-input-block">
                                    <input type="checkbox" name="openUseTurnIcon" title="展示中继服务器图标" lay-skin="primary">
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
    
            <div class="layui-col-sm12">
                <div class="layui-row layui-col-space15">
                    <div class="layui-col-sm12">
                        <div class="room-recent-title">数据传输房间号格式设置</div>
                        <form class="layui-form info-form" lay-filter="info-form">
                            <div class="layui-form-item">
                                <div class="layui-block">
                                    <div class="layui-input-block">
                                        <input type="checkbox" name="allowNumber" title="允许数字格式" lay-skin="primary">
                                    </div>
                                    <div class="layui-input-block">
                                        <input type="checkbox" name="allowChinese" title="允许中文格式" lay-skin="primary">
                                    </div>
                                    <div class="layui-input-block">
                                        <input type="checkbox" name="allowSymbol" title="允许特殊字符格式" lay-skin="primary">
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
    
            <div class="layui-col-sm12">
                <div class="layui-row layui-col-space15">
                    <div class="layui-col-sm12">
                        <div class="room-recent-title">其他设置</div>
                        <form class="layui-form notice-form" lay-filter="notice-form"> 
                            <div class="layui-form-item" style="margin-top: 30px;">
                                <div class="layui-block">
                                    <div class="layui-input-block" style="margin-left: 0;">
                                        <div style="padding: 5px;">数据传输公告设置: </div>
                                        <textarea name="noticeMsg" placeholder="发布公告内容" class="layui-textarea" style="height: 200px;border-radius: 8px;"></textarea>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-form-item" style="margin-top: 30px;">
                                <div class="layui-block">
                                    <div class="layui-input-block" style="margin-left: 0;">
                                        <div style="padding: 5px;">公共聊天记录数量: </div>
                                        <input type="number" name="chatingCommCount" class="layui-input">
                                    </div>
                                </div>
                            </div>
                            <button style="margin-top: 10px;" type="button" lay-submit lay-filter="notice" class="layui-btn">更新其他设置</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <script>
        layui.use(['form'], function () {
            window.$ = layui.$;
            window.form = layui.form;
    
            let switchData = ${resData.content}
    
            form.val("switch-form",switchData)
            form.val("info-form",switchData)

            let noticeMsg = ""
            if(switchData.noticeMsgList && switchData.noticeMsgList.length > 0){
                noticeMsg = switchData.noticeMsgList[0].msg
            }
            form.val("notice-form",{
                noticeMsg : noticeMsg,
                chatingCommCount : switchData.chatingCommCount
            })
    
            form.on('checkbox()', function(data){
                if(switchData[data.elem.name] !== undefined || switchData[data.elem.name] !== null){
                    switchData[data.elem.name] = data.elem.checked
                }
                window.manageChange({
                    id : ${resData.id},
                    content : switchData
                })
            }); 

            form.on('submit()', function(data){
                switchData.noticeMsgList = [{
                    msg : data.field.noticeMsg
                }]
                switchData.chatingCommCount = parseInt(data.field.chatingCommCount)
                window.manageChange({
                    id : ${resData.id},
                    content : switchData
                })
            });
        });
    </script>
    `
}


module.exports = {
    getSettingPageHtml
}
