import { Model, Document } from "mongoose";
import QueryHelper from "../helpers/query.helper";
import {
  FetchAllQuery,
  FetchWithPaginationDataI,
  ModelPopulateI,
} from "../interfaces/root-controller.interface";

export class RootController {
  protected model: Model<any>;
  protected modelName: string;
  constructor(model: Model<any>, modelName: string = "Document") {
    this.model = model;
    this.modelName = modelName;
  }
  unique = async (conditions: { key: string; value: string }) => {
    const { key, value } = conditions;
    const res = await this.model.findOne({ [key]: value });
    if (res) {
      return false;
    } else {
      return true;
    }
  };
  getDocumentCount = async (conditon = {}, query?: object) => {
    const { filter } = QueryHelper.build_query(query);
    return await this.model.countDocuments({ ...filter, ...conditon });
  };
  create = async (payload: any) => {
    try {
      const document = await this.model.create({ ...payload });
      return document.toJSON();
    } catch (error) {
      throw error;
    }
  };
  fetchAll(
    condition: object = {},
    query?: FetchAllQuery,
    select: string | object = "",
    populate?: any
  ) {
    const { filter, skip, limit, sort } = QueryHelper.build_query(query);
    return this.model
      .find({ ...filter, ...condition })
      .select(select)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .populate(populate);
  }
  fetchAllWithPagination = async (
    conditon: object,
    query?: FetchAllQuery,
    select: string | object = "",
    populate?: ModelPopulateI[]
  ): Promise<FetchWithPaginationDataI> => {
    try {
      const records = await this.fetchAll(conditon, query, select, populate);
      const total_records = await this.getDocumentCount(conditon, query);
      return { records, total_records };
    } catch (error) {
      throw error;
    }
  };
  getOneP = async (condition: object, select?: any) => {
    try {
      select = select ? select : "";
      const document = await this.model
        .findOne(condition)
        .select(select)
        .lean();
      if (!document) throw { message: `${this.modelName} not found` };
      return document;
    } catch (error) {
      throw error;
    }
  };
  getOne(condition: object, select: string | object = "", populate?: any) {
    return this.model
      .findOne(condition)
      .select(select)
      .populate(populate)
      .lean() as any;
  }

  getById = async (id: string, select: string | object = "") => {
    try {
      const document = await this.model.findById(id).select(select).lean();
      if (!document) throw { message: `${this.modelName} not found` };
      return document;
    } catch (error) {
      throw error;
    }
  };
  updateOne(condition: object, updateValues: object) {
    return this.model.updateOne(
      { ...condition },
      { ...updateValues },
      { new: true }
    ) as any;
  }
  updateMany(condition: object, updateValues: object) {
    return this.model.updateMany({ ...condition }, { ...updateValues }).lean();
  }
  updateById(id: string, updateValues: object): any {
    return this.model
      .findByIdAndUpdate(id, { ...updateValues }, { new: true })
      .lean();
  }
  deleteOne(condition: object) {
    return this.model.deleteOne({ ...condition });
  }
  deleteMany(condition: object) {
    return this.model.deleteMany({ ...condition });
  }
  deleteById(id: string) {
    return this.model.findByIdAndDelete(id);
  }
  search = async (payload: { key: any; value: any }, select = "") => {
    try {
      const regrex = new RegExp(`${payload.value}`, "i");
      const records = await this.model
        .find({ [payload.key]: { $regex: regrex } })
        .select(select);
      if (!records) throw { message: `${this.modelName} not found` };
      throw records;
    } catch (error) {
      throw error;
    }
  };
  getNestedRecord = async (payload: {
    _id: string;
    field: string;
    itemId: string;
  }) => {
    try {
      const { _id, field, itemId } = payload;
      const field_item = await this.getOne(
        {
          _id,
          [field]: { $eq: itemId },
        },
        { [field]: { $elemMatch: { _id: itemId } } }
      );
      const fieldName = field.split(".")[0];
      if (!field_item) throw { message: `${fieldName} not found` };
      const item = field_item[fieldName][0];
      return item;
    } catch (error) {
      throw error;
    }
  };
}
