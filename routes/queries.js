var express = require('express');
var request = require('request');
var router = express.Router();

router.use(function logRequest(req, res, next) {
  var t_url = req.query.tournament_url || "";
  var t_sub = req.query.subdomain || "";
  console.log((new Date()).toLocaleTimeString(), req.path, t_sub, t_url);
  next();
});


// Validate the user provided API key to see if the user is the event organizer.
// 200 : User is the organizer.
// XXX : User is not the organizer.
router.get('/validateApiKey', function (req, res) {
  var api_key = req.query.api_key;
  var tournament_url = req.query.tournament_url;
  var subdomain = req.query.subdomain;

  if (subdomain) {
    tournament_url = subdomain + '-' + tournament_url;
  }

  var url = 'https://api.challonge.com/v1/tournaments/' + tournament_url + '.json?api_key=';
  url += api_key;

  request.put(url, function (error, response, body) {
    // 422 = SUCCESS as it indicates we do have authorization to edit the event, but did not specify any changes.
    res.status(response.statusCode == 422 ? 200 : 401).send(body);
  });
});


// LIST ALL TOURNAMENTS
router.get('/getTournaments/', function (req, res) {
  var api_key = req.query.api_key;
  var subdomain = req.query.subdomain;
  var state = req.query.state;

  var url = 'https://api.challonge.com/v1/tournaments.json?api_key=';
  url += api_key;

  if (subdomain) {
    url += '&subdomain=' + subdomain;
  }

  if (state) {
    url += '&state=' + state;
  }

  request.get(url, function (error, response, body) {
    res.send(body);
  });
});


// GET SINGLE TOURNAMENT
router.get('/getTournament/', function (req, res) {
  var api_key = req.query.api_key || CHALLONGE_API_KEY;
  var tournament_url = req.query.tournament_url;
  var subdomain = req.query.subdomain;

  if (subdomain) {
    tournament_url = subdomain + '-' + tournament_url;
  }

  var url = 'https://api.challonge.com/v1/tournaments/' + tournament_url + '.json?api_key=';
  url += api_key;

  request.get(url, function (error, response, body) {
    res.send(body);
  });
});


// LIST ALL TOURNAMENT PARTICIPANTS
router.get('/getTournamentParticipants/', function (req, res) {
  var api_key = req.query.api_key || CHALLONGE_API_KEY;
  var tournament_url = req.query.tournament_url;
  var subdomain = req.query.subdomain;

  if (subdomain) {
    tournament_url = subdomain + '-' + tournament_url;
  }

  var url = 'https://api.challonge.com/v1/tournaments/' + tournament_url + '/participants.json?api_key=';
  url += api_key;

  request.get(url, function (error, response, body) {
    res.send(body);
  });
});


// TURN ON TOURNAMENT ATTACHMENTS
router.get('/tournamentAttachments/', function (req, res) {
  var api_key = req.query.api_key;
  var tournament_url = req.query.tournament_url;
  var subdomain = req.query.subdomain;

  if (subdomain) {
    tournament_url = subdomain + '-' + tournament_url;
  }

  var url = 'https://api.challonge.com/v1/tournaments/' + tournament_url + '.json?api_key=';
  url += api_key;

  request({
    url: url, method: 'PUT', json: {
      "tournament": {
        "accept_attachments": true
      }
    }
  }, function (error, response, body) {
    res.send(body);
  });
});

// LIST ALL TOURNAMENT MATCHES
router.get('/getMatches/', function (req, res) {
  var api_key = req.query.api_key || CHALLONGE_API_KEY;
  var tournament_url = req.query.tournament_url;
  var subdomain = req.query.subdomain;

  if (subdomain) {
    tournament_url = subdomain + '-' + tournament_url;
  }

  var url = 'https://api.challonge.com/v1/tournaments/' + tournament_url + '/matches.json?api_key=';
  url += api_key;


  request.get(url, function (error, response, body) {
    res.send(body);
  });
});

// UPDATE MATCH
router.post('/postMatchResults/', function (req, res) {
  var api_key = req.body.data.api_key;
  var tournament_url = req.body.data.tournament_url;
  var match_id = req.body.data.match_id;
  var score = req.body.data.score;
  var winner_id = req.body.data.winner_id || '';
  var subdomain = req.body.data.subdomain;

  if (subdomain) {
    tournament_url = subdomain + '-' + tournament_url;
  }

  var url = 'https://api.challonge.com/v1/tournaments/' + tournament_url + '/matches/' + match_id + '.json?api_key=';
  url += api_key;

  request({
    url: url, method: 'PUT', json: {
      "match": {
        "scores_csv": score,
        "winner_id": winner_id
      }
    }
  }, function (error, response, body) {
    res.send(body);
  });

});


// GET MATCH STATION
router.get('/getMatchStation/', function (req, res) {
  var api_key = req.query.api_key || CHALLONGE_API_KEY;
  var tournament_url = req.query.tournament_url;
  var match_id = req.query.match_id;
  var subdomain = req.query.subdomain;

  if (subdomain) {
    tournament_url = subdomain + '-' + tournament_url;
  }

  var url = 'https://api.challonge.com/v1/tournaments/' + tournament_url + '/matches/' + match_id + '.json?api_key=';
  url += api_key;
  url += '&include_attachments=1';

  request.get(url, function (error, response, body) {
    res.send(body);
  });
});

// UPDATE MATCH STATION
router.post('/postMatchStation/', function (req, res) {
  var api_key = req.body.data.api_key;
  var tournament_url = req.body.data.tournament_url;
  var match_id = req.body.data.match_id;
  var match_station = req.body.data.match_station || '';
  var station_id = req.body.data.station_id;
  var subdomain = req.body.data.subdomain;
  var get_method = req.body.data.get_method;

  if (subdomain) {
    tournament_url = subdomain + '-' + tournament_url;
  }

  var url = 'https://api.challonge.com/v1/tournaments/' + tournament_url + '/matches/' + match_id + '/attachments';

  if (station_id) {
    url += '/' + station_id;
  }

  url += '.json?api_key=';
  url += api_key;

  request({
    url: url, method: get_method, json: {
      "match_attachment": {
        "description": 'station-' + match_station
      }
    }
  }, function (error, response, body) {
    res.send(body);
  });
});

module.exports = router;