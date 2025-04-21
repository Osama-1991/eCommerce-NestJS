interface ICategoryPath {
  folderId: string;
}
interface ISubCategoryPath extends ICategoryPath {
  categoryFolderId: string;
}

interface IProductPath extends ISubCategoryPath {
  subCategoryFolderId: string;
}

export const CategoryPathFolder = ({ folderId }: ICategoryPath): string => {
  return `${process.env.CLOUDINARY_FOLDER}/${process.env.CLOUDINARY_FOLDER_CATEGORY}/${folderId}`;
};

export const BrandPathFolder = ({
  categoryFolderId,
  folderId,
}: ISubCategoryPath): string => {
  return `${CategoryPathFolder({ folderId: categoryFolderId })}/Brand/${folderId}`;
};

export const SubCategoryPathFolder = ({
  categoryFolderId,
  folderId,
}: ISubCategoryPath): string => {
  return `${CategoryPathFolder({ folderId: categoryFolderId })}/SubCategory/${folderId}`;
};

export const ProductPathFolder = ({
  categoryFolderId,
  subCategoryFolderId,
  folderId,
}: IProductPath): string => {
  return `${SubCategoryPathFolder({ categoryFolderId, folderId: subCategoryFolderId })}/product/${folderId}`;
};
