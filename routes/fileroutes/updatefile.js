const router = require('express').Router();

const fileModel = require('../../models/file');

router.put('/file/:fileId', (req, res) => {

    const fileId = req.params.fileId;
    const query = req.body;
    fileModel.findByIdAndUpdate(fileId, query,  (err, result) => {

        if (err) {
            return res.status(400).send({
                data: {
                    errorMessage: 'ERROR_WHILE_FIND_FILE',
                    error: err
                }
            });
        }
        if (!result) {
            return res.status(404).send({
                data: {
                    errorMessage: 'FILE_NOT_FOUND',
                    error: null
                }
            });
        }

        result.isActive = false;

        result.save(err => {

            if (err) {
                return res.status(400).send({
                    data: {
                        errorMessage: 'ERROR_WHILE_SAVE_FILE',
                        error: err
                    }
                });
            }

            res.send({
                data: {
                    file: [{fileId: fileId}, query],
                }
            });

        });

    });

});

module.exports = router;