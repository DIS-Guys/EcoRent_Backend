import mongoose, {Schema, Document} from 'mongoose';

export interface IDevice extends Document {
  manufacturer: string;
  deviceModel: string;
  state: string;
  batteryCapacity: number;
  weight: number;
  typeC: number;
  typeA: number;
  sockets: number;
  remoteUse: string;
  sizeXYZ: number[];
  batteryType: string;
  outputSignalForm: string;
  additional: string;
  deviceImages: string[];
}

const DeviceSchema: Schema = new Schema({
  manufacturer: {type: String, required: true},
  deviceModel: {type: String, required: true},
  state: {type: String, required: true},
  batteryCapacity: {type: Number, required: true},
  weight: {type: Number, required: true},
  typeC: {type: Number, required: true},
  typeA: {type: Number, required: true},
  sockets: {type: Number, required: true},
  remoteUse: {type: String, required: true},
  sizeXYZ: {type: [Number], required: true},
  batteryType: {type: String, required: true},
  outputSignalForm: {type: String, required: true},
  additional: {type: String, required: true},
  deviceImages: {type: [String], required: true},
});

export default mongoose.model<IDevice>('Device', DeviceSchema);