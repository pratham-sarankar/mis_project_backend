import User from "../models/user.js";
import Client from "../models/client.js";
import Company from "../models/company.js";
export default class ClientController {
  static async create(req, res) {
    const userId = req.headers.userId;
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "name is a required parameter" });
    }
    const user = await User.findById(userId).populate("company").exec();
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    if (!user.company) {
      return res
        .status(404)
        .json({ message: "User does not have any company." });
    }

    //Find company by id
    const company = await Company.findById(user.company._id)
      .populate("clients")
      .exec();
    if (!company) {
      return res.status(404).json({ message: "Company not found." });
    }

    //Create a new client
    const client = new Client({
      name,
    });

    //Add the client to the company
    company.clients.push(client);

    //First save client
    await client.save();

    //Then save company
    await company.save();
    return res
      .status(201)
      .json({ message: "Client Created Successfully", client });
  }

  static async update(req, res) {
    const userId = req.headers.userId;
    const { id } = req.params;
    const { name } = req.body;
    if (!id) {
      return res.status(400).json({ message: "id is a required parameter" });
    }
    if (!name) {
      return res.status(400).json({ message: "name is a required parameter" });
    }
    const user = await User.findById(userId).populate("company").exec();
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    if (!user.company) {
      return res
        .status(404)
        .json({ message: "User does not have any company." });
    }
    //Find company by id
    const company = await Company.findById(user.company._id)
      .populate("clients")
      .exec();
    if (!company) {
      return res.status(404).json({ message: "Company not found." });
    }
    //Find client by id
    const client = await Client.findById(id);
    if (!client) {
      return res.status(404).json({ message: "Client not found." });
    }

    //Update client
    client.name = name;
    await client.save();

    return res
      .status(200)
      .json({ message: "Client Updated Successfully", client });
  }

  static async delete(req, res) {
    //Required parameters
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "id is a required parameter" });
    }

    //Find user from req.headers.userId
    const userId = req.headers.userId;
    const user = await User.findById(userId).populate("company").exec();
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    if (!user.company) {
      return res
        .status(404)
        .json({ message: "User does not have any company." });
    }
    //Find company by id
    const company = await Company.findById(user.company._id);
    if (!company) {
      return res.status(404).json({ message: "Company not found." });
    }
    //Find client by id
    const client = await Client.findById(id);
    if (!client) {
      return res.status(404).json({ message: "Client not found." });
    } else if (!company.clients.includes(id)) {
      return res
        .status(404)
        .json({ message: "Client does not belong to the your company." });
    }
    //Delete client
    await Client.deleteOne({ _id: id });

    //Remove client from company
    company.clients.pull(id);
    await company.save();

    return res.status(200).json({ message: "Client deleted successfully" });
  }
}
