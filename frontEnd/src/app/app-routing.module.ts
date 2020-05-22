import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MyAccountComponent } from './components/my-account/my-account.component';

import { CartComponent } from './components/cart/cart.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ShopComponent } from './components/shop/shop.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'myAccount', component: MyAccountComponent },
  { path: 'cart', component: CartComponent,canActivate:[AuthGuard] },
  { path: 'contactUs', component: ContactUsComponent },
  { path: 'wishlist', component: WishlistComponent, canActivate:[AuthGuard] },
  { path: 'checkout', component: CheckoutComponent, canActivate:[AuthGuard] },
  //{ path: 'shop',  redirectTo: 'shop?category=all', pathMatch: 'full', component: ShopComponent }
  { path: 'shop', component: ShopComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
