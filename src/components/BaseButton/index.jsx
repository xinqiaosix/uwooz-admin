import React from 'react'
import { Button } from 'antd'
import styles from './index.module.scss'

/**
 * 自定义Button组件样式.
 * @function BaseButton
 * @param {object} props - 用户传入的参数.
 * @param {string} props.type - 按钮类型.
 * @param {string} props.className - 按钮的class.
 * @param {string} props.args - 按钮的class.
 * @return {component} 返回经过增强的Button组件.
 */

function BaseButton(props) {
    const {type, className, ...args} = props;
    return (
        // 透传其它参数，合并className
        <Button {...args} className={`${className} ${styles[type]}`}>{props.children}</Button>
    )
}

export default BaseButton;