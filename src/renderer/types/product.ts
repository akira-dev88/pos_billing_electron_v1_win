export type Product = {
  product_uuid: string;
  name: string;
  price: number;
  gst_percent?: number;
  stock?: number;
  barcode?: string;
  sku?: string;
};