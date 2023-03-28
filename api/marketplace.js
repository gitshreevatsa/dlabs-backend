const router = require('express').Router();

router.route('/').get().post()

router.route('/:id').get().patch().delete()

module.exports = router;