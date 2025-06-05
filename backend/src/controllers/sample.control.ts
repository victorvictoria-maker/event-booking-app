import { RootController } from './_root.control';
import SampleModel from '../models/sample.model'
class SampleController extends RootController {
    constructor() {
        super(SampleModel) 
    }
}
export default new SampleController