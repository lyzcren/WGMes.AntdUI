export const getMatchConverter = (data, unitConverters) => {
  for (let unitConverter of unitConverters) {
    if (isMatch(data, unitConverter)) {
      return unitConverter;
    }
  }
  return null;
};

const isMatch = (data, unitConverter) => {
  const { expressions, fInUnitID } = unitConverter;
  for (let expression of expressions) {
    const { fField, fMatchTypeNumber, fExpression } = expression;
    if (data.fUnitID !== fInUnitID) {
      return false;
    }
    if (!data.hasOwnProperty(fField)) {
      return false;
    }
    const fieldValue = data[fField].toString();
    switch (fMatchTypeNumber) {
      case 'Regex': {
        const regex = new RegExp(fExpression);
        if (!regex.test(fieldValue)) {
          return false;
        }
        break;
      }
      case 'Full': {
        if (fieldValue !== fExpression) {
          return false;
        }
        break;
      }
      case 'Left': {
        const left = fieldValue.substring(0, fExpression.length);
        if (left !== fExpression) {
          return false;
        }
        break;
      }
      case 'Right': {
        const right = fieldValue.substring(
          fieldValue.length - fExpression.length,
          fieldValue.length
        );
        if (right !== fExpression) {
          return false;
        }
        break;
      }
      default:
        break;
    }
  }
  return true;
};

export const getConverterRate = (data, unitConverter) => {
  const reg = /^[0-9]+.?[0-9]*$/;
  if (reg.test(unitConverter.fFormula)) {
    return unitConverter.fFormula * 1;
  }
  const { expressions } = unitConverter;
  let calcExpression = unitConverter.fFormula;
  for (let expression of expressions) {
    const { fField, fMatchTypeNumber, fExpression } = expression;
    // 当匹配为“正则匹配”时，取出正则分组作为后续计算换算率的参数
    if (fMatchTypeNumber === 'Regex') {
      const regex = new RegExp(fExpression);
      // 此处默认data中存在fField，不做判断，若有问题，请在此前步骤中处理
      const match = regex.exec(data[fField]);
      // 使用正则表达式分组值作为参数，计算换算率
      Object.keys(match.groups).forEach(propertyName => {
        calcExpression = calcExpression.replace(propertyName, match.groups[propertyName]);
      });
    }
  }
  if (reg.test(calcExpression)) {
    return calcExpression * 1;
  }
  try {
    // 计算表达式（公式）的值
    return eval(calcExpression);
  } catch (error) {
    return 0;
  }
};

/// 计算转换后的数量
export const getConvertQty = (data, unitConverter, qty) => {
  if (!unitConverter || Object.keys(unitConverter) <= 0) return qty;
  const unitRate = getConverterRate(data, unitConverter);
  let convertQty = 0;
  switch (unitConverter.fConvertMode) {
    case 'multi':
      convertQty = qty * unitRate;
      break;
    case 'div':
      convertQty = qty / unitRate;
      break;
    default:
      convertQty = qty;
      break;
  }

  return convertQty;
};

/// 计算单位转换前的数量
export const getUnconvertQty = (data, unitConverter, qty) => {
  if (!unitConverter || Object.keys(unitConverter) <= 0) return qty;
  const unitRate = getConverterRate(data, unitConverter);
  let convertQty = 0;
  switch (unitConverter.fConvertMode) {
    case 'multi':
      convertQty = qty / unitRate;
      break;
    case 'div':
      convertQty = qty * unitRate;
      break;
    default:
      convertQty = qty;
      break;
  }

  return convertQty;
};

export const getConvertQtyWithDecimal = (data, unitConverter, qty) => {
  const convertQty = getConvertQty(data, unitConverter, qty);
  const { fDecimal, fDecimalMode } = unitConverter;
  switch (fDecimalMode) {
    case 'round': // 四舍五入
      {
        const decimalQty = Math.round(convertQty * Math.pow(10, fDecimal)) / Math.pow(10, fDecimal);
        // console.log(convertQty, decimalQty);
        return decimalQty;
      }
      break;
    case 'floor': // 向下舍入
      {
        const decimalQty = Math.floor(convertQty * Math.pow(10, fDecimal)) / Math.pow(10, fDecimal);
        // console.log(convertQty, decimalQty);
        return decimalQty;
      }
      break;
    case 'ceil': // 向上舍入
      {
        const decimalQty = Math.ceil(convertQty * Math.pow(10, fDecimal)) / Math.pow(10, fDecimal);
        // console.log(convertQty, decimalQty);
        return decimalQty;
      }
      break;
    case 'round2': // 四舍六入五成双
      {
        const decimalQty = round2(convertQty, fDecimal);
        // console.log(convertQty, decimalQty);
        return decimalQty;
      }
      break;
    default:
      return convertQty;
      break;
  }
};

export const round2 = (num, decimalPlaces) => {
  var d = decimalPlaces || 0;
  var m = Math.pow(10, d);
  var n = +(d ? num * m : num).toFixed(8); // Avoid rounding errors
  var i = Math.floor(n),
    f = n - i;
  var e = 1e-8; // Allow for rounding errors in f
  var r = f > 0.5 - e && f < 0.5 + e ? (i % 2 == 0 ? i : i + 1) : Math.round(n);
  return d ? r / m : r;
};
