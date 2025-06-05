import { Router } from "express";
import SampleService from "../services/sample.service";
import Joi from "../middlewares/validator.middleware";
import SampleValidator from "../validations/sample.validator";

class SampleRoute {
  public loadRoutes(prefix: string, router: Router) {
    this.create(prefix, router);
    this.getAll(prefix, router);
    this.getOne(prefix, router);
    this.getById(prefix, router);
    this.updateOne(prefix, router);
    this.updateMany(prefix, router);
    this.updateById(prefix, router);
    this.deleteOne(prefix, router);
    this.deleteMany(prefix, router);
    this.deleteById(prefix, router);
  }
  private create(prefix: string, router: Router) {
    router.post(
      `${prefix}`,
      Joi.validator(SampleValidator.create),
      SampleService.create
    );
  }
  private getAll(prefix: string, router: Router) {
    router.get(`${prefix}`, SampleService.getAll);
  }
  private getOne(prefix: string, router: Router) {
    router.get(`${prefix}/one`, SampleService.getOne);
  }
  private getById(prefix: string, router: Router) {
    router.get(`${prefix}/:id`, SampleService.getById);
  }
  private updateOne(prefix: string, router: Router) {
    router.put(`${prefix}/one`, SampleService.updateOne);
  }
  private updateMany(prefix: string, router: Router) {
    router.put(`${prefix}/many`, SampleService.updateMany);
  }
  private updateById(prefix: string, router: Router) {
    router.put(`${prefix}/:id`, SampleService.updateById);
  }
  private deleteOne(prefix: string, router: Router) {
    router.delete(`${prefix}/one`, SampleService.deleteOne);
  }
  private deleteMany(prefix: string, router: Router) {
    router.delete(`${prefix}/many`, SampleService.deleteMany);
  }
  private deleteById(prefix: string, router: Router) {
    router.delete(`${prefix}/:id`, SampleService.deleteById);
  }
}
export default new SampleRoute();
