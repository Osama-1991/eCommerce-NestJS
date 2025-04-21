import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto, CreateProductFilesDto } from './dto/create.dto';
import {
  CategoryRepositoryService,
  SubCategoryRepositoryService,
  BrandRepositoryService,
  ReviewRepositoryService,
  ProductRepositoryService,
  IAttachmentType,
  IPagination,
  IProduct,
  IUser,
  ProductPopulate,
  RoleTypes,
} from './../../DB/z_index';
import {
  UploadCloudFileService,
  CodeGenerator,
  ProductPathFolder,
} from 'src/common/z_index';
import {
  ProductIdDto,
  UpdateCategoryImagesDto,
  UpdateProductDto,
} from './dto/update.dto';
import {
  CategoryIdAndSubCategoryIdOptional,
  filter,
  getProductsQueryDto,
  productId,
} from './dto/get.dto';
import { CategoryAndSubCategoryId } from '../sub-category/dto/update.dto';
import { FilterQuery } from 'mongoose';

@Injectable()
export class ProductService {
  constructor(
    private readonly categoryRepositoryService: CategoryRepositoryService,
    private readonly subCategoryRepositoryService: SubCategoryRepositoryService,
    private readonly brandRepositoryService: BrandRepositoryService,
    private readonly uploadCloudFileService: UploadCloudFileService,
    private readonly productRepositoryService: ProductRepositoryService,
    private readonly reviewRepositoryService: ReviewRepositoryService,
  ) {}

  private queryFilter(query: getProductsQueryDto): filter {
    let filter: FilterQuery<IProduct> = {};
    if (query?.name) {
      filter = {
        $or: [
          { name: { $regex: query.name, $options: 'i' } },
          { slug: { $regex: query.name, $options: 'i' } },
        ],
      };
    }

    if (query?.minRate || query?.maxRate) {
      if ((query.minRate ?? 0) >= (query.maxRate ?? Infinity)) {
        throw new BadRequestException('Min rate must be less than Max rate');
      }
      filter = {
        rate: {
          $gte: query.minRate,
          $lt: query.maxRate,
        },
      };
    }
    if (query?.minPrice || query?.maxPrice) {
      if ((query.minPrice ?? 0) >= (query.maxPrice ?? Infinity)) {
        throw new BadRequestException('Min price must be less than Max price');
      }
      filter = {
        finalPrice: {
          $gte: query.minPrice,
          $lt: query.maxPrice,
        },
      };
    }

    if (query?.minDiscount || query?.maxDiscount) {
      if ((query.minDiscount ?? 0) >= (query.maxDiscount ?? Infinity)) {
        throw new BadRequestException(
          'Min discount must be less than Max discount',
        );
      }
      filter = {
        discountPercent: {
          $gte: query.minDiscount,
          $lt: query.minDiscount,
        },
      };
    }

    if (query?.minStockQuantity || query?.maxStockQuantity) {
      if (
        (query.minStockQuantity ?? 0) >= (query.maxStockQuantity ?? Infinity)
      ) {
        throw new BadRequestException('Min stock must be less than Max stock');
      }
      filter = {
        stock: {
          $gte: query.minStockQuantity,
          $lt: query.maxStockQuantity,
        },
      };
    }

    return filter;
  }

  async create(
    user: IUser,
    body: CreateProductDto,
    files: CreateProductFilesDto,
  ): Promise<IProduct> {
    if (!files) {
      throw new NotFoundException('No file uploaded');
    }
    const { categoryId, subCategoryId, brandId } = body;
    const { mainImage, images } = files;

    await this.productRepositoryService.checkProductNameExist(body.name);

    const Category =
      await this.categoryRepositoryService.checkCategoryExistsById(categoryId);
    const SubCategory =
      await this.subCategoryRepositoryService.checkSubCategoryExists({
        _id: subCategoryId,
        categoryId,
      });

    await this.brandRepositoryService.checkBrandExists({
      _id: brandId,
      categoryId,
    });

    const codeG = new CodeGenerator(6);
    const folderId: string = codeG.generateWithNumbers();
    const folder: string = ProductPathFolder({
      categoryFolderId: Category.folderId,
      subCategoryFolderId: SubCategory.folderId,
      folderId,
    });

    let product: IProduct;

    const MainImg: IAttachmentType[] =
      await this.uploadCloudFileService.uploadMultipleFiles(
        mainImage.map((image) => image.path),
        {
          folder,
        },
      );
    let Images: IAttachmentType[] = [];
    if (images.length) {
      Images = await this.uploadCloudFileService.uploadMultipleFiles(
        images.map((image) => image.path),
        {
          folder,
        },
      );
      product = await this.productRepositoryService.create({
        ...body,
        folderId,
        vendorId: user._id,
        categoryId,
        subCategoryId,
        brandId,
        mainImage: MainImg[0],
        images: Images,
      });
    } else {
      product = await this.productRepositoryService.create({
        ...body,
        folderId,
        vendorId: user._id,
        categoryId,
        brandId,
        subCategoryId,
        mainImage: MainImg[0],
      });
    }

    return product;
  }

  async updateProduct(user: IUser, body: UpdateProductDto): Promise<IProduct> {
    const {
      productId,
      name,
      description,
      stock,
      originalPrice,
      discountPercent,
      size,
      color,
      rate,
    } = body;

    const productExist = await this.productRepositoryService.findById({
      id: productId,
    });

    if (!productExist) {
      throw new NotFoundException('Product not found or not created by you');
    }
    if (
      user.role !== RoleTypes.superAdmin &&
      productExist?.vendorId.toString() !== user._id?.toString()
    ) {
      throw new BadRequestException('you cannot update product ');
    }

    const product = await this.productRepositoryService.findByIdAndUpdate({
      id: productId,
      update: {
        name,
        description,
        stock,
        originalPrice,
        discountPercent,
        size,
        color,
        rate,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found or not created by you');
    }

    if (body.brandId) {
      await this.brandRepositoryService.checkBrandExists({
        _id: body.brandId,
        categoryId: product.categoryId,
      });
      product.brandId = body.brandId;
      await product.save();
    }

    return product;
  }

  async updateProductImgs(
    user: IUser,
    body: ProductIdDto,
    files?: UpdateCategoryImagesDto,
  ): Promise<IProduct> {
    if (!files) {
      throw new NotFoundException('No file uploaded');
    }
    const { mainImage, images } = files;
    const { productId } = body;
    const product = await this.productRepositoryService.findById({
      id: productId,
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (
      user.role !== RoleTypes.superAdmin &&
      product?.vendorId.toString() !== user._id?.toString()
    ) {
      throw new BadRequestException('you cannot update product Image ');
    }

    const category = await this.categoryRepositoryService.findById({
      id: product.categoryId,
    });
    const subCategory = await this.subCategoryRepositoryService.findById({
      id: product.subCategoryId,
    });
    if (!category || !subCategory) {
      throw new NotFoundException('Category or Subcategory not found');
    }
    const folder: string = ProductPathFolder({
      categoryFolderId: category.folderId,
      subCategoryFolderId: subCategory.folderId,
      folderId: product.folderId,
    });
    let MainImage: IAttachmentType[];
    let Images: IAttachmentType[];
    if (mainImage) {
      if (product.mainImage.public_id) {
        await this.uploadCloudFileService.deleteFileByPublicId(
          product.mainImage.public_id,
        );
      }
      MainImage = await this.uploadCloudFileService.uploadMultipleFiles(
        mainImage.map((image) => image.path),
        {
          folder,
        },
      );
      product.mainImage = MainImage[0];
      await product.save();
    }
    if (images) {
      if (product.images && product.images.length > 0) {
        await Promise.all(
          product.images.map(async (img) => {
            if (img.public_id) {
              await this.uploadCloudFileService.deleteFileByPublicId(
                img.public_id,
              );
            }
          }),
        );
      }
      Images = await this.uploadCloudFileService.uploadMultipleFiles(
        images.map((image) => image.path),
        {
          folder,
        },
      );
      product.images = Images;
      await product.save();
    }
    return product;
  }

  async deleteProduct(
    user: IUser,
    body: ProductIdDto,
  ): Promise<{ message: string }> {
    const { productId } = body;
    const product = await this.productRepositoryService.findById({
      id: productId,
    });
    if (
      user.role !== RoleTypes.superAdmin &&
      product?.vendorId.toString() !== user._id?.toString()
    ) {
      throw new BadRequestException('you cannot delete product ');
    }

    if (!product) {
      throw new NotFoundException('Product not found or not created by you');
    }

    await this.productRepositoryService.deleteOne({
      filter: { _id: productId },
    });

    await this.reviewRepositoryService.deleteMany({
      filter: { productId: product._id },
    });
    const category = await this.categoryRepositoryService.findById({
      id: product.categoryId,
    });
    const subCategory = await this.subCategoryRepositoryService.findById({
      id: product.subCategoryId,
    });
    if (!category || !subCategory) {
      throw new NotFoundException('Category or Subcategory not found');
    }
    const folder: string = ProductPathFolder({
      categoryFolderId: category.folderId,
      subCategoryFolderId: subCategory.folderId,
      folderId: product.folderId,
    });

    await this.uploadCloudFileService.deleteFileByPrefix(folder);

    return { message: 'Product deleted successfully' };
  }

  async getAllProducts(
    query: getProductsQueryDto,
    params?: CategoryIdAndSubCategoryIdOptional,
  ): Promise<IPagination<IProduct>> {
    const { page, limit, sort, select } = query;

    let filter: filter = this.queryFilter(query);

    if (params?.subCategoryId && params?.categoryId) {
      filter = {
        ...filter,
        categoryId: params.categoryId,
        subCategoryId: params.subCategoryId,
      };
    }

    const products = await this.productRepositoryService.pagination({
      page,
      limit,
      filter,
      sort,
      select,
      populate: Object.values(ProductPopulate),
    });
    return products;
  }

  async getAllProductsBySubCategory(
    query: getProductsQueryDto,
    params: CategoryAndSubCategoryId,
  ): Promise<IPagination<IProduct>> {
    const { categoryId, subCategoryId } = params;
    await this.subCategoryRepositoryService.checkSubCategoryExistsReturnNull({
      _id: subCategoryId,
      categoryId,
    });
    return this.getAllProducts(query, params);
  }

  async getProductById(params: productId): Promise<IProduct> {
    {
      const { productId, categoryId, subCategoryId } = params;
      const product = await this.productRepositoryService.findOne({
        filter: { _id: productId, categoryId, subCategoryId },
      });
      if (!product) {
        throw new NotFoundException('Product not found');
      }
      return product;
    }
  }
}
