import {
  DeleteResult,
  FilterQuery,
  Model,
  PipelineStage,
  PopulateOptions,
  Types,
  UpdateQuery,
  UpdateWriteOpResult,
} from 'mongoose';

interface findOptions<TDocument> {
  filter?: FilterQuery<TDocument>;
  // populate?: PopulateOptions[];
  populate?: any[];
  page?: number;
  sort?: string;
  limit?: number;
  select?: string;
}

export abstract class DBRepository<TDocument> {
  // can not be instantiated
  protected constructor(protected readonly model: Model<TDocument>) {}

  /******************************************************************************/

  async create(data: Readonly<Partial<TDocument>>): Promise<TDocument> {
    return await this.model.create(data);
  }

  /******************************************************************************/
  async find({
    filter = {},
    populate,
    limit,
    skip,
    sort,
  }: {
    filter?: FilterQuery<TDocument>;
    // populate?: PopulateOptions[];
    populate?: any[];
    limit?: number;
    skip?: number;
    sort?: Record<string, 1 | -1>;
  }): Promise<TDocument[]> {
    let query = this.model.find(filter);
    if (populate) query = query.populate(populate);
    if (sort) query = query.sort(sort);
    if (skip) query = query.skip(skip);
    if (limit) query = query.limit(limit);
    return await query;
  }

  /******************************************************************************/
  async pagination({
    filter = {},
    populate = [],
    page = 1,
    sort = '',
    limit = 3,
    select = '',
  }: findOptions<TDocument>): Promise<{
    page: number;
    totalCount: number;
    totalPages: number;
    data: TDocument[];
  }> {
    const Page = Math.max(1, page || 1);

    const query = this.model.find(filter);
    if (populate) query.populate(populate);
    if (sort) query.sort(sort.replaceAll(',', ' '));
    if (select) query.select(select.replaceAll(',', ' '));
    if (limit) query.limit(limit);

    let data: TDocument[] = [];

    if (!page) {
      data = await query;
    }

    const skip = (page - 1) * limit;
    data = await query.skip(skip).limit(limit);

    const totalCount = await this.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limit);

    return { page: Page, totalCount, totalPages, data };
  }
  /******************************************************************************/
  async findOne({
    filter,
    populate,
    select = '',
  }: {
    filter?: FilterQuery<TDocument>;
    populate?: PopulateOptions[];
    select?: string | Record<string, 1 | 0>;
  }): Promise<TDocument | null> {
    return await this.model
      .findOne(filter || {})
      .populate(populate || [])
      .select(select);
  }

  /******************************************************************************/
  async findById({
    id,
    populate = [],
  }: {
    id: Types.ObjectId;
    populate?: PopulateOptions[] | any[];
  }): Promise<TDocument | null> {
    return await this.model.findById(id).populate(populate);
  }

  /******************************************************************************/
  async findOneAndUpdate({
    filter,
    update,
    populate = [],
  }: {
    filter: FilterQuery<TDocument>;
    update: UpdateQuery<TDocument>;
    populate?: PopulateOptions[] | any[];
  }): Promise<TDocument | null> {
    return await this.model
      .findOneAndUpdate(filter, update, { new: true })
      .populate(populate);
  }

  /******************************************************************************/

  async findOneAndDelete(filter: FilterQuery<TDocument>) {
    return await this.model.findOneAndDelete(filter);
  }

  /******************************************************************************/
  async updateOne({
    filter,
    update,
  }: {
    filter: FilterQuery<TDocument>;
    update: UpdateQuery<TDocument>;
  }): Promise<UpdateWriteOpResult> {
    return await this.model.updateOne(filter, update);
  }

  /******************************************************************************/

  async updateMany({
    filter,
    update,
  }: {
    filter: FilterQuery<TDocument>;
    update: UpdateQuery<TDocument>;
  }): Promise<UpdateWriteOpResult> {
    return await this.model.updateMany(filter, update);
  }

  /******************************************************************************/

  async findByIdAndUpdate({
    id,
    update,
  }: {
    id: Types.ObjectId;
    update: UpdateQuery<TDocument>;
  }): Promise<TDocument | null> {
    return await this.model.findByIdAndUpdate(id, update, { new: true });
  }

  /******************************************************************************/
  async findByIdAndDelete({ id }: { id: Types.ObjectId }) {
    return await this.model.findByIdAndDelete(id);
  }

  /******************************************************************************/
  async deleteOne({
    filter,
  }: {
    filter: FilterQuery<TDocument>;
  }): Promise<DeleteResult> {
    return await this.model.deleteOne(filter);
  }

  /******************************************************************************/
  async deleteMany({
    filter,
  }: {
    filter: FilterQuery<TDocument>;
  }): Promise<DeleteResult> {
    return await this.model.deleteMany(filter);
  }

  /******************************************************************************/
  async countDocuments(filter: FilterQuery<TDocument> = {}): Promise<number> {
    return await this.model.countDocuments(filter);
  }

  async exists(filter: FilterQuery<TDocument>): Promise<boolean> {
    return !!(await this.model.exists(filter));
  }

  /******************************************************************************/

  async aggregate<T>(pipeline: PipelineStage[]): Promise<T[]> {
    return await this.model.aggregate(pipeline);
  }

  /******************************************************************************/
  async distinct(
    field: string,
    filter: FilterQuery<TDocument> = {},
  ): Promise<any[]> {
    return await this.model.distinct(field, filter);
  }

  /******************************************************************************/

  // async paginate({
  //   filter = {},
  //   page = 1,
  //   limit = 10,
  //   sort = {},
  //   populate,
  // }: {
  //   filter?: FilterQuery<TDocument>;
  //   page?: number;
  //   limit?: number;
  //   sort?: Record<string, 1 | -1>;
  //   populate?: PopulateOptions[];
  // }): Promise<{
  //   data: TDocument[];
  //   total: number;
  //   page: number;
  //   totalPages: number;
  // }> {
  //   const skip = (page - 1) * limit;
  //   const total = await this.countDocuments(filter);
  //   const totalPages = Math.ceil(total / limit);

  //   let query = this.model.find(filter);
  //   if (populate) query = query.populate(populate);
  //   query = query.sort(sort).skip(skip).limit(limit);

  //   const data = await query;
  //   return { data, total, page, totalPages };
  // }
}

/*
 async pagination({
    filter = {},
    populate = [],
    page = 1,
    sort = {},
    limit = 3,
    select = '',
  }: {
    filter?: FilterQuery<TDocument>;
    populate?: PopulateOptions[];
    page?: number;
    sort?: Record<number, 1 | -1>;
    limit?: number;
    select?: string | Record<string, 1 | 0>;
  }): Promise<{
    page: number;
    totalCount: number;
    totalPages: number;
    data: TDocument[];
  }> {
    const Page = Math.max(1, page || 1);
    const Limit = Math.max(1, limit || 10);
    const skip = (Page - 1) * Limit;

    const data = await this.model
      .find(filter)
      .limit(Limit)
      .skip(skip)
      .sort(sort)
      .populate(populate)
      .select(select);

    const totalCount = await this.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / Limit);

    return { page: Page, totalCount, totalPages, data };
  }
 */
