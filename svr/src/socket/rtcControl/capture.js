
const { Readable } = require('stream');
const fs = require("fs");
const { PNG } = require("pngjs");
const robot = require("robotjs");
const utils = require("../../../src/utils/utils");

/**
 * 获取屏幕图像
 * @param {*} store 是否保存图片
 * @param {*} storePath 保存图片路径
 * @param {*} compress 是否压缩
 * @returns 
 */
async function controlScreenCapture(
    store = true, storePath = "", compress = true
) {
    const capture = robot.screen.capture();
    const stream = new Readable({
        read() {}
    });
    const png = new PNG({
        width: capture.width,
        height: capture.height
    });

    const bytesPerPixel = Math.floor(capture.byteWidth / capture.width);
    const image = capture.image;
    let pngIndex = 0;

    for (let y = 0; y < capture.height; y++) {
        for (let x = 0; x < capture.width; x++) {
            const i = (y * capture.byteWidth) + (x * bytesPerPixel);
            const blue = image.readUInt8(i);
            const green = image.readUInt8(i + 1);
            const red = image.readUInt8(i + 2);
            const alpha = 255;

            png.data[pngIndex++] = red;
            png.data[pngIndex++] = green;
            png.data[pngIndex++] = blue;
            png.data[pngIndex++] = alpha;
        }
    }

    stream.push(PNG.sync.write(png));
    stream.push(null);

    //保存图片
    if (store && storePath !== '') {

        if(compress){ //压缩图
            const filename = `${storePath}screen_compress_${Date.now()}.jpeg`;
            //压缩逻辑
            
            utils.tlConsole(`screen_compress saved as ${filename}`);
        }else{ //原图
            const filename = `${storePath}screen_${Date.now()}.png`;
            stream.pipe(fs.createWriteStream(filename));
            utils.tlConsole(`screen saved as ${filename}`);
        }
    }

    return stream;
}

module.exports = {
    controlScreenCapture
}