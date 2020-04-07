import React from 'react'
import { Modal, Button } from 'antd'
import QRCode from 'qrcode.react'
import { connect, router } from 'dva'  
import styles from './index.module.scss'

const { withRouter } = router

class BusinessQRCode extends React.Component {

  exportCanvasAsPNG = () => {

    const { businessInfo } = this.props
    
    var canvasElement = document.getElementById('QRcode');

    var MIME_TYPE = "image/png";

    var imgURL = canvasElement.toDataURL(MIME_TYPE);

    var dlLink = document.createElement('a');
    dlLink.download = `商家：${businessInfo.merchantName}的二维码`;
    dlLink.href = imgURL;
    dlLink.dataset.downloadurl = [MIME_TYPE, dlLink.download, dlLink.href].join(':');

    document.body.appendChild(dlLink);
    dlLink.click();
    document.body.removeChild(dlLink);
}

  render() {
    const { visible, onHideQRCode, businessInfo } = this.props
    let option = {
      visible: visible,
      title: '商家收款码',
      onCancel: onHideQRCode
    } 
    return (
      <Modal
        {...option}
        footer={[
          <div key="operate" className={styles['footer']}>
            <Button type="primary" onClick={onHideQRCode}>
              确定
            </Button>
          </div>
        ]}
      >
        <div className={styles['qrcode']}>
          <span className={styles['qrcode__lable']}>
            扫码二维码，输入付款金额进行付款
          </span>
          <QRCode
            value={`https://mobile.uwooz.com/minApp/uwooz_receiveMoney/?merchantId=${businessInfo.merchantId}`}  // value参数为生成二维码的链接
            size={182}                                                                                           // 二维码的宽高尺寸
            fgColor="#000000"                                                                                    // 二维码的颜色
            id="QRcode"
          />
          <Button
            onClick={this.exportCanvasAsPNG}
            className={styles['qrcode__btn']}
          >
            下载二维码
          </Button>
        </div>
      </Modal>
    )
  }
}

const mapStateToProps = ({ 'businessManagement_businessList': state }) => {
  const { businessInfo } = state
  return { businessInfo }
}

export default withRouter(connect(mapStateToProps)(BusinessQRCode))
