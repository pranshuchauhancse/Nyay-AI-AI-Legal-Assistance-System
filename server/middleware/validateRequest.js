/**
 * STEP 5: Validation middleware
 * Validates request body against Zod schema
 * Usage: router.post('/route', validate(schema), controller)
 */

const validateRequest = (schema) => {
  return async (req, res, next) => {
    try {
      // Validate request body
      const validated = await schema.parseAsync(req.body);
      // Replace body with cleaned/validated data
      req.body = validated;
      next();
    } catch (err) {
      res.status(400);
      // Format Zod errors nicely
      const errors = err.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      throw new Error(JSON.stringify({ validation: errors }));
    }
  };
};

module.exports = {
  validateRequest,
};