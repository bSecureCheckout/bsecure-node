<p align="center">
  <img src="https://bsecure-dev.s3-eu-west-1.amazonaws.com/dev/react_app/assets/secure_logo.png" width="400px" position="center">
</p>

[![NPM](https://nodei.co/npm/bsecure.png?mini=true)](https://nodei.co/npm/bsecure/)
[![npm version](https://badge.fury.io/js/bsecure.svg)](https://badge.fury.io/js/bsecure)
[![Build Status](https://scrutinizer-ci.com/g/bSecureCheckout/bsecure-node/badges/build.png?b=master)](https://scrutinizer-ci.com/g/bSecureCheckout/bsecure-node/build-status/master)
[![Code Coverage](https://scrutinizer-ci.com/g/bSecureCheckout/bsecure-node/badges/coverage.png?b=master)](https://scrutinizer-ci.com/g/bSecureCheckout/bsecure-node/?branch=master)
[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/bSecureCheckout/bsecure-node/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/bSecureCheckout/bsecure-node/?branch=master)

# bSecure Checkout

Pakistan's first universal checkout solution that is easy and simple to integrate on your e-commerce store.

### About bSecure Checkout

It gives you an option to enable _universal-login_, _two-click checkout_ and accept multiple payment method for your customers, as well as run your e-commerce store hassle free.\
It is built for _desktop_, _tablet_, and _mobile devices_ and is continuously tested and updated to offer a frictionless payment experience for your e-commerce store.

### Installation

You can install the package via **npm**

`npm install bsecure --save`

#### Getting Your Credentials

1. Go to [Builder Portal](https://builder.bsecure.pk/)
2. [App Integration](https://builder.bsecure.pk/integration-sandbox) >> Sandbox / Live
3. Select Environment Type (Custom Integration)
4. Fill following fields:\
   a. _Store URL_ its required in any case\
   b. _Login Redirect URL_ Required for feature **Login with bSecure**\
   c. _Checkout Redirect URL_ Required for feature **Pay with bSecure**\
   d. _Checkout Order Status webhook_ Required for feature **Pay with bSecure**
5. Save your client credentials (Client ID and Client Secret)
6. Please make sure to keep credentials at safe place in your code

### Configuration

The package can be initialized with below mentioned options:

```JavaScript
let config = {
  client_id: "YOUR-CLIENT-ID",
  client_secret: "YOUR-CLIENT-SECRET",
  environment: "YOUR-APP-ENVIRONMENT",
};
```

## Usage

The package needs to be configured with your account's credentials, which is available in the bSecure [Builder Portal](https://builder.bsecure.pk/):

```JavaScript
const bSecure = require("bsecure");
let bsecure = new bSecure(config);
    bsecure.authorize()
    .then(response => console.log(response))
    .catch(error => console.error(error));
```

Or using,

```JavaScript
const bsecure = require("bsecure")(config);
    bsecure.authorize()
    .then(response => console.log(response))
    .catch(error => console.error(error));
```

Or using ES modules and async/await:

```JavaScript
import bSecure from 'bsecure';

(async () => {
  try {
    const token = await bsecure.authorize(config);
    console.log(token);
  } catch (error) {
    console.error(error);
  }
})();

```

## bSecure Checkout

#### Create Order

To create an order you should have an order_id, customer and products object parameters that are to be set before creating an order.

##### Create Order Request Params:

###### Product Object:

Products object should be in below mentioned format:

```
"products": [
  {
  "id": "product-id",
  "name": "product-name",
  "sku": "product-sku",
  "quantity": 0,
  "price": 0,
  "sale_price": 0,
  "image": "product-image",
  "description": "product-description",
  "short_description": "product-short-description"
  }
]
```

###### Shipment Object

Shipment object should be in below mentioned format:

> 1- If the merchant want his pre-specified shipment method then he should pass shipment method detail in below mentioned format:

```
"shipment": {
  "charges": "numeric",
  "method_name": "string"
}
```

###### Charges Object

Order charges object should be in below mentioned format:

```
"order_charge" : {
  "sub_total" : "float",
  "discount" : "float",
  "total" : "float",
}
```

###### Customer Object

Customer object should be in below mentioned format:

> 1- If the customer has already signed-in via bSecure into your system and you have auth-code for the customer you can
> just pass that code in the customer object no need for the rest of the fields.

> 2- Since all the fields in Customer object are optional, if you don’t have any information about customer just pass the
> empty object, or if you have customer details then your customer object should be in below mentioned format:

```
"customer": {
  "name": "string",
  "email": "string",
  "country_code": "string",
  "phone_number": "string",
}
```

#### Create Order

```JavaScript

(async () => {
  try {
    let order = bsecure.Order;
    order.setOrderId('<ORDER-ID>');
    order.setCharges('<ORDER-CHARGES>');
    order.setCustomer('<CUSTOMER-OBJECT>');
    order.setCartItems('<PRODUCT-OBJECT>');
    order.setShipmentDetails('<SHIPMENT-OBJECT>');
    let result = await order.createOrder();
    return result;
  } catch (err) {
    throw new Error(err)  }
})();

```

In response createOrder(), will return order expiry, checkout_url, order_reference and merchant_order_id.

```
{
  "expiry": "2020-11-27 10:55:14",
  "checkout_url": "bsecure-url",
  "order_reference": "bsecure-reference",
  "merchant_order_id": "your-order-id",
}
```

> You have recieved bsecure order link now simply redirect the user to checkout_url

```Javascript
window.location.href = "http://bsecure-url";
```

When order is created successfully on bSecure, you will be redirected bSecure checkout app where you will process your checkout.

#### Callback on Order Placement

Once the order is successfully placed, bSecure will redirect the customer to the url you mentioned in “Checkout
redirect url” in your [environment settings](https://builder.bsecure.pk/) in Builders Portal, with one additional param “order_ref” in the query
string.

#### Order Updates

By using order_ref you received in the "**[Callback on Order Placement](#callback-on-order-placement)**" you can call below method to get order details.

```JavaScript

(async () => {
  try {
    let order = bsecure.OrderStatus;
    order.setOrderRef("<ORDER-REFERENCE>");
    let result = await order.getStatus();
    return result;
  } catch (err) {
    throw new Error(err)  }
})();

```

#### Order Status Change Webhook

Whenever there is any change in order status or payment status, bSecure will send you an update with complete
order details (contents will be the same as response of _[Order Updates] on the URL you mentioned in \_Checkout Order Status webhook_ in your environment settings in Builders Portal. (your webhook must be able to accept POST request).

In response of "**[Callback on Order Placement](#callback-on-order-placement)**" and "**[Order Updates](#order-updates)**" you will recieve complete details of your order in below mentioned format:

```
{
  "status": 200,
  "message": [
    "Request Successful"
  ],
  "body": {
    "merchant_order_id": "your-order-id",
    "order_ref": "bsecure-order-reference",
    "order_type": "App/Manual/Payment gateway",
    "placement_status": "6",
    "payment_status": null,
    "customer": {
      "name": "",
      "email": "",
      "country_code": "",
      "phone_number": "",
      "gender": "",
      "dob": ""
    },
    "payment_method": {
      "id": 5,
      "name": "Debit/Credit Card"
    },
    "card_details": {
      "card_type": null,
      "card_number": null,
      "card_expire": null,
      "card_name": null
    },
    "delivery_address": {
      "country": "",
      "province": "",
      "city": "",
      "area": "",
      "address": "",
      "lat": "",
      "long": ""
    },
    "shipment_method": {
      "id": 0,
      "name": "",
      "description": "",
      "cost": 0
    },
    "items": [
      {
        "product_id": "",
        "product_name": "",
        "product_sku": "",
        "product_qty": ""
      },
    ],
    "created_at": "",
    "time_zone": "",
    "summary": {
      "total_amount": "",
      "sub_total_amount": "",
      "discount_amount": "",
      "shipment_cost": "",
      "merchant_service_charges": ""
    }
  },
  "exception": null
}

```

### Managing Orders and Payments

#### Payment Status

| ID  | Value     | Description                                                         |
| :-: | :-------- | :------------------------------------------------------------------ |
|  0  | Pending   | Order received, no payment initiated.Awaiting payment (unpaid).     |
|  1  | Completed | Order fulfilled and complete. Payment also recieved.                |
|  2  | Failed    | Payment failed or was declined (unpaid) or requires authentication. |

#### Order Status

| ID  | Value                 | Description                                                                                                                       |
| :-: | :-------------------- | :-------------------------------------------------------------------------------------------------------------------------------- |
|  1  | Created               | A customer created an order but not landed on bsecure                                                                             |
|  2  | Initiated             | Order is awaiting fulfillment.                                                                                                    |
|  3  | Placed                | Order fulfilled and complete Payment received. Order is awaiting fulfillment. – requires no further action                        |
|  4  | Awaiting Confirmation | Awaiting action by the customer to authenticate the transaction.                                                                  |
|  5  | Canceled              | Canceled by an admin or the customer.                                                                                             |
|  6  | Expired               | Orders that were not fulfilled within a pre-specified timeframe. timeframe                                                        |
|  7  | Failed                | Payment failed or was declined (unpaid).Note that this status may not show immediately and instead show as Pending until verified |
|  8  | Awaiting Payment      | Order received, no payment initiated. Awaiting payment (unpaid)                                                                   |

## bSecure Single Sign On (SSO)

### Routing

Next, you are ready to authenticate users! You will need two routes: one for redirecting the user to the OAuth provider, and another for receiving the customer profile from the provider after authentication.

### Authenticate Client

> If you are using a web-solution then use below method

```JavaScript

(async () => {
  try {
    let status = bsecure.SingleSignOn;
    let result = await status.authenticateClient("<STATE>");
    return result;
  } catch (err) {
    throw new Error(err)  }
})();

```

In response, authenticateWebClient will return auth_url, then simply redirect the user to auth_url

```
{
  "auth_url": "your-authentication-url"
}
```

### Client Authorization

On Successful Authorization,\
bSecure will redirect to Login redirect url you provided when setting up environment in Builder's portal, along
with two parameters in query string: **code** and **state**

```
eg: https://my-store.com/sso-callback?code=abc&state=xyz
```

code recieved in above callback is cutsomer's auth_code which will be further used to get customer profile.

#### Verify Callback

Verify the state you received in the callback by matching it to the value you stored in DB before sending the client authentication
request, you should only proceed if and only if both values match.

### Get Customer Profile

Auth_code recieved from **Client Authorization** should be passed to method below to get customer profile.

```JavaScript
(async () => {
  try {
    let status = bsecure.SingleSignOn;
    let result = await status.getCustomerProfile("<AUTH-CODE>");
    return result;
  } catch (err) {
    throw new Error(err)  }
})();

```

In response, it will return customer name, email, phone_number, country_code, address book.

```
{
    "name": "customer-name",
    "email": "customer-email",
    "phone_number": "customer-phone-number",
    "country_code": "customer-phone-cod",
    "address":
      {
        "country": "",
        "state": "",
        "city": "",
        "area": "",
        "address": "",
        "postal_code": "",
      },
}
```

### Changelog

Please see [CHANGELOG](CHANGELOG.md) for more information what has changed recently.

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.

## Contributions

**"bSecure – Your Universal Checkout"** is open source software.
