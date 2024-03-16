import ValidationService from "../services/validation_service.js";
import Company from "../models/company.js";
import User from "../models/user.js";

export default class CompanyController {
  static async fetchById(req, res, next) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "id is a required parameter" });
      }
      const company = await Company.findById(id).populate("clients").exec();
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      return res.status(200).json(company);
    } catch (err) {
      next(err);
    }
  }

  static async create(req, res, next) {
    try {
      //userId should be present in the body from the auth middleware
      const userId = req.headers.userId;
      const { transportName, companyAddress, gstNumber } = req.body;
      if (!userId || !transportName || !companyAddress || !gstNumber) {
        return res.status(400).json({
          message:
            "transportName, companyAddress & gstNumber are required parameters",
        });
      }
      //Validate GST Number
      const gstNumberError = ValidationService.validateGSTNumber(gstNumber);
      if (gstNumberError) {
        return res.status(400).json({ message: gstNumberError });
      }

      //Check if the user already has a company
      let user = await User.findById(userId);
      if (user.company) {
        return res.status(400).json({
          message: "User already has a company associated, try updating it.",
        });
      }

      //Check if company exists with the same GST Number
      const existingCompany = await Company.findOne({ gstNumber });
      if (existingCompany) {
        return res.status(400).json({
          message: "This GST Number is already associated with a company.",
        });
      }

      //Create a new company
      const company = new Company({
        transportName,
        companyAddress,
        gstNumber,
      });
      await company.save();

      //Add the company to the user
      user = await User.findById(userId);
      user.company = company._id;
      await user.save();

      return res
        .status(201)
        .json({ message: "Company Created Successfully", company });
    } catch (err) {
      next(err);
    }
  }
  static async update(req, res, next) {
    try {
      //Required parameters: id
      const id = req.params.id;
      const { transportName, companyAddress, gstNumber } = req.body;
      if (!id) {
        return res.status(400).json({ message: "id is a required parameter" });
      }
      //If GST should be updated, validate GST Number
      if (gstNumber) {
        const gstNumberError = ValidationService.validateGSTNumber(gstNumber);
        if (gstNumberError) {
          return res.status(400).json({ message: gstNumberError });
        }
      }
      //Update the company
      const company = await Company.findByIdAndUpdate(
        id,
        { transportName, companyAddress, gstNumber },
        { new: true },
      );
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      return res
        .status(200)
        .json({ message: "Company Updated Successfully", company });
    } catch (err) {
      next(err);
    }
  }
}
