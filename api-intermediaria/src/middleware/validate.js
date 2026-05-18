const STATUS_ENUM = ['COLETADO', 'EM_TRANSITO', 'SAIU_PARA_ENTREGA', 'ENTREGUE', 'TENTATIVA_FALHA', 'CANCELADO'];

function validate(rules) {
  return (req, res, next) => {
    const body = req.body || {};
    const errors = [];

    for (const [field, opts] of Object.entries(rules)) {
      const val = body[field];

      if (opts.required) {
        if (val === undefined || val === null || val === '') {
          errors.push(`Campo obrigatorio: ${field}`);
          continue;
        }
      } else if (val === undefined || val === null) {
        continue;
      }

      if (opts.type === 'number') {
        const n = Number(val);
        if (val === '' || isNaN(n)) {
          errors.push(`Campo ${field} deve ser um numero`);
        } else if (opts.min !== undefined && n < opts.min) {
          errors.push(`Campo ${field} deve ser maior ou igual a ${opts.min}`);
        }
      }

      if (opts.enum && !opts.enum.includes(val)) {
        errors.push(`Campo ${field} deve ser um dos valores: ${opts.enum.join(', ')}`);
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ erro: errors.join('. ') });
    }

    next();
  };
}

module.exports = { validate, STATUS_ENUM };
