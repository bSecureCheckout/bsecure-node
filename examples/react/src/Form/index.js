import React from "react";

import bSecure from 'bsecure'
import { useToasts } from 'react-toast-notifications'
import {
  AppBar,
  TextField,
  Button,
} from "@mui/material";
import './form.css'
import {
  HELPER
} from "../util"

const initialFormData = {
  name: "Default user",
  country_code: "92",
  phone: "3333333333",
  email: "test@test.com",

  order_id: "",
  sub_total: "500",
  discount: "50",
  total: "450",
  client_id: "",
  client_secret: "",
  client_env: "live",
}

let bsecure 

export default function Form() {
  const { addToast } = useToasts();

  const [formData, updateFormData] = React.useState(initialFormData);
  const handleChange = (e) => {
    updateFormData({
      ...formData,
      [e.target.name]: e.target.value.trim()
    });
  };

  

  const getAccesToken = async () => {
    let result = await bsecure.authorize();
    console.log(result)
    const { access_token } = result;
    if(HELPER.isEmpty(access_token)){
      addToast(result?.message, { appearance: 'error' });
    }else{
      processOrder()
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    bsecure = new bSecure({
      client_id: formData.client_id,
      client_secret: formData.client_secret,
      environment: formData.client_env,
    });
    getAccesToken();
  }; 

  const processOrder = async() => {
    const customer = {
      "name": formData?.name,
      "email": formData?.email,
      "country_code": formData?.country_code,
      "phone_number": formData?.phone_number,
    };
    const products = [
      {
      "id": "1",
      "name": "product-name",
      "sku": "product-sku",
      "quantity": 1,
      "price": formData?.sub_total,
      "sale_price": formData?.sub_total,
      "image": "product-image",
      "description": "product-description",
      "short_description": "product-short-description"
      }
    ];
    const charges = {
        "sub_total" : formData?.sub_total,
        "discount" : formData?.discount,
        "total" : formData?.total,
    }
    const order = bsecure.Order;
    order.setOrderId(formData?.order_id)
    order.setCharges(charges);
    order.setCustomer(customer);
    order.setCartItems(products);
    let result = await order.createOrder();
    const { checkout_url } = result.body;
    if(!HELPER.isEmpty(checkout_url)){
      window.open(checkout_url, '_blank');
    }else{
      addToast(result?.message, { appearance: 'error' });
    }
    return result;
  }

  return (
    <div className="Form">
      <AppBar>
        <h3>bSecure</h3>
      </AppBar>
      <form style={{ marginTop: 80, marginBottom: 20 }}>
        <div className="heading">Customer Detail</div>
        <div className="customer-info">
          <TextField onChange={handleChange} required defaultValue={formData?.name} label="Name" name="name" variant="outlined" />
          <TextField onChange={handleChange} required defaultValue={formData?.country_code} label="Country Code" name="country_code" variant="outlined" />
          <TextField onChange={handleChange} required defaultValue={formData?.phone} label="Phone" name="phone" variant="outlined" />
          <TextField onChange={handleChange} required defaultValue={formData?.email} label="Email" name="email" variant="outlined" />
        </div>
        <br />
        <div className="heading">Order Detail</div>
        <div className="order-info">
          <TextField onChange={handleChange} required defaultValue={formData?.order_id} label="Ordre id" name="order_id" variant="outlined" />
          <TextField onChange={handleChange} required defaultValue={formData?.sub_total} label="Subtotal amount" name="sub_total" variant="outlined" />
          <TextField onChange={handleChange} required defaultValue={formData?.discount} label="Discount" name="discount" variant="outlined" />
          <TextField onChange={handleChange} required defaultValue={formData?.total} label="Total amount" name="total" variant="outlined" />
        </div>
        <br />
        <div className="heading">Merchant Detail</div>
        <div className="order-info">
          <TextField onChange={handleChange} required defaultValue={formData?.client_id} label="Client ID" name="client_id" variant="outlined" />
          <TextField onChange={handleChange} required defaultValue={formData?.client_secret} label="Client Secret" name="client_secret" variant="outlined" />
          <TextField onChange={handleChange} required defaultValue={formData?.client_env} label="Client Environment" name="client_env" variant="outlined"  />
        </div>

        <Button type="button" variant="contained" color="primary" onClick={handleSubmit}>
          Pay via bsecure
        </Button>
      </form>
    </div>
  );
}
