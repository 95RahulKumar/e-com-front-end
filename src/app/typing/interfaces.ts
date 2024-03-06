import { TemplateRef } from '@angular/core';
import { messageTypeEnum } from './enum';

export interface menuInterface {
  text: string;
  link: string;
  submenu?: Array<submenu>;
  isActive: boolean;
}
export interface submenu {
  text: string;
  link: string;
  isActive: boolean;
}
export interface DialogData {
  title: string;
  message: string;
  type?: messageTypeEnum;
  template?: TemplateRef<any>;
  className?: messageTypeEnum;
  hidebtn?: boolean;
}

export interface IUserRegistration {
  name: string;
  email: string;
  password: string;
}

export interface IUserLogin {
  email: string;
  password: string;
}
export interface IForgotPaassword {
  email: string;
}
export interface ICategories {
  title: string;
  icon: string;
}

export interface IProducts {
  serial_no: number;
  category: string;
  createdAt: string;
  description: string;
  image: Array<IProductsImage>;
  name: string;
  numOfReviews: number;
  price: number;
  rating: number;
  ratings: number;
  reviews: Array<IProductsReview>;
  stock: number;
  user: string;
  _id: string;
}
export interface IProductsImage {
  public_id: string;
  url: string;
  _id: string;
}
export interface IProductsReview {
  user: string;
  name: string;
  rating: number;
  comment: string;
}

export interface IUsers {
  avatar: IAvatar;
  _id: string;
  name: string;
  email: string;
  role: string;
}
export interface IAvatar {
  public_id: string;
  url: string;
}

export interface IOrderDetails {
  shipingInfo: IOrderAddress;
  paymentInfo: IPaymentInfo;
  _id: string;
  orderItems: Array<IOrderItem>;
  user: ICustomer;
  paidAt: string;
  itemsPrice: number;
  taxPrice: number;
  shipingPrice: number;
  totalPrice: number;
  orderStatus: string;
  createdAt: string;
}

export interface IOrderAddress {
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: number;
  phoneNumber: number;
}

export interface IPaymentInfo {
  id: string;
  status: string;
}

export interface IOrderItem {
  name: string;
  price: number;
  quantity: number;
  image: string;
  product: string;
  _id: string;
}

export interface ICustomer {
  _id: string;
  name: string;
  email: string;
}
export interface IOrderStatus {
  status: string;
}

export interface ISocketMessage {
  name: string;
  role: string;
  message: string;
}

export interface ISocketReturnMsg {
  name: string;
  role: string;
  message: string;
  date: string;
}
export interface IFinalCahtData {
  date: string;
  messages: Array<IChatMsg>;
}

export interface IChatMsg {
  _id?: string;
  name: string;
  role: string;
  message: string;
  date: string; // Timestamp for Sun Oct 01 2023 23:29:46 GMT+0530 (India Standard Time)
  __v?: number;
}
