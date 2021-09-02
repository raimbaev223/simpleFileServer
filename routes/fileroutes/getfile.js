const router = require('express').Router();
const fs = require('fs');

const fileModel = require('../../models/file');
const FileResponse = require('../../models/response/file');

router.get('/file/:id', (req, res) => {

    const fileId = req.params.id;

    fileModel.findById(fileId, (err, result) => {

        if (err) {
            return res.status(500).send({
                data: {
                    errorMessage: 'ERROR_WHILE_FIND_FILE',
                    error: err
                }
            });
        }

        if (!result || !result.isActive) {
            return res.status(404).send({
                data: {
                    errorMessage: 'FILE_NOT_FOUND',
                    error: null
                }
            });
        }

        sendFile(res, result);

    });

});


function sendFile(res, result) {

    res.setHeader('Content-Type', result.mime);

    const fileName = './data/' + result.fileName;
    const file = fs.createReadStream(fileName);
    file.pipe(res);

    file.on('error', (error) => {
        res.status(500).send({
            data: {
                errorMessage: 'ERROR_WHILE_SENDING_FILE',
                error
            }
        });
    });

    file.on('open', () => {
        console.log(fileName + 'file opened');
    });

    file.on('close', () => {
        console.log(fileName + 'file closed');
    });

    res.on('close', () => {
        file.destroy();
    });

}

function callback(err, result, res) {

    if (err) {
        return res.status(400).send({
            data: {
                errorMessage: 'INTERNAL_SERVER_ERROR',
                error: err
            }
        });
    }

    if (!result || isEmpty(result)) {
        return res.status(404).send({
            data: {
                errorMessage: 'FILE_NOT_FOUND',
                error: null
            }
        });
    }

    if (result.length !== 1) {

        let fileResponse = [];

        for (let i = 0; i < result.length; i++) {
            fileResponse[i] = new FileResponse(result[i]._id, result[i].fileName, result[i].originalName, result[i].mime);
        }

        res.send({
            data: {
                result: fileResponse
            }
        });

    }
    else {
        sendFile(res, result[0]);
    }

}

function isEmpty(obj) {
    for (const key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

module.exports = router;