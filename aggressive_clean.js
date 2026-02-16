const Jimp = require('jimp');

async function aggressiveClean() {
    try {
        const computer = await Jimp.read('clean_pixel_computer_1770987790204.png');

        computer.scan(0, 0, computer.bitmap.width, computer.bitmap.height, function (x, y, idx) {
            const r = this.bitmap.data[idx + 0];
            const g = this.bitmap.data[idx + 1];
            const b = this.bitmap.data[idx + 2];

            // Remove White/Light Background (anything very light)
            if (r > 230 && g > 230 && b > 230) {
                this.bitmap.data[idx + 3] = 0;
            }
            // Remove ALL Black/Dark pixels (screen, shadows, base layers)
            // This is aggressive - removes anything darker than mid-grey
            else if (r < 80 && g < 80 && b < 80) {
                this.bitmap.data[idx + 3] = 0;
            }
        });

        await computer.writeAsync('src/assets/retro-computer.png');
        console.log('Aggressively cleaned computer asset');

    } catch (err) {
        console.error('Error:', err);
    }
}

aggressiveClean();
