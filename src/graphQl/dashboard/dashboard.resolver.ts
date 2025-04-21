import { Resolver, Query, Args } from '@nestjs/graphql';
import { DashboardService } from './dashboard.service';
import { Auth, User } from 'src/common/z_index';
import { IUser, RoleTypes } from 'src/DB/z_index';
import { getUserIdDto, oneProductIdDto } from './dto/get.input';
import { oneUserResponse, oneVendorSales } from './entities/dashboard.entity';
import { oneProductResponse } from '../product/entities/product.entity';

@Resolver()
export class DashboardResolver {
  constructor(private readonly dashboardService: DashboardService) {}
  @Auth([RoleTypes.admin])
  @Query(() => oneUserResponse, { name: 'deleteOneUser' })
  deleteOneUser(@User() user: IUser, @Args('ID') query: getUserIdDto) {
    return this.dashboardService.deleteOneUser(query);
  }

  @Auth([RoleTypes.admin])
  @Query(() => [oneUserResponse], { name: 'deleteManyUser' }) // Corrected the name
  deleteManyUser(
    @User() user: IUser,
    @Args({ name: 'IDs', type: () => [getUserIdDto] }) query: getUserIdDto[],
  ) {
    return this.dashboardService.deleteManyUsers(query);
  }

  @Auth([RoleTypes.admin])
  @Query(() => oneProductResponse, { name: 'deleteProduct' })
  deleteOneProduct(@Args('ID') query: oneProductIdDto) {
    return this.dashboardService.deleteOneProduct(query);
  }

  @Auth([RoleTypes.vendor])
  @Query(() => oneVendorSales, { name: 'getVendorSales' })
  getVendorSales(@User() user: IUser) {
    return this.dashboardService.getVendorSales(user);
  }
}
