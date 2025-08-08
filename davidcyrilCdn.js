const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function davidcyCdn(buffer, fileType, fileName = 'upload') {
    try {
        let tempFolder = path.join(__dirname, 'temp');
        if (!fs.existsSync(tempFolder)) fs.mkdirSync(tempFolder);

        let filePath = path.join(tempFolder, `${fileName}.${fileType}`);
        fs.writeFileSync(filePath, buffer); // Save file temporarily

        let formData = new FormData();
        formData.append('file', fs.createReadStream(filePath));

        let response = await axios.post('http://cdn.david-cyril.net.ng/upload', formData, {
            headers: { ...formData.getHeaders() }
        });

        fs.unlinkSync(filePath); // Delete file after upload

        if (response.data.success && response.data.files.length > 0) {
            return {
                success: true,
                url: response.data.files[0].url,
                size: response.data.files[0].size,
                name: `${fileName}.${fileType}`
            };
        } else {
            return { success: false, error: 'Upload failed' };
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
}

module.exports = { davidcyCdn };