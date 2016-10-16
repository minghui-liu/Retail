var superagent = require('superagent');
var _ = require('underscore');

module.exports = function() {
  var url = 'http://openexchangerates.org/api/latest.json?app_id=' + 
    process.env.OPEN_EXCHANGE_RATES_KEY;
  var rates = {
    USD: 1,
    EUR: 1.1,
    GBP: 1.5
  };

  var ping = function(callback) {
    superagent.get(url, function(error, res) {
      // If error, ignore since we will try again an hour later
      if (error) {
        if (callback) {
          callback(error);
        }
        return;
      }

      var results;
      try {
        var results = JSON.parse(res.text);
        _.each(results.rates || {}, function(value, key) {
          rates[key] = value;
        });
        if (callback) {
          callback(null, rates);
        }
      } catch (e) {
        if (callback) {
          callback(e);
        }
      }
    });
  };

  setInterval(ping, 60 * 60 * 1000); // Every hour

  // Return current state of exchange rates
  var ret = function() {
    return rates;
  };
  ret.ping = ping;
  return ret;
};