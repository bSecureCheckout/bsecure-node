let config = {
  client_id: "<client-id>",
  client_secret: "<client-secret>",
  environment: "<app-environment>",
};
const bsecure = require("bsecure")(config);

// --------------------
// Checkout Button
// --------------------

bsecure
  .authorize()
  .then((response) => {
    const checkout_btn = bsecure.getCheckoutButton();
    return checkout_btn;
  })
  .catch((error) => console.error(error));

// --------------------
// bSecure Checkout
// --------------------

/**
 * Function: Create Order
 * CREATE ORDER
 */
bsecure
  .authorize()
  .then((response) => {
    createOrder();
  })
  .catch((error) => console.error(error));

/**
 * Function: Order Updates / Callback on Order Placement
 * ORDER STATUS
 */
bsecure
  .authorize()
  .then((response) => {
    orderStatus();
  })
  .catch((error) => console.error(error));

// --------------------
// bSecure Single Sign On
// --------------------

/**
 * Function: Authenticate Client
 * Authentication for redirecting users to OAuth provider
 */
authenticateClient();

/**
 * Function: Get Customer Profile
 * Get customer profile after client authorization
 */
bsecure
  .authorize()
  .then((response) => {
    customerProfile();
  })
  .catch((error) => console.error(error));

function createOrder() {
  try {
    let order = bsecure.Order;
    order.setOrderId("<order-id>");
    order.setCharges("<order-charges>");
    order.setCustomer("<customer-object>");
    order.setCartItems("<cart-items>");
    order.setShipmentDetails("<shipment-object>");
    var initializePromise = order.createOrder();
    return initializePromise.then(
      function (result) {
        return result;
      },
      function (err) {
        throw new Error(err);
      }
    );
  } catch (err) {
    throw new Error(err);
  }
}

function orderStatus() {
  try {
    let status = bsecure.OrderStatus;
    status.setOrderRef("<order-reference>");
    var initializePromise = status.getStatus();
    return initializePromise.then(
      function (result) {
        return result;
      },
      function (err) {
        throw new Error(err);
      }
    );
  } catch (err) {
    throw new Error(err);
  }
}

function authenticateClient() {
  try {
    let state = "<state>";
    let status = bsecure.SingleSignOn;
    return status.authenticateClient(state);
  } catch (err) {
    throw new Error(err);
  }
}

function customerProfile() {
  try {
    let code = "<auth-code>";
    let status = bsecure.SingleSignOn;
    var initializePromise = status.getCustomerProfile(code);
    return initializePromise.then(
      function (result) {
        return result;
      },
      function (err) {
        throw new Error(err);
      }
    );
  } catch (err) {
    throw new Error(err);
  }
}
