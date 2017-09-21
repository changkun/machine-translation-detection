var express = require('express');
var router = express.Router();

var translate = require('google-translate-api');
var levenshtein = require('fast-levenshtein');

router.post('/translate', function(req, res, next) {

  let src_text = req.body.src_text;
  let src_lang = req.body.src_lang;
  let dst_text = req.body.dst_text;
  let dst_lang = req.body.dst_lang;
  let engine  = req.body.engine;
  console.log(src_text, src_lang, dst_text, dst_lang, engine)

  if (engine === 'google') {
    translate(src_text, {from: src_lang, to: dst_lang}).then(google_res => {
      let google_text = google_res.text;
      let distance = levenshtein.get(dst_text, google_text);
      let score = 1.0 - (distance * 1.0) / Math.max(dst_text.length, google_text.length);
      res.json({
          'engine': 'google',
          'machine_text': google_text,
          'score': score,
      });
    }).catch(err => {
      res.json({'error': err});
    });
  } else {
    res.json({'error': 'only support google translate'});
  }
});

module.exports = router;
