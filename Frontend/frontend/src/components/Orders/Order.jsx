import React from "react";

const Order = props => {
  return (
    <div className="layout-inline row">
      <div className="col col-pro layout-inline">
        <h3>{props.orderid}</h3>
      </div>

      {/* <div className="col col-price col-numeric align-center ">
        <p>${props.totalamount}</p>
      </div> */}

      <div className="col col-qty layout-inline">
        <h1>{props.totalitems}</h1>
      </div>

      <div className="col col-total col-numeric">
        {" "}
        <p> ${props.totalamount}</p>
      </div>
      <div className="col col-vat col-numeric" />
    </div>
  );
};

export default Order;
