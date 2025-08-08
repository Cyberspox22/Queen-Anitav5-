const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function catbox(path) {
    const data = new FormData();
    data.append('reqtype', 'fileupload');
    data.append('userhash', ''); // Optional, can be left blank
    data.append('fileToUpload', fs.createReadStream(path)); // Attach the file

    const config = {
        method: 'POST',
        url: 'https://catbox.moe/user/api.php',
        headers: {
            ...data.getHeaders(), // Correctly retrieve headers from FormData
        },
        data: data, // FormData instance
    };

    try {
        const api = await axios.request(config);
        return { url: api.data.trim() }; // Return the uploaded file URL
    } catch (error) {
        console.error('Error uploading to Catbox:', error.message);
        throw new Error('Failed to upload to Catbox');
    }
}

module.exports = { catbox };