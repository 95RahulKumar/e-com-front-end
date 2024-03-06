export interface IOrdersStatics {
  order_statics: IOrdersDetails;
  total_revenue: number;
}

export interface IOrdersDetails {
  totalOrder: number;
  proccessing: number;
  deleveredOrders: number;
}

export interface IAnaliticsData {
  product_name: Array<string>;
  stock: Array<number>;
}
