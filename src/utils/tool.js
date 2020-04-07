import React from 'react';
import { Select, Radio } from 'antd'
const Option = Select.Option;
export default {
    // 将原本为秒数的时间替换固定的时间格式
    formateDate(time){
        if(!time)return '';
        let date = new Date(time);
        return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
    },

    // 分页按钮的封装函数
    pagination(_this, data, pages, callback){ // _this为绑定this指向，data为接口返回的值， pages为控制分页是否显示快速跳转，是否可以改变显示数据条数，callback为回调函数
        // 改变每页显示数据数目时触发的函数
        function onShowSizeChange(current, pageSize) {
            _this.params.page = current;
            _this.params.pageSize = pageSize;
            _this.requestList();
        }

        return {
            onChange:(current)=>{
                callback(current)
            },
            current:data.page || 1, // 当前选中页
            pageSize:data.pageSize || 10, // 每页显示条数
            total: data.total, // 总共有多少条数据
            showTotal:()=>{
                return `共${data.total}条`
            },
            showQuickJumper: pages.showQuickJumper || false, // 是否显示快速跳转
            showSizeChanger: pages.showSizeChanger || false, // 是否可以更改每页显示的条数
            size: pages.size || 'middle',
            onShowSizeChange: onShowSizeChange
        }
    },

    // 输出选择框的各个选项
    getOptionList(data, optionName, notShowAll){
        if(!data){
            return [];
        }
        let options = notShowAll ? [] : [<Option value="" key="all_key">全部</Option>];
        data.forEach((item, index)=>{
            options.push(<Option value={item.id} key={item.id}>{optionName ? item[optionName] : item.name}</Option>)
        })
        return options;
    },

    // 输出选择框的各个选项
    getRadioList(data){
        if(!data){
            return [];
        }
        let options = [] //[<Option value="0" key="all_key">全部</Option>];
        data.forEach((item)=>{
            options.push(<Radio value={item.id} key={item.id}>{item.name}</Radio>)
        })
        return options;
    },

    // 触发时更改存储的选中项
    updateSelectedItem(selectedRowKeys, selectedItem, selectedIds){
        console.log(selectedItem)
        if (selectedIds){
            this.setState({
                selectedRowKeys,
                selectedItem,
                selectedIds
            })
        }else{
            this.setState({
                selectedRowKeys,
                selectedItem
            })
        }
    },

    // 生成excel表格并下载
    downloadExcel(_this, titleArr, attribute, data, name) { // _this为绑定住的this指向，titleArr为表格标题，attributes为要生成的字段，data为数据，name为表格名称
        let num = 0;
        let tbody = '',
            tr = '',
            th = '';
        let titleArrs = titleArr || [];
        let attributes = attribute || [];
        let datas = data || [];
        titleArrs.forEach(function(item){
            th += '<th style="background-color:#3F3F3F; text-align:center; color:#fff;">' + item + '</th>'
        });
        tr = '<tr>' + th + '</tr>';
        tbody += tr;
        datas.forEach(function(items) {
            let tr = '', 
                td = '';
            Object.keys(items).forEach(function (item) {
                if (attributes.indexOf(item) !== -1) {
                    if (num % 2 === 0) {
                        td += '<td style="text-align:center; background-color:#fff; font-family:宋体;">' + items[item] + '</td>'
                    } else {
                        td += '<td style="text-align:center; background-color:#f5f5f5; font-family:宋体;">' + items[item] + '</td>'
                    }
                }
            });
            tr = '<tr style="font-family:宋体;">' + td + '</tr>';
            tbody += tr;
            num++;
        })
        let table = '<table border="1px solid #aaa;" style="font-size:20px; font-family:宋体;">' + tbody + '</table>';
        let html = "<html><head><meta charset='utf-8' /></head><body>" + table + "</body></html>";
        var blob = new Blob([html], { type: "application/vnd.ms-excel" });
        const link = document.createElement("a")
        link.href = URL.createObjectURL(blob)
        link.download = `${name || '数据'}.xls` // 这里填保存成的文件名
        link.click()
        URL.revokeObjectURL(link.href)
    }
}