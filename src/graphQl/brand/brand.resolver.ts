import { Resolver } from '@nestjs/graphql';
import { BrandService } from 'src/module/brand/brand.service';

@Resolver()
export class BrandResolver {
  constructor(private readonly brandService: BrandService) {}
}
