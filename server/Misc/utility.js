module.exports = {
    getUploadErrorMessage: (code) => {
        switch(code) {
            case UPLOAD_ERR_INI_SIZE:
                return result = {
                    reason: 'upload_err_ini_size',
                    message: 'The uploaded file exceeds the UPLOAD_MAX_FILESIZE'
                };
            case UPLOAD_ERR_FORM_SIZE:
                return result = {
                    reason: 'upload_err_form_size',
                    message: 'The uploaded file exceeds the MAX_FILE_SIZE'
                };
            case UPLOAD_ERR_PARTIAL:
                return result = {
                    reason: 'upload_err_partial',
                    message: 'The uploaded file was only partially uploaded'
                };
            case UPLOAD_ERR_NO_FILE:
                return result = {
                    reason: 'upload_err_no_file',
                    message: 'No file was uploaded'
                };
            case UPLOAD_ERR_NO_TMP_DIR:
                return result = {
                    reason: 'upload_err_no_tmp_dir',
                    message: 'Missing a temporary folder'
                };
            case UPLOAD_ERR_CANT_WRITE:
                return result = {
                    reason: 'upload_err_cant_write',
                    message: 'Failed to write file to disk.'
                };
            case UPLOAD_ERR_EXTENSION:
                return result = {
                    reason: 'upload_err_extension',
                    message: 'Invalid uploaded file extension.'
                };
        }
    },
    readableBytes: (bytes) => {
        var sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        var index = Math.floor(Math.log(bytes) / Math.log(1024));

        return `${bytes / Math.pow(1024, index)} ${sizes[index]}`;
    },
    generateUniqueId: (length) => {
        var intLength = parseInt(length) / 2;

        if (intLength <= 0) {
            throw new Error('Length must be greater than 0');
        };
        
        var uniqueID = '';
        const characters = '0123456789abcdef';
        for (let i = 0; i < (intLength * 2); i++) {
            uniqueID += characters[Math.floor((Math.random() * characters.length) - 1)];
        };

        return uniqueID;
    }
}