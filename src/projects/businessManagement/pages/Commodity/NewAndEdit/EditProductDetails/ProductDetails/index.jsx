import React, { useState } from 'react';
import { connect } from 'dva';
import ReactPlayer from 'react-player'
import {
  Form,
  Upload,
  Icon,
  Spin,
  message,
  Modal
} from 'antd'
// 引入编辑器组件
import BraftEditor from 'braft-editor'
// 引入编辑器样式
import 'braft-editor/dist/index.css'
import styles from './index.module.scss'

// 编辑商品详情的商品详情
function ProductDetails(props) {
  const { dispatch, productDetail, instruction, videoUrl } = props;
  const [isLoadding, toggleIsLoadding] = useState(false)
  const [previewVisible, togglePreviewVisible] = useState(false)  // 图片的预览Modal显示控制

  // 上传按钮组件
  const uploadButton = (
    <div>
      <Icon type={isLoadding ? 'loading' : 'plus'} />
      <div className="ant-upload-text">上传</div>
    </div>
  );

  // 修改商品详情内容
  function changeProductDetailsEditor(editorState) {
    console.log(editorState.toHTML())
    dispatch({
      type: 'businessManagement_commodity/changeProductDetails',
      action: {
        payload: {
          productDetail: editorState.toHTML()
        }
      }
    })
    // console.log(editorState.toHTML())
  }

  // 修改商品售后说明
  function ChangeAfterSalesInstructionsEditor(editorState) {
    dispatch({
      type: 'businessManagement_commodity/changeProductDetails',
      action: {
        payload: {
          instruction: editorState.toHTML()
        }
      }
    })
    // console.log(editorState.toHTML())
  }

  // 限制上传文件的大小和类型
  function beforeUpload(file) {
    const isJpgOrPng = file.type === 'video/mp4' || file.type === 'video/webm';
    if (!isJpgOrPng) {
      message.error('视频格式只能为mp4');
    }
    const isLt20M = file.size / 1024 / 1024 < 20;
    if (!isLt20M) {
      message.error('视频要小于20MB!');
    }
    return isJpgOrPng && isLt20M;
  }

  // function onChange ({ file }) {
  //   if (file.status === 'uploading') {
  //     toggleIsLoadding(true);
  //     return;
  //   }
  //   if (file.status === 'done') {
  //     // Get this url from response in real world.
  //     getBase64(file.originFileObj, videoUrl => {
  //       toggleIsLoadding(false);
  //       dispatch({
  //         type: 'businessManagement_commodity/changeProductDetails',
  //         action: {
  //           payload: {
  //             videoUrl: videoUrl
  //           }
  //         }
  //       })
  //     });
  //   }
  // };

  // 设置预览的图片
  async function handlePreview(file) {
    togglePreviewVisible(true)
  }

  // 移除图片
  function onRemove(e) {
    dispatch({
      type: 'businessManagement_commodity/changeProductDetails',
      action: {
        payload: {
          videoUrl: null
        }
      }
    })
  }

  // 关闭预览
  function handleCancel() {
    togglePreviewVisible(false)
  }

  const prefix = 'productDetails'
  return (
    <div className={styles[`${prefix}`]}>
      <h2 className={styles[`${prefix}__title`]}>商品详情</h2>
      <div className={styles[`${prefix}-form`]}>
        <Form.Item label="商品详情">
          <BraftEditor
            value={BraftEditor.createEditorState(productDetail)}
            onBlur={changeProductDetailsEditor}
            className={styles[`${prefix}-editor`]}
          />
        </Form.Item>
        <Form.Item label="售后说明">
          <BraftEditor
            value={BraftEditor.createEditorState(instruction)}
            onBlur={ChangeAfterSalesInstructionsEditor}
            className={styles[`${prefix}-editor`]}
          />
        </Form.Item>
        <Form.Item label="商品视频" extra="建议时长：15s内，建议分辨率：1280*720，不超过20M">
          <div className={styles["showPictrue"]}>
            {
              videoUrl ?
                <span className={styles["showPictrue__img-wrap"]} >
                  <img src={`${videoUrl}?x-oss-process=video/snapshot,t_1000,f_jpg,w_200,h_150,m_fast`} alt='视频封面' />
                  <span className={styles["img-mask"]}>
                    <span className={styles["img-mask__icon-wrap"]}>
                      <Icon type="eye" className={styles["img-mask__icon"]} onClick={() => handlePreview()} />
                      <Icon type="delete" className={styles["img-mask__icon"]}  onClick={onRemove} />
                    </span>
                  </span>
                </span>
              :
              <Upload
                name="upfile"
                data={{
                  bucketName: 'productVideo'
                }}
                onStart={(file) => {
                  toggleIsLoadding(true)
                }}
                onSuccess={(file) => {
                  toggleIsLoadding(false)
                  dispatch({
                    type: 'businessManagement_commodity/changeProductDetails',
                    action: {
                      payload: {
                        videoUrl: file.data.url
                      }
                    }
                  })
                }}
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="https://api.uwooz.com/mxapi/uploade/source"
                beforeUpload={beforeUpload}
                disabled={isLoadding}
                // onChange={onChange}
              >
                <Spin tip="上传中..." spinning={isLoadding}>
                  {videoUrl ? <img src={`${videoUrl}?x-oss-process=video/snapshot,t_1000,f_jpg,w_200,h_150,m_fast`} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                </Spin>
              </Upload> 
            } 
          </div>
        </Form.Item>
      </div>
      <Modal visible={previewVisible} footer={null} onCancel={handleCancel} destroyOnClose={true}>
        <ReactPlayer 
          url={videoUrl} 
          playing 
          controls 
          width='100%'
          height='auto' 
          
        />
      </Modal>
    </div>
  )
}

const mapStateToProps = ({ businessManagement_commodity: state }) => {
  const { productDetails } = state;
  const { productDetail, instruction, videoUrl } = productDetails;
  return { productDetail, instruction, videoUrl }
}

export default connect(mapStateToProps)(ProductDetails);