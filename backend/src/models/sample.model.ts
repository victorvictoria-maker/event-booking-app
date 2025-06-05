import { Document, Schema, model, Model } from "mongoose";

export interface ISample extends Document {
    name: string;
    description?: string;
}

const schema: Schema<ISample> = new Schema({
    name: {
        type: String,
    },
    description: {
        type: String
    }, 
}, {timestamps: true});
schema.index({})

export interface ISampleModel extends Model<ISample> {}

const SampleModel:ISampleModel = model<ISample, ISampleModel>('sample', schema)
export default SampleModel
