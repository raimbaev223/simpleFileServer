const router = require('express').Router();
const fs = require('fs');
const fileExtension = require('file-extension');
const mime = require('mime-types');

const FileModel = require('../../models/file');

router.post('/upload', (req, res) => {

    if (!req.files) {
        return res.status(400).send({
            data: {
                errorMessage: 'FILE_IS_NOT_SET',
                error: null
            }
        });
    }

    const fileName = new Date().getTime().toString();
    const extension = fileExtension(req.files[''].name);
    const fileNameWithExtension = fileName + '.' + extension;

    fs.writeFile('./data/' + fileNameWithExtension, req.files[''].data, err => {

        if (err) {
            return res.status(500).send({
                data: {
                    errorMessage: 'ERROR_WHILE_WRITE_FILE',
                    error: err
                }
            });
        }

        const fileModel = new FileModel({
            fileName: fileNameWithExtension,
            originalName: req.files[''].name,
            size: req.files[''].size,
            uploaded: new Date().getTime(),
            mime: mime.lookup(req.files[''].name),
            isActive: true
        });

        fileModel.save(error => {

            if (error) {
                console.log(error);
                return res.status(400).send({
                    data: {
                        errorMessage: 'ERROR_WHILE_SAVE_FILE_INFO',
                        error
                    }
                });
            }

            res.send({
                data: {
                    file: [fileModel['_id'], fileModel['fileName'], fileModel['originalName'], fileModel['mime']]
                }
            });

        });

    });

});

module.exports = router;