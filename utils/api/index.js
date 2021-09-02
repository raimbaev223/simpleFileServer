const router = require('express').Router();

router.use('', require('../../routes/fileroutes/fileupload'));
router.use('', require('../../routes/fileroutes/getfile'));
router.use('', require('../../routes/fileroutes/updatefile'));

module.exports = router;