const sharp = require('sharp');
const path = require('path');
const axios = require('axios');

const trimBackground = async({ url, artistName }) => {
    const response = (await axios.default({ url, responseType: 'arraybuffer' }));
    const buffer = Buffer.from(response.data, 'binary');

    try {
        await sharp(buffer)
                    .trim(30)
                    .toFormat('jpeg')
                    .toFile(path.join(__dirname, '../../../static', 'image', 'artist-profile', `${artistName}.jpg`));
        
        return path.join(__dirname, '../../../static', 'image', 'artist-profile', `${artistName}.jpg`);
    }catch(err) {
        console.error(err.message);
        return null;
    }
}

export default trimBackground;