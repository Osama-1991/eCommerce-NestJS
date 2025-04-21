import { Injectable, NotFoundException } from '@nestjs/common';
import {
  UserRepositoryService,
  ProductRepositoryService,
  CategoryRepositoryService,
  SubCategoryRepositoryService,
  IUser,
  IProduct,
  ProductPopulate,
  VendorSalesRepositoryService,
  IVendorSales,
  vendorSalesPopulate,
} from 'src/DB/z_index';
import { getUserIdDto, oneProductIdDto } from './dto/get.input';

@Injectable()
export class DashboardService {
  constructor(
    private readonly userRepositoryService: UserRepositoryService,
    private readonly productRepositoryService: ProductRepositoryService,
    private readonly categoryRepositoryService: CategoryRepositoryService,
    private readonly subCategoryRepositoryService: SubCategoryRepositoryService,
    private readonly vendorSalesRepositoryService: VendorSalesRepositoryService,
  ) {}

  async deleteOneUser(query: getUserIdDto): Promise<IUser> {
    const { userId } = query;
    const user = await this.userRepositoryService.findOneAndUpdate({
      filter: {
        _id: userId,
      },
      update: {
        isDeleted: true,
      },
    });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    const category = await this.categoryRepositoryService.findOne({
      filter: {
        createdBy: userId,
      },
    });
    if (!category) {
      throw new NotFoundException('No category exist on this user');
    }

    await this.categoryRepositoryService.deleteCategory(user, category._id);
    return user;
  }

  async deleteManyUsers(query: getUserIdDto[]) {
    const users: IUser[] = [];
    await Promise.all(
      query.map(async (oneUser) => {
        const user = await this.deleteOneUser(oneUser);
        users.push(user);
      }),
    );
    return users;
  }

  async deleteOneProduct(query: oneProductIdDto): Promise<IProduct> {
    const { productId } = query;
    const product = await this.productRepositoryService.findOne({
      filter: { _id: productId },
      populate: Object.values(ProductPopulate),
    });

    if (!product) {
      throw new NotFoundException('no product exist');
    }
    return product;
  }

  async getVendorSales(user: IUser): Promise<IVendorSales> {
    const userId = user._id;
    const vendorCollection = await this.vendorSalesRepositoryService.findOne({
      filter: { userId },
    });

    if (vendorCollection === undefined) {
      throw new NotFoundException('vendor collection not found');
    }
    let totalSalesAmount: number = 0;

    vendorCollection?.orders?.map(
      (order) => (totalSalesAmount += order.finalPrice || 0),
    );
    const vendor = await this.vendorSalesRepositoryService.findOneAndUpdate({
      filter: { userId },
      update: {
        totalSales: totalSalesAmount,
      },
      populate: Object.values(vendorSalesPopulate),
    });

    if (!vendor) {
      throw new NotFoundException('vendor collection not found');
    }

    return vendor;
  }
}
