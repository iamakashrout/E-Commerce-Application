import mongoose, { Document, Schema, Model } from 'mongoose';


// individual address
export interface IAddress {
  name: string; // unique identifier
  address: string;
}

// list of all addresses of one user
export interface IAddressList extends Document {
  user: string; // email of user, unique identifier
  addresses: IAddress[]; // items
  createdAt: Date;
  updatedAt: Date;
}


const AddressSchema: Schema<IAddress> = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
});


const AddressListSchema: Schema<IAddressList> = new mongoose.Schema(
  {
    user: { type: String, required: true },
    addresses: [AddressSchema],
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);


const AddressList: Model<IAddressList> = mongoose.model<IAddressList>("AddressList", AddressListSchema);

export default AddressList;