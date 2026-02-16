const Jimp = require('jimp');

async function processAssets() {
    try {
        // 1. Process TV Frame: Remove Black Screen (and background if white)
        // The generated TV likely has a white background and a black screen.
        // Let's remove the white background first (outer) and black screen (inner)
        // Actually, let's just inspect. The prompt said "isolated on white background, solid black screen".
        // So we want to remove White (outer) AND Black (screen). 
        // NOTE: The TV casing itself is grey.

        const tv = await Jimp.read('retro_tv_frame_1770986786830.png');
        tv.scan(0, 0, tv.bitmap.width, tv.bitmap.height, function (x, y, idx) {
            const r = this.bitmap.data[idx + 0];
            const g = this.bitmap.data[idx + 1];
            const b = this.bitmap.data[idx + 2];

            // Remove White Background
            if (r > 240 && g > 240 && b > 240) {
                this.bitmap.data[idx + 3] = 0;
            }
            // Remove Black Screen
            else if (r < 15 && g < 15 && b < 15) {
                this.bitmap.data[idx + 3] = 0;
            }
        });
        await tv.writeAsync('src/assets/retro-tv.png');
        console.log('Processed TV Frame: src/assets/retro-tv.png');

        // 2. Process Controller: Remove White Background
        const controller = await Jimp.read('retro_controller_icon_1770986800495.png');
        controller.scan(0, 0, controller.bitmap.width, controller.bitmap.height, function (x, y, idx) {
            const r = this.bitmap.data[idx + 0];
            const g = this.bitmap.data[idx + 1];
            const b = this.bitmap.data[idx + 2];

            if (r > 240 && g > 240 && b > 240) {
                this.bitmap.data[idx + 3] = 0;
            }
        });
        await controller.writeAsync('src/assets/retro-controller.png');
        console.log('Processed Controller: src/assets/retro-controller.png');

    } catch (err) {
        console.error('Error:', err);
    }
}

processAssets();
