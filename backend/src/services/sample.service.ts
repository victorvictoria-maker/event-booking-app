import { Response, Request } from 'express';
import SampleController from '../controllers/sample.control';
import { RootService } from './_root.service';
import { Status } from '../interfaces/status.interface';
const { SUCCESS, ERROR, UNPROCESSABLE_ENTRY, PRECONDITION_FAILED, SUCCESS_NO_CONTENT } = Status;
class SampleService extends RootService {
    create = async (req: Request, res: Response) => {
        const actionType = 'CREATE_SAMPLE';
        try {
            const sample = await SampleController.create(req.body);
            this.sendResponse({req, res, status: SUCCESS, data: sample, actionType});
        } catch (error) {
            this.sendResponse({req, res, status: ERROR, actionType, data: error})
        } 
    }
    getAll = async (req: Request, res: Response) => {
        const actionType = 'GET_ALL_SAMPLES';
        try {
            const samples = await SampleController.fetchAll({},req.query)
            this.sendResponse({req, res, status: SUCCESS, actionType, data: samples});
        } catch (error) {
            this.sendResponse({req, res, status: ERROR,  actionType, data: error})
        } 
    }
    getOne = async (req: Request, res: Response) => {
        const actionType = 'GET_ONE_SAMPLE';
        try {
            const sample = await SampleController.getOne(req.query)
            this.sendResponse({req, res, status: SUCCESS, actionType, data: sample});
        } catch (error) {
            this.sendResponse({req, res, status: ERROR, actionType, data: error})
        } 
    }
    getById = async (req: Request, res: Response) => {
        const actionType = 'GET_SAMPLE_BY_ID'
        try {            
            const sample = await SampleController.getById(req.params.id);
            this.sendResponse({req, res, status: SUCCESS, actionType, data: sample});
        } catch (error) {
            this.sendResponse({req, res, status: ERROR, actionType, data: error})
        } 
    }
    updateOne = async (req: Request, res: Response) => {
        const actionType = 'UPDATE_ONE_SAMPLE';
        try {            
            const sample = await SampleController.updateOne(req.query, req.body)
            if(sample.acknowledged) return this.sendResponse({req, res, status: SUCCESS, actionType, data: sample});
            this.sendResponse({req, res, status: UNPROCESSABLE_ENTRY, actionType, data: 'data not updated'})
        } catch (error) {
            this.sendResponse({req, res, status: ERROR, actionType, data: error})
        } 
    }
    updateMany = async (req: Request, res: Response) => {
        const actionType = 'UPDATE_MANY_SAMPLE';
        try {                        
            const sample: any = await SampleController.updateMany(req.query, req.body)
            if(sample.acknowledged) return this.sendResponse({req, res, status: SUCCESS, actionType, data: sample});
            this.sendResponse({req, res, status: UNPROCESSABLE_ENTRY, actionType, data: 'data not updated'})
        } catch (error) {
            this.sendResponse({req, res, status: ERROR, actionType, data: error})
        } 
    }
    updateById = async (req: Request, res: Response) => {
        const actionType = 'UPDATE_SAMPLE_BY_ID'
        try {            
            const sample: any = await SampleController.updateById(req.params.id, req.body);
            if(sample) return this.sendResponse({req, res, status: SUCCESS, actionType, data: sample});
            this.sendResponse({req, res, status: PRECONDITION_FAILED, actionType, data: 'data not updated'})
        } catch (error) {
            this.sendResponse({req, res, status: ERROR, actionType, data: error})
        } 
    }
    deleteOne = async (req: Request, res: Response) => {
        const actionType = 'DELETE_ONE_SAMPLE'
        try {            
            const sample: any = await SampleController.deleteOne(req.query)
            if(sample.acknowledged) return this.sendResponse({req, res, status: SUCCESS_NO_CONTENT, actionType, data: sample});
            this.sendResponse({req, res, status: UNPROCESSABLE_ENTRY, actionType, data: 'data not deleted'})
        } catch (error) {
            this.sendResponse({req, res, status: ERROR, actionType, data: error})
        } 
    }
    deleteMany = async (req: Request, res: Response) => {
        const actionType = 'DELETE_MANY_SAMPLES';
        try {            
            const sample: any = await SampleController.deleteMany(req.query)
            if(sample.acknowledged) return this.sendResponse({req, res, status: SUCCESS_NO_CONTENT, actionType, data: sample});
            this.sendResponse({req, res, status: UNPROCESSABLE_ENTRY, actionType, data: 'data not deleted'})
        } catch (error) {
            this.sendResponse({req, res, status: ERROR, actionType, data: error})
        } 
    }
    deleteById = async (req: Request, res: Response) => {
        const actionType = 'DELETE_SAMPLE_BY_ID';
        try {            
            const sample = await SampleController.deleteById(req.params.id);
            if(sample) return this.sendResponse({req, res, status: SUCCESS_NO_CONTENT, actionType, data: sample});
            this.sendResponse({req, res, status: PRECONDITION_FAILED, actionType, data: 'data not deleted'})
        } catch (error) {
            this.sendResponse({req, res, status: ERROR, actionType, data: error})
        } 
    }
    
}
export default new SampleService;