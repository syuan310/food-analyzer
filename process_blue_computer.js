const Jimp = require('jimp');

async function processBlueComputer() {
    try {
        const computer = await Jimp.read('blue_computer_upload_1770988283879.png');

        computer.scan(0, 0, computer.bitmap.width, computer.bitmap.height, function (x, y, idx) {
            const r = this.bitmap.data[idx + 0];
            const g = this.bitmap.data[idx + 1];
            const b = this.bitmap.data[idx + 2];

            // Remove light grey/white background
            if (r > 200 && g > 200 && b > 200) {
                this.bitmap.data[idx + 3] = 0;
            }
        });

        await computer.writeAsync('src/assets/computer-upload.png');
        console.log('Processed Blue Computer: src/assets/computer-upload.png');

    } catch (err) {
        console.error('Error:', err);
    }
}

processBlueComputer();
