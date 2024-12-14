import { Request, Response } from "express";
import User from "../models/userSchema"; // Import the User model
import AddressList, { IAddress } from "../models/addressSchema";

export const addAddress = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      user,
      name,
      address,
    }: { user: string; name: string; address: string } = req.body;

    // Validate request
    if (!name || !address) {
      res
        .status(400)
        .json({ success: false, error: "Please fill address name and value" });
      return;
    }

    var addressList = await AddressList.findOne({ user }); // find user's address list

    const newAddress: IAddress = {
      name: name,
      address: address,
    };

    if (addressList) {
      const addressIndex = addressList.addresses.findIndex(add => add.name === name);

      if (addressIndex > -1) {
        res.status(409).json({ error: "Address name already in use." });
        return;
      } else {
        addressList.addresses.push(newAddress); // Add new address
      }
    } else {
      addressList = new AddressList({
        user: user,
        addresses: [newAddress],
      });
    }

    const updatedList = await addressList.save();
    res.status(201).json({ success: true, data: updatedList });
  } catch (error) {
    console.error("Error adding new address:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to add new address" });
  }
};


// get all addresses of a user
export const getAddresses = async (req: Request, res: Response): Promise<void> => {
  const { user } = req.params;
  try {
    // Fetch all cart items with product details populated
    const addressList = await AddressList.findOne({ user });
    if (!addressList) {
      res.status(200).json({ success: true, data: [] });
      return;
    }

    res.status(200).json({ success: true, data: addressList });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ success: false, error: "Failed to fetch addresses" });
  }
};


// remove address
export const removeAddress = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user, name }: { user: string; name: string } = req.body;

    // Find the user's address list
    const addressList = await AddressList.findOne({ user });
    if (!addressList) {
      res.status(404).json({ success: false, error: "No addresses found" });
      return;
    }

    const addressIndex = addressList.addresses.findIndex((add) => add.name === name);

    if (addressIndex > -1) {
        addressList.addresses.splice(addressIndex, 1);
    } else {
      res.status(404).json({ success: false, error: "Address not present" });
      return;
    }

    const updatedList = await addressList.save();
    res.status(200).json({ success: true, data: updatedList });
  } catch (error) {
    console.error("Error removing address:", error);
    res.status(500).json({ success: false, error: "Failed to remove address" });
  }
};

// Update a particular address
export const updateAddress = async (req: Request, res: Response): Promise<void> => {
  try {
    
    const { user, name, address } = req.body;

    var addressList = await AddressList.findOne({ user }); // find user's address list

    if (addressList) {
      const addressIndex = addressList.addresses.findIndex(add => add.name === name);

      if (addressIndex > -1) {
        addressList.addresses[addressIndex].address = address;
      } else {
        res.status(404).json({ success: false, error: "Address not found" });
        return;
      }
    } else {
      res.status(404).json({ success: false, error: "Address not found" });
        return;
    }

    

    const updatedList = await addressList.save();
    res.status(200).json({ success: true, data: updatedList });
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({ success: false, error: "Failed to update address" });
  }
};