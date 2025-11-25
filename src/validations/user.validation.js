import Joi from "joi";

const userValidation = (data) => {
  const userValidate = Joi.object({
    name: Joi.string().min(2).max(30).required(),
    username: Joi.string()
      .regex(/^(?!.*__)[A-Za-z][A-Za-z0-9_]{3,30}[A-Za-z0-9]$/)
      .required(),
    description: Joi.string().max(160).allow("", null),
    email: Joi.string().email().required(),
    password: Joi.string().min(4).max(40).required(),
    confirmPassword: Joi.string()
      .valid(Joi.ref("password"))
      .min(4)
      .max(40)
      .required(),
  });

  return userValidate.validate(data, { abortEarly: false });
};

export default userValidation;
