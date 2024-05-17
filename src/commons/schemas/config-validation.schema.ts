import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  TTL_IN_SECONDS: Joi.number().default(3600),
});
