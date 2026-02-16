const Jimp = require('jimp');

async function processPixelComputer() {
    try {
        const computer = await Jimp.read('pixel_computer_upload_1770988413689.png');

        computer.scan(0, 0, computer.bitmap.width, computer.bitmap.height, function (x, y, idx) {
            const r = this.bitmap.data[idx + 0];
            const g = this.bitmap.data[idx + 1];
            const b = this.bitmap.data[idx + 2];

            // Remove white/light background only
            if (r > 235 && g > 235 && b > 235) {
                this.bitmap.data[idx + 3] = 0;
            }
        });

        await computer.writeAsync('src/assets/computer-upload.png');
        console.log('Processed Pixel Computer: src/assets/computer-upload.png');

    } catch (err) {
        console.error('Error:', err);
    }
}

processPixelComputer();
