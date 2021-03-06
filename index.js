// Generated by CoffeeScript 1.10.0
(function() {
  var md5;

  md5 = require('md5');

  module.exports = function(app) {
    var addInfo;
    addInfo = function(log, params, next) {
      return log.setNull('url', params.url, function(err) {
        if (err) {
          return next();
        }
        return log.increment("c", function(err) {
          if (err) {
            return next();
          }
          return log.setNull('d', [], function(err) {
            var d, date;
            if (err) {
              return next();
            }
            d = log.get('d');
            if (!d) {
              return next();
            }
            if (!d.length) {
              date = new Date();
              return log.push('d', {
                d: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
                c: 1
              }, next);
            } else {
              return log.increment("d." + (d.length - 1) + ".c", next);
            }
          });
        });
      });
    };
    return app.get('*', function(page, model, params, next) {
      var log, ref, ref1, ref2;
      if (typeof process !== "undefined" && process !== null ? (ref = process.env) != null ? ref.DEBUG : void 0 : void 0) {
        console.log((params != null ? params.url : void 0) + " - " + (page != null ? (ref1 = page.req) != null ? (ref2 = ref1.headers) != null ? ref2['user-agent'] : void 0 : void 0 : void 0));
      }
      if (!(params != null ? params.url : void 0)) {
        return next();
      } else {
        log = model.at("k_logs." + (md5(params.url)));
        return log.subscribe(function(err) {
          if (err) {
            return next();
          } else if (!log.get()) {
            return model.add("k_logs", {
              id: md5(params.url)
            }, function() {
              return addInfo(log, params, next);
            });
          } else {
            return addInfo(log, params, next);
          }
        });
      }
    });
  };

}).call(this);
