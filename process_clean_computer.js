const Jimp = require('jimp');

async function processCleanComputer() {
    try {
        const computer = await Jimp.read('clean_pixel_computer_1770987790204.png');

        computer.scan(0, 0, computer.bitmap.width, computer.bitmap.height, function (x, y, idx) {
            const r = this.bitmap.data[idx + 0];
            const g = this.bitmap.data[idx + 1];
            const b = this.bitmap.data[idx + 2];

            // Remove White Background
            if (r > 240 && g > 240 && b > 240) {
                this.bitmap.data[idx + 3] = 0;
            }
            // Remove Black Screen (and any very dark pixels that might be screen content from generation)
            else if (r < 30 && g < 30 && b < 30) {
                this.bitmap.data[idx + 3] = 0;
            }
        });

        await computer.writeAsync('src/assets/retro-computer.png');
        console.log('Processed Clean Computer: src/assets/retro-computer.png');

    } catch (err) {
        console.error('Error:', err);
    }
}

processCleanComputer();
