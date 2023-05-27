!function(e, t) {
    "object" == typeof exports && "object" == typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(["globals"], t) : "object" == typeof exports ? exports.tw89g = t() : e.tw89g = t()
}(this, (function(globals) {
    var $w = globals.$w
      , elementorySupport = (globals.$ns,
    globals.$widget,
    globals.console,
    globals.elementorySupport)
      , e = globals.generateWebMethodUrl || ((e,t)=>`/_webMethods/${t}/${e}.ajax`);
    return function() {
        var t = {
            363: function(t, o) {
                o.lK = function() {
                    return elementorySupport.getJSON(e("getProfilesList", "backend/accounts/profiles.jsw"), arguments)
                }
            }
        }
          , o = {};
        function n(e) {
            var r = o[e];
            if (void 0 !== r)
                return r.exports;
            var i = o[e] = {
                exports: {}
            };
            return t[e](i, i.exports, n),
            i.exports
        }
        n.r = function(e) {
            "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
                value: "Module"
            }),
            Object.defineProperty(e, "__esModule", {
                value: !0
            })
        }
        ;
        var r = {};
        return function() {
            "use strict";
            n.r(r);
            var e = n(363);
            $w.onReady((function() {
                (0,
                e.lK)().then((function(e) {
                    $w("#perfis1").loadData(e)
                }
                ))
            }
            ))
        }(),
        r
    }()
}
));
//# sourceMappingURL=https://bundler.wix-code.com/a139ae44-3b21-4854-8471-d614b722f4e8/95ce2e84-e891-449e-91e9-24bf5be0d874/a12ce658-02af-49f5-9f17-a4b2bdc4d1fb/pages/tw89g.js.map
