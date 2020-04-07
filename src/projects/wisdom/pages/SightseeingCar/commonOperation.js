import axios from "@/utils/ajax";

export default class Communal {
  // 图片上传
  static fileSelected(nodeInfo) {
    let {
      that, // 绑定this
      imgSrc = "imgSrc", // 返回数据时写入state对象的属性
      node = {} // 图片
    } = nodeInfo;

    console.log(nodeInfo);

    let rFilter = /^(image\/bmp|image\/gif|image\/jpeg|image\/png|image\/tiff)$/i;
    console.log(node.files);
    if (node.files.length === 0) {
      return;
    }

    if (!rFilter.test(node.files[0].type)) {
      alert("文件格式必须为图片");
      return;
    }

    let formData = new FormData();
    formData.append("upfile", node.files[0]);

    let params = {
      bucketName: "test",
      formData
    };

    axios
      .ajax({
        url: "https://api.uwooz.com/mxapi/uploade/source",
        method: "POST",
        params: params,
        headers: {
          "Content-Type": "multipart/form-data"
        },
        data: formData
      })
      .then(data => {
        if (data.data) {
          let src_url = data.data.url;

          that.setState({
            [imgSrc]: src_url
          });
          console.log(that.state.imgSrc);
        }
      })
      .catch(data => {
        console.log(data);
      });
  }

  // 线路权限
  static lineAuthority(lineList) {
    let {
      that, // 绑定this
      routeNameList = "routeNameList" // 返回数据时写入state对象的属性
    } = lineList;

    let params = {
      page: 1,
      pageSize: 99999
    };

    let data = {
      scenicId: 1,
      sourceId: 2
    };

    // 合并对象
    params = {
      ...data,
      ...params
    };

    // 请求 == 线路权限 == 的数据接口
    let options = {
      url: "/sightseeing/routeS",
      method: "POST",
      params
    };

    // 请求数据的操作
    axios.ajax(options).then(data => {
      if (data.errorCode === 200) {
        const lineList = data.data.data;
        console.log("线路权限列表: ");
        console.log(lineList);

        that.setState({
          [routeNameList]: lineList
        });
      } else {
        alert("数据加载有误!");
      }
    });
  }

  // 管理人员列表
  static adminDataList(adminDeploy) {
    let { that, adminDataList = "adminDataList" } = adminDeploy;

    let params = "";

    let data = {
      sourceId: 2,
      scenicId: 1
    };

    // 合并对象
    params = {
      ...data,
      ...this.params
    };

    // 请求 == 观光车人员管理列表 == 数据的接口参数
    let options = {
      url: "/sightseeing/canManage",
      method: "POST",
      params
    };

    // 请求数据的操作
    axios.ajax(options).then(data => {
      if (data.errorCode === 200) {
        const datad = data.data;
        // console.log("管理员数量: ----- " + datad.length);

        that.setState({
          [adminDataList]: datad
        });
      } else {
        alert(data.errorCode);
      }
    });
  }
}
