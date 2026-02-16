const Jimp = require('jimp');

async function removeBlackBackground() {
    try {
        const image = await Jimp.read('upload_icon_3d_source_1770985224519.png');

        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
            const red = this.bitmap.data[idx + 0];
            const green = this.bitmap.data[idx + 1];
            const blue = this.bitmap.data[idx + 2];

            // If pixel is black (or very dark), make it transparent
            if (red < 20 && green < 20 && blue < 20) {
                this.bitmap.data[idx + 3] = 0; // Set alpha to 0
            }
        });

        await image.writeAsync('src/assets/upload-icon.png');
        console.log('Success: Background removed and saved to src/assets/upload-icon.png');
    } catch (err) {
        console.error('Error:', err);
    }
}

removeBlackBackground();
