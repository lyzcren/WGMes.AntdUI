export function validatePhone(rule, value, callback) {
  const reg = /^1[3|4|5|6|7|8|9]\d{9}$/;
  if (value && !reg.test(value)) {
    callback('请输入正确的手机号码!');
  } else {
    callback();
  }
}

export function getPasswordStatus(value) {
  if (value && value.length > 9) {
    return 'ok';
  }
  if (value && value.length > 5) {
    return 'pass';
  }

  return 'poor';
}

export function validatePassword(rule, value, callback) {
  if (!value) {
    callback('密码不符合要求');
  } else if (value.length < 6) {
    callback('密码不符合要求');
  } else {
    callback();
  }
}
