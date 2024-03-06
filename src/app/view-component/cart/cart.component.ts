import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  detailExpand,
  fadeIn,
  fadeSlideInOut,
} from 'src/app/animation/animation';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  animations: [fadeIn, detailExpand, fadeSlideInOut],
})
export class CartComponent implements OnInit {
  cartItem: any;
  constructor(private router: Router) {
    this.cartItem = this.router.getCurrentNavigation().extras?.state?.['data'];
    console.log('###', this.cartItem);
  }

  ngOnInit(): void {}
}
