const Jimp = require('jimp');

async function processComputerAssets() {
    try {
        // 1. Process Computer Monitor
        // Remove White Background (Outer) and Black Screen (Inner)
        const monitor = await Jimp.read('retro_computer_frame_1770987136726.png');
        monitor.scan(0, 0, monitor.bitmap.width, monitor.bitmap.height, function (x, y, idx) {
            const r = this.bitmap.data[idx + 0];
            const g = this.bitmap.data[idx + 1];
            const b = this.bitmap.data[idx + 2];

            // Outer White Background
            if (r > 240 && g > 240 && b > 240) {
                this.bitmap.data[idx + 3] = 0;
            }
            // Inner Black Screen
            else if (r < 20 && g < 20 && b < 20) {
                this.bitmap.data[idx + 3] = 0;
            }
        });
        await monitor.writeAsync('src/assets/retro-computer.png');
        console.log('Processed Computer Frame');

        // 2. Process Pixel Arrow
        // Remove Black Background, keep White Arrow
        const arrow = await Jimp.read('pixel_upload_arrow_1770987154975.png');
        arrow.scan(0, 0, arrow.bitmap.width, arrow.bitmap.height, function (x, y, idx) {
            const r = this.bitmap.data[idx + 0];
            const g = this.bitmap.data[idx + 1];
            const b = this.bitmap.data[idx + 2];

            // Black Background
            if (r < 20 && g < 20 && b < 20) {
                this.bitmap.data[idx + 3] = 0;
            }
        });
        await arrow.writeAsync('src/assets/pixel-arrow.png');
        console.log('Processed Pixel Arrow');

    } catch (err) {
        console.error('Error:', err);
    }
}

processComputerAssets();
