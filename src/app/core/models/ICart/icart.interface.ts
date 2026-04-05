export interface ICart {
  _id:            string;
  cartOwner:      string;
  products:       ProductElement[];
  createdAt:      Date;
  updatedAt:      Date;
  __v:            number;
  totalCartPrice: number;
}

export interface ProductElement {
  count:   number;
  _id:     string;
  product: ProductProduct;
  price:   number;
}

export interface ProductProduct {
  subcategory:    Brand[];
  _id:            string;
  title:          string;
  slug:           string;
  quantity:       number;
  imageCover:     string;
  category:       Brand;
  brand:          Brand;
  ratingsAverage: number;
  id:             string;
}

export interface Brand {
  _id:       string;
  name:      string;
  slug:      string;
  image?:    string;
  category?: Category;
}

export enum Category {
  The6439D58A0049Ad0B52B9003F = "6439d58a0049ad0b52b9003f",
  The6439D5B90049Ad0B52B90048 = "6439d5b90049ad0b52b90048",
}
