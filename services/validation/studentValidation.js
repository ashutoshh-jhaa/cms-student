import Joi from "joi";

const studentSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  gender: Joi.string().valid("male", "femal", "others").required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().required(),
  dob: Joi.date().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
});

export default studentSchema;
