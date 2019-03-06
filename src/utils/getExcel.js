import { notification } from 'antd';
import { getToken } from './token';

const token = getToken();

export async function exportExcel (url, params, fileName) {
  // 给header添加token用户身份验证
  const token = getToken();
  var oReq = new XMLHttpRequest();
  oReq.open("POST", url, true);
  oReq.responseType = "blob";
  oReq.setRequestHeader("Content-Type", "application/json");
  // 给header添加token用户身份验证
  oReq.setRequestHeader("wgToken", token);
  oReq.onload = function (oEvent) {
    const success = checkStatus(oReq);
    if (!success) {
      return;
    }
    var content = oReq.response;
    var blob = new Blob([content]);
    //var blob = new Blob([content], { type: 'application/vnd.ms-excel'});//text/csv,charset=GBK
    if (navigator.appVersion.toString().indexOf('.NET') > 0) {
      window.navigator.msSaveBlob(blob, fileName);
    }
    else {
      var elink = document.createElement('a');
      elink.download = fileName;
      elink.style.display = 'none';
      elink.href = URL.createObjectURL(blob);
      document.body.appendChild(elink);
      elink.click();
      document.body.removeChild(elink);
    }
  };
  oReq.send(JSON.stringify(params));
};

function checkStatus (request) {
  const status = request.status;
  if (status === 401) {
    // @HACK
    /* eslint-disable no-underscore-dangle */
    window.g_app._store.dispatch({
      type: 'login/logout',
    });
    return false;
  }
  if (status === 403) {
    // 当出现403代码时，检查token
    fetch("/api/account/checkToken", {
      method: "POST",
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({ token })
    }).then(response => {
      if (response.status == 401) {
        notification.error({
          message: `登录信息过期，请重新登录`,
        });
        window.g_app._store.dispatch({
          type: 'login/logout',
        });
      } else {
        notification.error({
          message: `当前用户无对应的操作权限。`,
        });
      }
    });

    return false;
  }

  return true;
};