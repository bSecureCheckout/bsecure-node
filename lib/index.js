"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});

var _createClass = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var Api = require("./helpers/apis");
var AuthToken = require("./resources/authentication");
var _require = require("./utils/general"),
  isEmpty = _require.isEmpty;

var bSecure = (function () {
  function bSecure(options) {
    _classCallCheck(this, bSecure);

    this.api = this.createClient(options);
    this.addResources();
  }

  _createClass(bSecure, [
    {
      key: "createClient",
      value: function createClient(_ref) {
        var environment =
            isEmpty(_ref) || isEmpty(_ref.environment)
              ? null
              : _ref.environment,
          client_id =
            isEmpty(_ref) || isEmpty(_ref.client_id) ? null : _ref.client_id,
          client_secret =
            isEmpty(_ref) || isEmpty(_ref.client_secret)
              ? null
              : _ref.client_secret;
        return new Api({
          environment: environment,
          client_id: client_id,
          client_secret: client_secret,
          access_token: null,
          checkout_btn: null,
        });
      },
    },
    {
      key: "authorize",
      value: function authorize() {
        var _this = this;

        return AuthToken(this.api)
          .generate()
          .then(function (response) {
            _this.api = response;
            _this.addResources();
            return response;
          })
          .catch(function (error) {
            return error;
          });
      },
    },
    {
      key: "getCheckoutButton",
      value: function getCheckoutButton() {
        return this.api.checkout_btn;
      },
    },
    {
      key: "addResources",
      value: function addResources() {
        Object.assign(this, {
          Order: require("./resources/Checkout/order_create")(this.api),
          OrderStatus: require("./resources/Checkout/order_status")(this.api),
          SingleSignOn: require("./resources/SSO/client-authenticate")(
            this.api
          ),
        });
      },
    },
  ]);

  return bSecure;
})();

function bsecure(options) {
  return new bSecure(options);
}

module.exports = bSecure;

module.exports = bsecure;
