const categoryIdPopulate = {
  path: 'categoryId',
  populate: [
    {
      path: 'createdBy',
    },
  ],
};

const subCategoryIdPopulate = {
  path: 'subCategoryId',
  populate: [categoryIdPopulate],
};

const brandIdPopulate = {
  path: 'brandId',
};

const vendorIdPopulate = {
  path: 'vendorId',
};

export const ProductPopulate = {
  subCategoryIdPopulate,
  brandIdPopulate,
  vendorIdPopulate,
};

export const ProductCartPopulate = [
  {
    path: 'products.productId',
    populate: Object.values(ProductPopulate),
  },
  { path: 'products.vendorId' },
];

const userIdPopulate = {
  path: 'userId',
};

const createdByPopulate = {
  path: 'createdBy',
};
export const CartPopulate = { ProductCartPopulate, userIdPopulate };

export const OrderPopulate = { ProductCartPopulate, createdByPopulate };

export const vendorOrderPopulate = {
  path: 'orders',
  populate: [
    {
      path: 'orderId',
      populate: Object.values(OrderPopulate),
    },
    {
      path: 'productId',
      populate: Object.values(ProductPopulate),
    },
  ],
};

export const vendorSalesPopulate = {
  vendorOrderPopulate,
  userIdPopulate,
};
