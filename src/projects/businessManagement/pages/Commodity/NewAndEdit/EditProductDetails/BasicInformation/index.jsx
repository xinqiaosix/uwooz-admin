import React, {useState} from 'react'
import { connect } from 'dva'
import { 
  Modal, 
  Form,
  Input,
  Upload,
  Icon, 
  Spin,
  message
} from 'antd'

import styles from './index.module.scss'

const { TextArea } = Input;

// 编辑商品详情里的基本信息
function BasicInformation(props) {
  const { dispatch, fileList,  form } = props;
  const { getFieldDecorator } = form;
  const [previewVisible, togglePreviewVisible] = useState(false)  // 图片的预览Modal显示控制
  const [previewImage, changePreviewImage] = useState('')         // 预览的图片
  const [isLoadding, changeLoaddingStatus] = useState(false)      // 图片正在上传中的状态

  const commodityCodeFormItemLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 8 },
  };

  // 上传按钮组件
  const uploadButton = (
    <div>
      <Icon type="plus" />
      <div className="ant-upload-text">上传</div>
    </div>
  );

  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  // 设置预览的图片
  async function handlePreview(file) {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    togglePreviewVisible(true)
    changePreviewImage(file.url || file.preview)
  }

  // 移除图片
  function onRemove(e) {
    const newList = fileList.filter((item) => {
      return item.uid !== e.currentTarget.dataset.id
    })
    dispatch({
      type: 'businessManagement_commodity/changeProductSettings',
      action: {
        payload: {
          fileList: newList
        }
      }
    })
  }

  // 关闭预览
  function handleCancel() {
    togglePreviewVisible(false)
  }

  // 更改主图
  function changeMainMap(e) {
    const uid = e.currentTarget.dataset.uid;
    const newList = fileList.map((item) => {
      if(item.uid === uid) {
        item.isMain = true;
        return item;
      } else {
        item.isMain = false;
        return item;
      }
    })
    dispatch({
      type: 'businessManagement_commodity/changeProductSettings',
      action: {
        payload: {
          fileList: newList
        }
      }
    })
  }

  // 限制上传文件的类型和大小
  function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
    if (!isJpgOrPng) {
      message.error('图片格式只能是jpg或png');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能超过2M');
    }
    return isJpgOrPng && isLt2M;
  }

  const prefix = 'basicInformation'
  return (
    <div className={styles[`${prefix}`]}>
      <h2 className={styles[`${prefix}__title`]}>基本信息</h2>
      <div className={styles[`${prefix}__form-wrap`]}>
        <Form.Item label="商品名称" extra="可输入中文，英文，数字，符号，首字不可以是符号，最多30字" {...commodityCodeFormItemLayout}>
          {getFieldDecorator('productName', {
            rules: [{ required: true, message: '请输入商品名称!' }],
          })(
            <Input placeholder="请输入商品名称" />,
          )}
        </Form.Item>
        <Form.Item label="商品编码" {...commodityCodeFormItemLayout}>
          {getFieldDecorator('commodityCode', {
            rules: [{ required: false, message: '请输入商品编码!' }],
          })(
            <Input />,
          )}
        </Form.Item>
        <Form.Item label="简介">
          {getFieldDecorator('introduction', {
            rules: [{ required: true, message: '请输入简介!', max: 50 }],
          })(
            <TextArea placeholder="会在商品名下面，分享卡片中显示，限50字" rows={5} />,
          )}
        </Form.Item>
        <Form.Item label="商品图">
          <div className={styles[`${prefix}-form__upload-wrap`]}>
            <div className={styles["showPictrue"]}>
              {
                fileList.map((item, index) => {
                  return (
                    <span className={item.isMain ? `${styles["showPictrue__img-wrap"]} ${styles["showPictrue__img-wrap-main"]}` : styles["showPictrue__img-wrap"]} key={item.uid || index}>
                      <img src={`${item.url}?x-oss-process=image/resize,h_100`} alt={item.name} />
                      <span className={styles["img-mask"]}>
                        <span className={styles["img-mask__icon-wrap"]}>
                          <Icon type="eye" className={styles["img-mask__icon"]} onClick={() => handlePreview(item)} />
                          <Icon type="delete" className={styles["img-mask__icon"]} data-id={item.uid} onClick={onRemove} />
                        </span>
                        <span
                          data-uid={item.uid}
                          className={styles["img-mask__event"]}
                          onClick={changeMainMap}
                        >
                          设为主图
                        </span>
                      </span>
                    </span>
                  )
                })
              }
              <Upload
                name='upfile'
                data={{
                  bucketName: 'productPictrue'
                }}
                beforeUpload={beforeUpload}
                onStart= {(file) => {
                  changeLoaddingStatus(true)
                }}
                onSuccess={(file) => {
                  changeLoaddingStatus(false)
                  dispatch({
                    type: 'businessManagement_commodity/changeProductSettings',
                    action: {
                      type: 'addFile',
                      payload: {
                        uid: file.data.url,
                        url: file.data.url,
                        isMain: false
                        // name: fileList[0].response.name,
                        // status: fileList[0].status,
                      }
                    }
                  })
                }}
                onError={() => {
                  changeLoaddingStatus(false)
                }}
                disabled={isLoadding}
                action="https://api.uwooz.com/mxapi/uploade/source"
                listType="picture-card"
                fileList={[]}
              >
                <Spin tip="上传中..." spinning={isLoadding}>
                  {fileList.length >= 10 ? null : uploadButton}
                </Spin>
              </Upload>
            </div>
          </div>
        </Form.Item>
      </div>
      <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  );
}

export default connect()(React.memo(BasicInformation))