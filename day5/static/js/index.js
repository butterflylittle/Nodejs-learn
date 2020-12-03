// ajax({
//     method: 'post',
//     url: '/getData',
//     query: {
//         a: 1,
//         b: 2
//     },
//     data: {
//         x: 1,
//         y: 2
//     },
//     success(data) {
//         console.log('data', data);
//     }
// });

let uploadBtnElement = document.querySelector(".uploadBtn");
let uploadFileElement = document.querySelector("#uploadFile");
let taskBodyElement = document.querySelector(".task_body");
let taskPanelElement = document.querySelector(".task_panel");
let allClose = document.querySelector(".all-close");
let contentList = document.querySelector(".content-list");
newData();

// 刷新页面
allClose.onclick = function () {
  setTimeout(() => {
    taskPanelElement.style.display = "none";
  }, 500);
};

uploadBtnElement.onclick = function () {
  uploadFileElement.click();
};

// 内容发生改变了，已经选择了上传文件
uploadFileElement.onchange = function () {
  // console.log('upload');
  // console.dir(this.files);
  for (let file of this.files) {
    // console.log(file);
    uploadFile({
      file,
    });
  }
};

function uploadFile(data) {
  let li = document.createElement("li");
  li.innerHTML = `
        <span>${data.file.name}</span>
        <div class="task-progress-status">
            上传中……
        </div>
        <div class="progress"></div>
    `;
  let taskProgressStatusElement = li.querySelector(".task-progress-status");
  let progressElement = li.querySelector(".progress");
  taskBodyElement.appendChild(li);

  ajax({
    method: "post",
    url: "/upload",
    data,
    success(data) {
      data = JSON.parse(data);
      console.log("data", data);

      let img = new Image();
      img.src = data.url;
      contentList.appendChild(img);

      setTimeout(() => {
        // li.remove();
        taskProgressStatusElement.innerHTML = "上传完成";
        allClose.click();
      }, 1000);
    },
    onprogress(ev) {
      // console.log('ev', ev);
      progressElement.style.width = (ev.loaded / ev.total) * 100 + "%";
    },
  });
}
// 修改数据
function newData() {
  ajax({
    method: "get",
    url: "/getPhotos",
    success(data) {
      data = JSON.parse(data);
      for (let i = 0; i < data.length; i++) {
        let img = new Image();
        img.src = data[i].url;
        contentList.appendChild(img);
      }
    },
  });
}
