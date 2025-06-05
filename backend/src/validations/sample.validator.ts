import * as joi from 'joi';
class SampleValidator {
    public create = joi.object({
        name: joi.string().required(),
        description: joi.string().required()
    })
}
export default new SampleValidator;