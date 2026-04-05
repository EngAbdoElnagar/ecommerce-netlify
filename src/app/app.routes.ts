import { guestGuard } from './core/guards/guest/guest-guard';
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth/auth-guard';

export const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  { 
    path: "home", 
    loadComponent: () => import('./features/home/home.component').then(c => c.HomeComponent), 
    title: "Home" 
  },
  { 
    path: "suppourt", 
    loadComponent: () => import('./features/suppourt/suppourt.component').then(c => c.SuppourtComponent), 
    title: "suppourt" 
  },
  { 
    path: "profile", 
    loadComponent: () => import('./features/profile/profile.component').then(c => c.ProfileComponent), 
    title: "profile",
    canActivate:[authGuard],
    children: [
      { path: "", redirectTo: "addresses", pathMatch: "full" },
      {
        path: "addresses",
        loadComponent: () => import('./features/addresses/addresses.component').then(c => c.AddressesComponent),
        title: "My Addresses"
      },
      {
        path: "settings",
        loadComponent: () => import('./features/settings/settings.component').then(c => c.SettingsComponent),
        title: "Settings"
      },
    ]
  },
  { 
    path: "products", 
    loadComponent: () => import('./features/products/products.component').then(c => c.ProductsComponent), 
    title: "products" 
  },
  { 
    path: "products/:id", 
    loadComponent: () => import('./features/products/products.component').then(c => c.ProductsComponent), 
    title: "products" 
  },
  { 
    path: "checkout/:id", 
    loadComponent: () => import('./features/checkout/checkout.component').then(c => c.CheckoutComponent), 
    title: "Checkout" ,
    canActivate:[authGuard],
  },
  { 
    path: "allorders", 
    loadComponent: () => import('./features/allorders/allorders.component').then(c => c.AllordersComponent), 
    title: "allorders",
    canActivate:[authGuard],
  },
  { 
    path: "product-details/:id/:slug", 
    loadComponent: () => import('./features/product-delails/product-delails.component').then(c => c.ProductDelailsComponent), 
    title: "Details" 
  },
  { 
    path: "categories", 
    loadComponent: () => import('./features/categories/categories.component').then(c => c.CategoriesComponent), 
    title: "Categories" 
  },
  { 
    path: "subCategories/:id", 
    loadComponent: () => import('./features/sub-categories/sub-categories.component').then(c => c.SubCategoriesComponent), 
    title: "subCategories" 
  },
  { 
    path: "brands", 
    loadComponent: () => import('./features/brands/brands.component').then(c => c.BrandsComponent), 
    title: "Brands" 
  },
  { 
    path: "suppot", 
    loadComponent: () => import('./features/suppourt/suppourt.component').then(c => c.SuppourtComponent), 
    title: "Support" 
  },
  { 
    path: "wishlist", 
    loadComponent: () => import('./features/wishlist/wishlist.component').then(c => c.WishlistComponent), 
    title: "Wishlist",
    canActivate:[authGuard]
  },
  { 
    path: "cart", 
    loadComponent: () => import('./features/cart/cart.component').then(c => c.CartComponent), 
    title: "Cart" ,
    canActivate:[authGuard]
  },
  { 
    path: "login", 
    loadComponent: () => import('./core/auth/login/login.component').then(c => c.LoginComponent), 
    title: "Login",
    canActivate:[guestGuard]
  },
  { 
    path: "register", 
    loadComponent: () => import('./core/auth/register/register.component').then(c => c.RegisterComponent), 
    title: "Register",
    canActivate:[guestGuard]
  },
  { 
    path: "forget-password", 
    loadComponent: () => import('./features/forget-password/forget-password.component').then(c => c.ForgotPasswordComponent), 
    title: "forget-password" 
  },
  { 
    path: "search", 
    loadComponent: () => import('./features/search/search.component').then(c => c.SearchComponent), 
    title: "search" 
  },
  { 
    path: "**", 
    loadComponent: () => import('./features/not-found/not-found.component').then(c => c.NotFoundComponent), 
    title: "FreshCart - Not Found" 
  },
];