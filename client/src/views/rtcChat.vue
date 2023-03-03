<template>
    <div class="flex flex-direction" style="height:100vh;">
        <div class="cu-bar bg-white solid-bottom flex">
            <div class="basis-xs flex">
                <div class="padding-lr flex justify-center align-center text-xl">
                    <span class="cuIcon-back"></span>
                </div>
            </div>
            <div class="basis-lg flex align-center justify-center">聊天室</div>
            <div class="basis-xs flex justify-end">
                <div class="padding-lr flex justify-center align-center text-xl">
                    <span class="cuIcon-friend"></span>
                </div>
            </div>
        </div>
        <div class="cu-chat bg-gray flex-sub" style="overflow-y: auto;">
            <div class="cu-item self">
                <div class="main">
                    <div class="content bg-green shadow">
                        <span>喵喵喵！喵喵喵！喵喵喵！喵喵！喵喵！！喵！喵喵喵！</span>
                    </div>
                </div>
                <div class="cu-avatar radius"
                    style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big107000.jpg);"></div>
                <div class="date">2018年3月23日 13:23</div>
            </div>
            <div class="cu-info round">对方撤回一条消息!</div>
            <div class="cu-item">
                <div class="cu-avatar radius"
                    style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big143004.jpg);"></div>
                <div class="main">
                    <div class="content shadow">
                        <span>喵喵喵！喵喵喵！</span>
                    </div>
                </div>
                <div class="date "> 13:23</div>
            </div>
            <div class="cu-info">
                <span class="cuIcon-roundclosefill span-red "></span> 对方拒绝了你的消息
            </div>
            <div class="cu-info">
                对方开启了好友验证，你还不是他(她)的好友。请先发送好友验证请求，对方验证通过后，才能聊天。
                <span class="span-blue">发送好友验证</span>
            </div>
            <div class="cu-item self">
                <div class="main">
                    <image src="https://ossweb-img.qq.com/images/lol/web201310/skin/big10006.jpg" class="radius"
                        mode="widthFix"></image>
                </div>
                <div class="cu-avatar radius"
                    style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big107000.jpg);"></div>
                <div class="date"> 13:23</div>
            </div>
            <div class="cu-item self">
                <div class="main">
                    <div class="action span-bold span-grey">
                        3"
                    </div>
                    <div class="content shadow">
                        <span class="cuIcon-sound span-xxl padding-right-xl"> </span>
                    </div>
                </div>
                <div class="cu-avatar radius"
                    style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big107000.jpg);"></div>
                <div class="date">13:23</div>
            </div>
            <div class="cu-item self">
                <div class="main">
                    <div class="action">
                        <span class="cuIcon-locationfill span-orange span-xxl"></span>
                    </div>
                    <div class="content shadow">
                        喵星球，喵喵市
                    </div>
                </div>
                <div class="cu-avatar radius"
                    style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big107000.jpg);"></div>
                <div class="date">13:23</div>
            </div>
            <div class="cu-item">
                <div class="cu-avatar radius"
                    style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big143004.jpg);"></div>
                <div class="main">
                    <div class="content shadow">
                        @#$^&**
                    </div>
                    <div class="action span-grey">
                        <span class="cuIcon-warnfill span-red span-xxl"></span> <span
                            class="span-sm margin-left-sm">翻译错误</span>
                    </div>
                </div>
                <div class="date">13:23</div>
            </div>
        </div>
        <div class="cu-bar foot input" style="bottom:0px">
            <div class="action">
                <span class="cuIcon-sound span-grey"></span>
            </div>
            <a-input :focus="true" :maxlength="300" cursor-spacing="10" />
            <div class="action">
                <span class="cuIcon-emojifill span-grey"></span>
                <span class="cuIcon-add span-grey"></span>
            </div>
            <a-button type="primary">发送</a-button>
        </div>
    </div>
</template>
<script setup>
// import { test, obj } from '../rtcGlobal';
import { ref, onMounted } from 'vue';
const list = ref([]);

onMounted(()=>{
    list.value=[
        {
            id:'abc',
            addTimeTick:12435515151,
            msg:'这是一个消息',
            userId:'ddd',
            type:'text',
            data:{}
        },
        {
            id:'efg',
            addTimeTick:12435515151,
            msg:'这是一个消息',
            userId:'ddd',
            type:'image',
            data:{
                url:'aa.jpg',
                width:200,
                height:100
            }
        }
    ]
})
</script>