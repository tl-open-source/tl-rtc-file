// --------------------------- //
// --       draw.js         -- //
// --   version : 1.0.0     -- //
// --   date : 2023-06-22   -- //
// --------------------------- //

const draw = new Vue({
    el: '#drawApp',
    data: function () {
        return {
            devicePixelRatio: window.devicePixelRatio, //设备像素比
            drawing: false, // 是否正在绘制
            isOpenDraw: false, //是否打开画笔
            remoteDrawIndex: -1, //画笔弹窗index
            prePoint: { x: 0, y: 0 }, //上一个点
            drawList: [], // 绘制操作列表, 暂时不存操作数据, 只传输
            drawHistoryList: [], // 绘制历史操作列表, 用于回退
            drawRollbackPoint: 0, // 绘制回退点
            lineWidth: 1, // 画笔线宽
            strokeStyle: "#000000", // 画笔颜色
            //line: 线条, circle: 圆形, rectangle: 矩形, text: 文字, delete: 擦除
            drawMode: "line", // 画笔模式
            circleFill : false, //填充圆模式
            rectangleFill : false, //填充矩形模式
            triangleFill : false, //填充三角形
            starFill : false, //填充星星
            rhomboidFill : false, //填充平行四边形
            hexagonFill : false, //填充六边形
            circleStarPoint: { x: 0, y: 0 }, //圆形开始点
            triangleStartPoint : { x: 0, y: 0 }, //三角形开始点
            starStartPoint : { x: 0, y: 0 }, //星星开始点
            rhomboidStartPoint : { x: 0, y: 0 }, //平行四边形开始点
            hexagonStartPoint : { x: 0, y: 0 }, //六边形边形开始点
        }
    },
    watch: {
        drawMode: {
            handler: function (val) {
                if (val !== 'text') {
                    const parentDom = document.getElementById("tl-rtc-file-mouse-draw-canvas-body");
                    const textareaDom = document.getElementById("tl-rtc-file-mouse-draw-canvas-textarea");
                    if (parentDom && textareaDom) {
                        parentDom.removeChild(textareaDom);
                    }
                }
            },
            deep: true,
            immediate: true
        },
        drawRollbackPoint: {
            handler: function (val) {
                this.toolDisabledHandler();
            },
            deep: true,
            immediate: true
        },
        drawHistoryList: {
            handler: function (val) {
                this.toolDisabledHandler();
            },
            deep: true,
            immediate: true
        }
    },
    methods: {
        toolDisabledHandler: function () {

            const drawRollbackDom = document.getElementById("drawRollback");
            if (drawRollbackDom) {
                //如果回退点为0, 将回退节点禁用
                if (this.drawRollbackPoint === 0) {
                    drawRollbackDom.style.cursor = "no-drop";
                    drawRollbackDom.style.color = "#4c53d926";
                } else {
                    drawRollbackDom.style.cursor = "";
                    drawRollbackDom.style.color = "";
                }
            }

            const drawRollupDom = document.getElementById("drawUndoRollback");
            if (drawRollupDom) {
                //如果回退点为最后一个, 将前进节点禁用
                if (this.drawRollbackPoint === this.drawHistoryList.length - 1
                    || this.drawHistoryList.length === 0) {
                    drawRollupDom.style.cursor = "no-drop";
                    drawRollupDom.style.color = "#4c53d926"
                } else {
                    drawRollupDom.style.cursor = "";
                    drawRollupDom.style.color = "";
                }
            }

            const drawResetDom = document.getElementById("drawReset");
            if (drawResetDom) {
                if (this.drawHistoryList.length === 0) {
                    drawResetDom.style.cursor = "no-drop";
                    drawResetDom.style.color = "#4c53d926"
                } else {
                    drawResetDom.style.cursor = "";
                    drawResetDom.style.color = "";
                }
            }
        },
        openRemoteDraw: function (options) {
            //绘制远程画笔时，如果没有打开本地画笔面板，则不允许绘制
            if (!this.isOpenDraw) {
                return
            }
            const canvas = document.getElementById('tl-rtc-file-mouse-draw-canvas');
            options.canvas = canvas;
            options.context = canvas.getContext('2d');
            options.fromRemote = true;

            const { drawMode } = options;

            //收到结束标识，保存当前画板到缓存数据中
            if(options.event === 'end'){
                this.endDrawHandler(options)
                return
            }

            if (drawMode === 'line') {
                this.drawLine(options);
            } else if (drawMode === 'circle') {
                this.drawCircle(options);
            } else if (drawMode === 'rectangle') {
                this.drawRectangle(options);
            } else if (drawMode === 'text') {
                this.drawText(options);
            } else if(drawMode === 'triangle'){
                this.drawTriangle(options);
            } else if(drawMode === 'star'){
                this.drawStar(options);
            } else {
                console.log("收到远程未知的绘制模式")
            }
        },
        // 打开/关闭本地画笔
        openDraw: function ({
            openCallback, closeCallback, localDrawCallback
        }) {
            let that = this;

            if (this.isOpenDraw) {
                layer.close(this.remoteDrawIndex);
                this.remoteDrawIndex = -1;
                this.isOpenDraw = !this.isOpenDraw;
                closeCallback && closeCallback(this.drawHistoryList.length);
                return
            }

            this.remoteDrawIndex = layer.open({
                type: 1,
                area: ["90%", "90%"],
                scrollbar: false,
                title: "远程画笔绘制",
                content: `
                    <div id="tl-rtc-file-mouse-draw"> 
                        <div class="tl-rtc-file-mouse-draw-body">
                            <div class="tl-rtc-file-mouse-draw-body-item">
                                <div>重置: </div>
                                <i class="layui-icon layui-icon-delete" id="drawReset"></i> 
                            </div>
                            <div class="tl-rtc-file-mouse-draw-body-item">
                                <div>擦除: </div>
                                <svg class="icon" aria-hidden="true" id="drawDelete">
                                    <use xlink:href="#icon-rtc-file-xiangpica"></use>
                                </svg>
                            </div>
                            <div class="tl-rtc-file-mouse-draw-body-item">
                                <div>撤销: </div>
                                <i class="layui-icon layui-icon-left" id="drawRollback"></i> 
                                <i class="layui-icon layui-icon-right" id="drawUndoRollback"></i> 
                            </div>
                            <div class="tl-rtc-file-mouse-draw-body-item">
                                <div>线条: </div>
                                <i class="layui-icon layui-icon-edit" id="drawLine"></i> 
                            </div>
                            <div class="tl-rtc-file-mouse-draw-body-item">
                                <div>圆形: </div>
                                <svg class="icon" aria-hidden="true" id="drawCircle">
                                    <use xlink:href="#icon-rtc-file-yuanxing"></use>
                                </svg>
                                <svg class="icon" aria-hidden="true" id="drawCircleFill">
                                    <use xlink:href="#icon-rtc-file-circle"></use>
                                </svg>
                            </div>
                            <div class="tl-rtc-file-mouse-draw-body-item">
                                <div>矩形: </div>
                                <svg class="icon" aria-hidden="true" id="drawRectangle">
                                    <use xlink:href="#icon-rtc-file-juxing"></use>
                                </svg>
                                <svg class="icon" aria-hidden="true" id="drawRectangleFill">
                                    <use xlink:href="#icon-rtc-file-yuanjiao-rect"></use>
                                </svg>
                            </div>
                            <div class="tl-rtc-file-mouse-draw-body-item">
                                <div>三角: </div>
                                <svg class="icon" aria-hidden="true" id="drawTriangle">
                                    <use xlink:href="#icon-rtc-file-xiangshangsanjiaoxing"></use>
                                </svg>
                                <svg class="icon" aria-hidden="true" id="drawTriangleFill">
                                    <use xlink:href="#icon-rtc-file-sanjiaoxing"></use>
                                </svg>
                                <svg class="icon" aria-hidden="true" id="drawStar">
                                    <use xlink:href="#icon-rtc-file-xingxing1"></use>
                                </svg>
                                <svg class="icon" aria-hidden="true" id="drawStarFill">
                                    <use xlink:href="#icon-rtc-file-xingxing"></use>
                                </svg>
                            </div>
                            <div class="tl-rtc-file-mouse-draw-body-item">
                                <div>文字: </div>
                                <svg class="icon" aria-hidden="true" id="drawText">
                                    <use xlink:href="#icon-rtc-file-wenzi"></use>
                                </svg>
                            </div>
                            <div class="tl-rtc-file-mouse-draw-body-item">
                                <div>图像: </div>
                                <svg class="icon" aria-hidden="true" id="drawImage">
                                    <use xlink:href="#icon-rtc-file-tupian_huaban"></use>
                                </svg>
                            </div>
                            <div class="tl-rtc-file-mouse-draw-body-item">
                                <div>下载: </div>
                                <svg class="icon" aria-hidden="true" id="drawDonwload">
                                    <use xlink:href="#icon-rtc-file-xiazai"></use>
                                </svg>
                            </div>
                            <div class="tl-rtc-file-mouse-draw-body-item">
                                <div>颜色: </div>
                                <div id="tl-rtc-file-mouse-draw-stroke-color"></div>
                            </div>
                            <div style="padding: 10px;font-weight: 100;">
                                <div>画笔粗细:<i id="tl-rtc-file-mouse-draw-line-size-txt"></i></div>
                                <div id="tl-rtc-file-mouse-draw-line-size" style="margin-top: 10px;"></div>
                            </div>
                            <div style="padding: 10px;font-weight: 100;">
                                <div>画布比例: <i id="tl-rtc-file-mouse-draw-div-size-txt"></i> </div>
                                <div id="tl-rtc-file-mouse-draw-div-size" style="margin-top: 10px;"></div>
                            </div>
                        </div>
                        <div id="tl-rtc-file-mouse-draw-canvas-body"> </div>
                    </div> 
                `,
                success: function (layero, index) {
                    that.isOpenDraw = true;
                    that.toolDisabledHandler();

                    document.querySelector(".layui-layer-content").style.borderRadius = "15px";
                    //工具初始化
                    colorpicker.render({
                        elem: '#tl-rtc-file-mouse-draw-stroke-color',
                        color: '#00000',
                        alpha: true,
                        done: function (color) {
                            that.strokeStyle = color;
                        }
                    });

                    //画笔大小
                    let sliderTextObj = slider.render({
                        elem: '#tl-rtc-file-mouse-draw-line-size',
                        min: 1,
                        max: 23,
                        step: 1,
                        showstep: true,
                        change: function (value) {
                            that.lineWidth = value * that.devicePixelRatio;
                            if (value < 10) {
                                document.getElementById("tl-rtc-file-mouse-draw-line-size-txt").innerText = "0" + value;
                            } else {
                                document.getElementById("tl-rtc-file-mouse-draw-line-size-txt").innerText = value;
                            }
                        }
                    });
                    sliderTextObj.setValue(1)

                    //画布比例
                    let sliderDivObj = slider.render({
                        elem: '#tl-rtc-file-mouse-draw-div-size',
                        min: 10,
                        max: 200,
                        disabled : true,
                        change: function (value) {
                            document.getElementById("tl-rtc-file-mouse-draw-div-size-txt").innerText = value + "%";
                        }
                    });
                    sliderDivObj.setValue(90)

                    // 创建 canvas 元素
                    const canvas = document.createElement('canvas');
                    let dom = document.getElementById("tl-rtc-file-mouse-draw-canvas-body");
                    canvas.setAttribute("id", "tl-rtc-file-mouse-draw-canvas");
                    canvas.setAttribute("class", "tl-rtc-file-mouse-draw-canvas-line");

                    const width = document.querySelector(".tl-rtc-file-mouse-draw-body").clientWidth;
                    const height = (document.querySelector(".layui-layer-content").clientHeight -
                        document.querySelector(".tl-rtc-file-mouse-draw-body").clientHeight) - 20;

                    //设置画布大小
                    canvas.style.width = width + "px"
                    canvas.style.height = height + "px"

                    //设置画布宽高 ，为了保证高清屏下绘制不模糊，需要将画布宽高放大
                    canvas.width = width * that.devicePixelRatio;
                    canvas.height = height * that.devicePixelRatio;

                    dom.appendChild(canvas);
                    let context = canvas.getContext('2d');

                    //初始化一张默认画布
                    that.drawHistoryList.push(canvas.toDataURL())

                    if (document.body.ontouchstart === undefined) {
                        that.pcLocalDraw({ canvas, context, localDrawCallback });
                    } else {
                        that.mobileLocalDraw({ canvas, context, localDrawCallback });
                    }

                    document.getElementById("drawLine").onclick = function () {
                        that.drawMode = "line";
                        canvas.setAttribute("class", "tl-rtc-file-mouse-draw-canvas-line");
                    }

                    document.getElementById("drawRectangleFill").onclick = function () {
                        canvas.setAttribute("class", "tl-rtc-file-mouse-draw-canvas-rectangle-fill");
                        that.drawMode = "rectangle";
                        that.rectangleFill = true;
                    }

                    document.getElementById("drawCircle").onclick = function () {
                        canvas.setAttribute("class", "tl-rtc-file-mouse-draw-canvas-circle");
                        that.drawMode = "circle";
                        that.circleFill = false;
                    }

                    document.getElementById("drawCircleFill").onclick = function () {
                        canvas.setAttribute("class", "tl-rtc-file-mouse-draw-canvas-circle-fill");
                        that.drawMode = "circle";
                        that.circleFill = true;
                    }

                    document.getElementById("drawTriangle").onclick = function () {
                        canvas.setAttribute("class", "tl-rtc-file-mouse-draw-canvas-triangle");
                        that.drawMode = "triangle";
                        that.triangleFill = false;
                    }

                    document.getElementById("drawTriangleFill").onclick = function () {
                        canvas.setAttribute("class", "tl-rtc-file-mouse-draw-canvas-triangle-fill");
                        that.drawMode = "triangle";
                        that.triangleFill = true;
                    }

                    document.getElementById("drawStar").onclick = function () {
                        canvas.setAttribute("class", "tl-rtc-file-mouse-draw-canvas-star");
                        that.drawMode = "star";
                        that.starFill = false;
                    }

                    document.getElementById("drawStarFill").onclick = function () {
                        canvas.setAttribute("class", "tl-rtc-file-mouse-draw-canvas-star-fill");
                        that.drawMode = "star";
                        that.starFill = true;
                    }

                    document.getElementById("drawRectangle").onclick = function () {
                        canvas.setAttribute("class", "tl-rtc-file-mouse-draw-canvas-rectangle");
                        that.drawMode = "rectangle";
                        that.rectangleFill = false;
                    }

                    document.getElementById("drawText").onclick = function () {
                        canvas.setAttribute("class", "tl-rtc-file-mouse-draw-canvas-text");
                        that.drawMode = "text";
                    }

                    document.getElementById("drawReset").onclick = function () {
                        that.drawReset({ canvas, context, localDrawCallback })
                    }

                    document.getElementById("drawDelete").onclick = function () {
                        that.drawMode = "delete";
                        canvas.setAttribute("class", "tl-rtc-file-mouse-draw-canvas-delete");
                    }

                    document.getElementById("drawRollback").onclick = function () {
                        that.drawRollback({ canvas, context, localDrawCallback });
                    }

                    document.getElementById("drawUndoRollback").onclick = function () {
                        that.drawUndoRollback({ canvas, context, localDrawCallback });
                    }

                    document.getElementById("drawImage").onclick = function () {
                        that.drawImage({ canvas, context, localDrawCallback })
                    }

                    document.getElementById("drawDonwload").onclick = function () {
                        that.drawDownload({ canvas, context, localDrawCallback })
                    }
                },
                cancel: function () {
                    that.isOpenDraw = false;
                }
            });

            openCallback && openCallback();

            return
        },
        // pc端画笔渲染处理
        pcLocalDraw: function ({ canvas, context, localDrawCallback }) {
            let that = this;
            canvas.onmousedown = function (e) {
                that.drawing = true;
                that.prePoint = { x: e.offsetX * that.devicePixelRatio, y: e.offsetY * that.devicePixelRatio };
                that.startDrawHandler({ canvas, context, localDrawCallback });
            };
            canvas.onmousemove = function (e) {
                let curPoint = { x: e.offsetX * that.devicePixelRatio, y: e.offsetY * that.devicePixelRatio };
                that.drawingHandler({ canvas, curPoint, context, localDrawCallback });
                that.prePoint = curPoint;
            };
            canvas.onmouseup = function (e) {
                that.endDrawHandler({ canvas, curPoint: that.prePoint, context, localDrawCallback })
                that.drawing = false;
            };
        },
        // 移动端画笔渲染处理
        mobileLocalDraw: function ({ canvas, context, localDrawCallback }) {
            let that = this;
            canvas.ontouchstart = function (e) {
                that.drawing = true;
                that.prePoint = {
                    x: (
                        e.touches[0].clientX - (15 * that.devicePixelRatio)
                    ) * that.devicePixelRatio,
                    y: (
                        e.touches[0].clientY - 
                        document.querySelector(".tl-rtc-file-mouse-draw-body").clientHeight - 
                        (50 * Math.min(that.devicePixelRatio, 2))
                    ) * that.devicePixelRatio
                };

                that.startDrawHandler({ canvas, context, localDrawCallback });
            };
            canvas.ontouchmove = function (e) {
                let curPoint = {
                    x: (
                        e.touches[0].clientX - (15 * that.devicePixelRatio)
                    ) * that.devicePixelRatio,
                    y: (
                        e.touches[0].clientY - 
                        document.querySelector(".tl-rtc-file-mouse-draw-body").clientHeight - 
                        (50 * Math.min(that.devicePixelRatio, 2))
                    ) * that.devicePixelRatio
                };

                that.drawingHandler({ canvas, curPoint, context, localDrawCallback });
                that.prePoint = curPoint;
            };
            canvas.ontouchend = function (e) {
                that.endDrawHandler({ canvas, curPoint: that.prePoint, context, localDrawCallback })
                that.drawing = false;
            };
        },
        startDrawHandler: function ({ canvas, context, localDrawCallback }) {
            //公共参数
            let commOptions = {
                event : "start",
                canvas,
                context,
                localDrawCallback,
                drawMode: this.drawMode,
                lineWidth: this.lineWidth,
                strokeStyle: this.strokeStyle,
                fillStyle: this.strokeStyle,
                lineCap: "round",
                lineJoin: "round"
            }

            if (this.drawMode === 'delete') {
                this.drawDelete(Object.assign(commOptions, {
                    prePoint: this.prePoint,
                    curPoint : this.prePoint
                }))
            } else if (this.drawMode === 'rectangle') {
                //开始的时候固定好矩形的起点
                this.rectangleStartPoint = this.prePoint;
                this.drawRectangle(Object.assign(commOptions, {
                    rectangleStartPoint: this.rectangleStartPoint,
                    curPoint: this.prePoint,
                    rectangleFill : this.rectangleFill
                }))
            } else if (this.drawMode === 'circle') {
                //开始的时候固定好圆的起点
                this.circleStartPoint = this.prePoint;
                this.drawCircle(Object.assign(commOptions, {
                    circleStartPoint: this.circleStartPoint,
                    curPoint: this.prePoint,
                    circleFill : this.circleFill,
                }))
            } else if(this.drawMode === 'triangle'){
                //开始的时候固定好三角形的起点
                this.triangleStartPoint = this.prePoint;
                this.drawTriangle(Object.assign(commOptions, {
                    triangleStartPoint: this.triangleStartPoint,
                    curPoint: this.prePoint,
                    triangleFill : this.triangleFill
                }));
            } else if(this.drawMode === 'star'){
                //开始的时候固定好星星的起点
                this.starStartPoint = this.prePoint;
                this.drawStar(Object.assign(commOptions, {
                    starStartPoint: this.starStartPoint,
                    curPoint: this.prePoint,
                    starFill : this.starFill
                }));
            } else if (this.drawMode === 'text') {
                this.drawText(Object.assign(commOptions, {
                    curPoint: this.prePoint,
                }))
                this.endDrawHandler(Object.assign(commOptions, {
                    curPoint: this.prePoint,
                }))
            } else if(this.drawMode === 'line'){
                this.drawLine(Object.assign(commOptions, {
                    prePoint: this.prePoint,
                    curPoint: this.prePoint,
                }));
            }
        },
        drawingHandler: function ({ canvas, curPoint, context, localDrawCallback }) {
            if (!this.drawing) {
                return
            }
            //公共参数
            let commOptions = {
                event : "move",
                canvas,
                context,
                localDrawCallback,
                drawMode: this.drawMode,
                lineWidth: this.lineWidth,
                strokeStyle: this.strokeStyle,
                fillStyle: this.strokeStyle,
                lineCap: "round",
                lineJoin: "round"
            }

            if (this.drawMode === 'delete') {
                this.drawDelete(Object.assign(commOptions, {
                    prePoint: this.prePoint,
                    curPoint
                }))
            } else if (this.drawMode === 'rectangle') {
                this.drawRectangle(Object.assign(commOptions, {
                    rectangleStartPoint: this.rectangleStartPoint,
                    curPoint,
                    rectangleFill : this.rectangleFill
                }));
            } else if (this.drawMode === 'circle') {
                this.drawCircle(Object.assign(commOptions, {
                    circleStartPoint: this.circleStartPoint,
                    curPoint,
                    circleFill : this.circleFill,
                }))
            } else if(this.drawMode === 'triangle'){
                this.drawTriangle(Object.assign(commOptions, {
                    triangleStartPoint: this.triangleStartPoint,
                    curPoint,
                    triangleFill : this.triangleFill
                }));
            } else if(this.drawMode === 'star'){
                this.drawStar(Object.assign(commOptions, {
                    starStartPoint: this.starStartPoint,
                    curPoint,
                    starFill : this.starFill
                }));
            } else if(this.drawMode === 'line'){
                this.drawLine(Object.assign(commOptions, {
                    prePoint: this.prePoint,
                    curPoint,
                }));
            }
        },
        endDrawHandler: function ({ canvas, curPoint, context, localDrawCallback }) {
            //图像记录，用于回滚撤销操作
            if ( 
                this.drawMode === 'line' || this.drawMode === 'circle' ||
                this.drawMode === 'rectangle' || this.drawMode === 'text' || 
                this.drawMode === 'triangle' || this.drawMode === 'star'
            ) {
                this.drawHistoryList.push(canvas.toDataURL());
                this.drawRollbackPoint = this.drawHistoryList.length - 1;
            }

            //结束的时候通知下远程，可以保存画布到缓存列表中
            localDrawCallback && localDrawCallback({
                event : "end",
                drawMode : this.drawMode
            })
        },
        //下载画布图片
        drawDownload: function ( options ) {
            const { canvas, context, localDrawCallback } = options;

            let image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
            let link = document.createElement('a');
            link.href = image;
            link.download = "image.png";
            link.click();
        },
        // 画布重置
        drawReset: function (options) {
            const { canvas, context, localDrawCallback } = options;

            context.clearRect(0, 0, canvas.width, canvas.height);
            this.drawHistoryList = [];
            this.drawRollbackPoint = 0;
        },
        // 回退回滚的绘制
        drawUndoRollback: function (options) {
            const { canvas, context, localDrawCallback } = options;
            //最多前进到最后一条记录
            if (this.drawRollbackPoint < this.drawHistoryList.length - 1) {
                this.drawRollbackPoint = this.drawRollbackPoint + 1;
            }

            const img = new Image();
            img.src = this.drawHistoryList[this.drawRollbackPoint];
            img.onload = function () {
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(img, 0, 0, canvas.width, canvas.height);
            }
        },
        // 画布回退
        drawRollback: async function (options) {
            const { canvas, context, localDrawCallback } = options;
            //最多回退到原点
            if (this.drawRollbackPoint > 0) {
                this.drawRollbackPoint = this.drawRollbackPoint - 1;
                const img = new Image();
                img.src = this.drawHistoryList[this.drawRollbackPoint];
                img.onload = function () {
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    context.drawImage(img, 0, 0, canvas.width, canvas.height);
                }
            }
        },
        // 画笔擦除
        drawDelete: function (options) {
            const { canvas, context, prePoint, curPoint, localDrawCallback } = options;
            context.lineWidth = this.lineWidth;
            //防止移动过快，canvas渲染存在间隔，导致线条断层，在这里补充绘制间隔的点
            let x = prePoint.x;
            let y = prePoint.y;
            let dx = curPoint.x - prePoint.x;
            let dy = curPoint.y - prePoint.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let xUnit = dx / distance;
            let yUnit = dy / distance;
            let i = 0;
            while (i < distance) {
                x += xUnit;
                y += yUnit;
                context.clearRect(x - 20, y - 20, this.lineWidth, this.lineWidth);
                i++;
            }
        },
        // 图片渲染处理
        drawImage: function (options) {
            let that = this;
            const { canvas, context, localDrawCallback } = options;
            let input = document.createElement("input");
            input.setAttribute("type", "file");
            input.setAttribute("accept", "image/*");
            input.click();
            input.onchange = function () {
                let file = input.files[0];
                let reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function () {
                    let img = new Image();
                    img.src = this.result;
                    img.onload = function () {
                        context.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
                        //画完图片，保存操作记录
                        that.drawHistoryList.push(canvas.toDataURL());
                        that.drawRollbackPoint = that.drawHistoryList.length - 1;
                    }
                }
            }
        },
        // 画笔渲染处理, 两点式绘制
        drawLine: function (options) {
            const {
                canvas, context, localDrawCallback,  prePoint, curPoint, 
                lineWidth, strokeStyle, fillStyle, lineCap, lineJoin, fromRemote, 
            } = options;

            // 设置画笔样式
            context.lineWidth = lineWidth;
            context.strokeStyle = strokeStyle;
            context.fillStyle = fillStyle;
            context.lineCap = lineCap;
            context.lineJoin = lineJoin;

            // 开始绘制路径
            context.beginPath();

            //防止移动过快，canvas渲染存在间隔，导致线条断层，在这里补充绘制间隔的点
            let x = prePoint.x;
            let y = prePoint.y;
            let dx = curPoint.x - prePoint.x;
            let dy = curPoint.y - prePoint.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let xUnit = dx / distance;
            let yUnit = dy / distance;
            let i = 0;
            while (i < distance) {
                x += xUnit;
                y += yUnit;
                context.ellipse(x, y, lineWidth, lineWidth, 0, 0, 2 * Math.PI);
                context.fill()
                i++;
            }

            if (!fromRemote) { //本地的绘制数据回调给远端
                localDrawCallback && localDrawCallback(options);
            }
        },
        // 星星渲染处理
        drawStar: function (options) {
            const {
                canvas, context, localDrawCallback, starStartPoint, curPoint, 
                lineWidth, strokeStyle, fillStyle, lineCap, lineJoin, fromRemote, starFill
            } = options;

            // 设置画笔样式
            context.lineWidth = lineWidth;
            context.strokeStyle = strokeStyle;
            context.fillStyle = fillStyle;
            context.lineCap = lineCap;
            context.lineJoin = lineJoin;

            const { x, y } = curPoint;
            const size = Math.sqrt(
                Math.pow(curPoint.x - starStartPoint.x, 2) + Math.pow(curPoint.y - starStartPoint.y, 2)
            ) / 2;

            if (this.drawRollbackPoint >= 0) {
                const img = new Image();
                img.src = this.drawHistoryList[this.drawRollbackPoint];
                img.onload = function () {
                    //清理实时移动绘制的五角星
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    //绘制之前的数据
                    context.drawImage(img, 0, 0, canvas.width, canvas.height);

                    context.beginPath();
                    for (let i = 0; i <= 5; i++) {
                        context.lineTo(
                            Math.cos((18 + i * 72) / 180 * Math.PI) * size + x, 
                            -Math.sin((18 + i * 72) / 180 * Math.PI) * size + y
                        );
                        context.lineTo(
                            Math.cos((54 + i * 72) / 180 * Math.PI) * (size / 2) + x, 
                            -Math.sin((54 + i * 72) / 180 * Math.PI) * (size / 2) + y
                        );
                    }
                    if(starFill){
                        context.fill()
                    }
                    context.stroke();
                }
            }

            if (!fromRemote) { //本地的绘制数据回调给远端
                localDrawCallback && localDrawCallback(options);
            }
        },
        // 三角形渲染处理
        drawTriangle: function (options) {
            const {
                canvas, context, localDrawCallback, triangleStartPoint, curPoint, 
                lineWidth, strokeStyle, fillStyle, lineCap, lineJoin, fromRemote, triangleFill
            } = options;

            // 设置画笔样式
            context.lineWidth = lineWidth;
            context.strokeStyle = strokeStyle;
            context.fillStyle = fillStyle;
            context.lineCap = lineCap;
            context.lineJoin = lineJoin;

            //根据起点和当前移动的位置，计算三角形三个点进行绘制
            const x1 = triangleStartPoint.x;
            const y1 = triangleStartPoint.y;
            const x2 = curPoint.x;
            const y2 = curPoint.y;
            const x3 = triangleStartPoint.x - (curPoint.x - triangleStartPoint.x);
            const y3 = curPoint.y;

            if (this.drawRollbackPoint >= 0) {
                const img = new Image();
                img.src = this.drawHistoryList[this.drawRollbackPoint];
                img.onload = function () {
                    //清理实时移动绘制的三角形
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    //绘制之前的数据
                    context.drawImage(img, 0, 0, canvas.width, canvas.height);
                    //绘制新三角形
                    context.beginPath();

                    context.moveTo(x1, y1);
                    context.lineTo(x2, y2);
                    context.lineTo(x3, y3);
                    context.lineTo(x1, y1);

                    if(triangleFill){
                        context.fill()
                    }
                    context.stroke();
                }
            }

            if (!fromRemote) { //本地的绘制数据回调给远端
                localDrawCallback && localDrawCallback(options);
            }
        },
        // 圆形渲染处理
        drawCircle: function (options) {
            const {
                canvas, context, localDrawCallback, circleStartPoint, curPoint, 
                lineWidth, strokeStyle, fillStyle, lineCap, lineJoin, fromRemote, circleFill
            } = options;

            // 设置画笔样式
            context.lineWidth = lineWidth;
            context.strokeStyle = strokeStyle;
            context.fillStyle = fillStyle;
            context.lineCap = lineCap;
            context.lineJoin = lineJoin;

            const centerX = (circleStartPoint.x + curPoint.x) / 2;
            const centerY = (circleStartPoint.y + curPoint.y) / 2;
            const radius = Math.sqrt(
                Math.pow(curPoint.x - circleStartPoint.x, 2) + Math.pow(curPoint.y - circleStartPoint.y, 2)
            ) / 2;
            
            if (this.drawRollbackPoint >= 0) {
                const img = new Image();
                img.src = this.drawHistoryList[this.drawRollbackPoint];
                img.onload = function () {
                    //清理实时移动绘制的圆
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    //绘制之前的数据
                    context.drawImage(img, 0, 0, canvas.width, canvas.height);
                    //绘制新圆
                    context.beginPath();
                    context.ellipse(centerX, centerY, radius, radius, 0, 0, 2 * Math.PI);
                    if(circleFill){
                        context.fill()
                    }
                    context.stroke();
                }
            }

            if (!fromRemote) { //本地的绘制数据回调给远端
                localDrawCallback && localDrawCallback(options);
            }
        },
        // 矩形渲染处理
        drawRectangle: function (options) {
            const {
                canvas, context, localDrawCallback, rectangleStartPoint, curPoint, 
                lineWidth, strokeStyle, fillStyle, lineCap, lineJoin, fromRemote, rectangleFill
            } = options;

            // 设置画笔样式
            context.lineWidth = lineWidth;
            context.strokeStyle = strokeStyle;
            context.fillStyle = fillStyle;
            context.lineCap = lineCap;
            context.lineJoin = lineJoin;

            // 计算矩形的位置和尺寸
            const x = Math.min(rectangleStartPoint.x, curPoint.x);
            const y = Math.min(rectangleStartPoint.y, curPoint.y);
            const width = Math.abs(curPoint.x - rectangleStartPoint.x);
            const height = Math.abs(curPoint.y - rectangleStartPoint.y);

            if (this.drawRollbackPoint >= 0) {
                const img = new Image();
                img.src = this.drawHistoryList[this.drawRollbackPoint];
                img.onload = function () {
                    //清理实时移动绘制的矩形
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    //绘制之前的数据
                    context.drawImage(img, 0, 0, canvas.width, canvas.height);
                    //绘制新矩形
                    context.beginPath();
                    context.rect(x, y, width, height);
                    if(rectangleFill){
                        context.fill();
                    }
                    context.stroke();
                }
            }

            if (!fromRemote) { //本地的绘制数据回调给远端
                localDrawCallback && localDrawCallback(options);
            }
        },
        // 文字渲染处理
        drawText: function (options) {
            let {
                canvas, context, localDrawCallback, curPoint, text, lineWidth, strokeStyle,
                fillStyle, lineCap, lineJoin, fromRemote,
            } = options;

            curPoint = {
                x : curPoint.x / window.devicePixelRatio,
                y : curPoint.y / window.devicePixelRatio
            }

            // 设置字体样式
            context.strokeStyle = strokeStyle;
            context.font = "28px orbitron";
            context.textBaseline = "middle";
            context.lineCap = lineCap;
            context.lineJoin = lineJoin;
            context.lineWidth = 3;

            const canvasWidth = parseInt(canvas.style.width);
            const canvasHeight = parseInt(canvas.style.height);

            //文字渲染处理
            function drawTextHandler(content){
                const textWidth = context.measureText(content).width;
                // 如果文字超出画布宽度，将文字绘制到画布最右边
                let fixPointX = canvasWidth - textWidth > curPoint.x ? curPoint.x : canvasWidth - textWidth;
                fixPointX = fixPointX < 10 ? 10 : fixPointX;
                // 如果文字超出画布高度，将文字绘制到画布最下边
                let fixPointY = canvasHeight - 20 > curPoint.y ? curPoint.y : canvasHeight - 20;
                fixPointY = fixPointY < 10 ? 10 : fixPointY;
                context.strokeText(content, fixPointX * window.devicePixelRatio, fixPointY * window.devicePixelRatio);
            }

            if(fromRemote){
                drawTextHandler(text);
                return
            }

            //本地的绘制数据回调给远端
            const parentDom = document.getElementById("tl-rtc-file-mouse-draw-canvas-body");
            const textareaDom = document.getElementById("tl-rtc-file-mouse-draw-canvas-textarea");
            if (textareaDom) {
                parentDom.removeChild(textareaDom);
            }

            // 创建临时的输入框
            const textarea = document.createElement('textarea');
            textarea.setAttribute("id", "tl-rtc-file-mouse-draw-canvas-textarea");
            textarea.className = "layui-textarea";
            textarea.style.width = '100px';
            textarea.style.height = '30px';
            textarea.style.wordBreak = 'break-all';
            textarea.style.border = "1px dashed";
            textarea.style.position = 'absolute';

            if(curPoint.x + 90 < canvasWidth){
                textarea.style.left = (curPoint.x  + 10) + 'px';
            }else{
                textarea.style.left = (canvasWidth - 90) + 'px';
            }

            if (curPoint.y + 100 > canvasHeight) {
                textarea.style.bottom = '10px';
            } else if (curPoint.y < 100) {
                textarea.style.bottom = (canvasHeight - 100) + 'px';
            } else {
                textarea.style.top = (curPoint.y + 70)+ 'px';
            }
            parentDom.appendChild(textarea);
            textarea.focus();

            textarea.addEventListener('blur', function () {
                if (textarea.value !== '') {
                    drawTextHandler(textarea.value);
                    document.getElementById("drawLine").click()
                    options.text = textarea.value;
                    localDrawCallback && localDrawCallback(options);
                }
            })
        }
    },
    mounted: function () {

        //本地画笔
        window.Bus.$on("openDraw", (options) => {
            this.openDraw(options)
        });

        //远程画笔
        window.Bus.$on("openRemoteDraw", (options) => {
            this.openRemoteDraw(options)
        });

    }
})