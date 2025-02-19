import * as Firebase from "../common/firebase.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {
  getDatabase,
  ref,
  update as dbUpdate,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

const right1 = document.getElementById("right1");
const right2 = document.getElementById("right2");
const change = document.getElementById("change");
const changechange = document.getElementById("changechange");

const yesChanged = document.getElementById("yesChanged");
const noChanged = document.getElementById("noChanged");
const profilePhoto = document.getElementById("profilePhoto");
const inputName = document.getElementById("inputName");
const inputPhone = document.getElementById("inputPhone");
const inputmail = document.getElementById("inputmail");
/*打開星星標籤取消星星標籤 */

function getCollect() {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const db = getDatabase();

  console.log(currentUser.uid);
  const userRef = ref(db, `user/${currentUser.uid}/collect`);

  onValue(userRef, (snapshot) => {
    const collectData = snapshot.val();
    // 先清空現有內容，避免重複
    document.getElementById("right2").innerHTML = "";

    if (collectData) {
      // 添加檢查，確保 collectData 存在
      Object.entries(collectData).forEach(([key, item]) => {
        // 使用 entries 來獲取 key
        const imgUrl = item.collectedImg;
        const name = item.collectedName;
        const uid = item.collectedUid;

        const collectArticle = document.createElement("div");
        collectArticle.className = "collectedStar";
        collectArticle.innerHTML = `          
        <a href="../content/content.html?uid=${uid}"><img class="collectedStarImg" src=${imgUrl}></img></a>
          <p class="collectedName">${name}</p>
        <div class="trashBin" id="${uid}trash"></div>
        `;
        document.getElementById("right2").appendChild(collectArticle);

        document
          .getElementById(`${uid}trash`)
          .addEventListener("click", function () {
            // 使用具體的路徑來刪除特定項目
            const itemRef = ref(db, `user/${currentUser.uid}/collect/${key}`);
            remove(itemRef)
              .then(() => {
                console.log("項目已成功刪除");
                collectArticle.remove(); // 可以保留這行，因為操作成功後移除 DOM 元素
              })
              .catch((error) => {
                console.error("刪除時發生錯誤:", error);
              });
          });
      });
    }
  });
}

const auth = getAuth();
auth.onAuthStateChanged((user) => {
  if (user) {
    getCollect();
  } else {
    console.log("No user is signed in");
  }
});
/*打開星星標籤取消星星標籤 */

let originalData = {
  name: "",
  phone: "",
  email: "",
};

const memeberLogout = document.getElementById("memeberLogout");
memeberLogout.addEventListener("click", function () {
  Firebase.logout();
  window.location.href = "../index/index.html";
});

const memeberId = document.getElementById("memeberId");
memeberId.addEventListener("click", function () {
  right1.style.display = "flex";
  right2.style.display = "none";
  change.style.display = "none";
  changechange.style.display = "flex";
});

const collect = document.getElementById("collect");
collect.addEventListener("click", function () {
  right1.style.display = "none";
  right2.style.display = "flex";
});

const infoChanged = document.getElementById("infoChanged");
infoChanged.addEventListener("click", function () {
  change.style.display = "flex";
  changechange.style.display = "none";
});

infoChanged.addEventListener("click", function () {
  // 儲存當前資料
  saveOriginalData();

  // 顯示確認/取消按鈕，隱藏修改按鈕
  change.style.display = "flex";
  changechange.style.display = "none";

  enableInputs();
});

yesChanged.addEventListener("click", function () {
  // 儲存新的資料到 localStorage
  const newData = {
    name: inputName.value,
    phone: inputPhone.value,
    email: inputmail.value,
  };

  localStorage.setItem("memberData", JSON.stringify(newData));

  // 停用輸入欄位
  disableInputs();
  update(inputName.value, inputPhone.value);
  // 切換回原始介面
  change.style.display = "none";
  changechange.style.display = "flex";
});

function update(newName, newPhone) {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (!currentUser) {
    console.error("No user is currently signed in");
    return;
  }

  const db = getDatabase();
  const userRef = ref(db, "user/" + currentUser.uid);

  const updates = {
    username: newName,
    phone: newPhone,
  };

  dbUpdate(userRef, updates)
    .then(() => {
      console.log("Profile updated successfully");
    })
    .catch((error) => {
      console.error("Error updating profile:", error);
    });
}

noChanged.addEventListener("click", function () {
  // 恢復原始資料
  restoreOriginalData();

  // 停用輸入欄位
  disableInputs();

  // 切換回原始介面
  change.style.display = "none";
  changechange.style.display = "flex";
});

function saveOriginalData() {
  originalData.name = inputName.value;
  originalData.phone = inputPhone.value;
  originalData.email = inputmail.value;
}

function restoreOriginalData() {
  inputName.value = originalData.name;
  inputPhone.value = originalData.phone;
  inputmail.value = originalData.email;
}

function enableInputs() {
  inputName.disabled = false;
  inputPhone.disabled = false;
  inputName.style.border = "3px solid rgba(230, 230, 230, 0.7)";
  inputPhone.style.border = "3px solid rgba(230, 230, 230, 0.7)";
}

// 停用輸入欄位
function disableInputs() {
  inputName.disabled = true;
  inputPhone.disabled = true;
  inputName.style.border = "0px solid rgba(230, 230, 230, 0.7)";
  inputPhone.style.border = "0px solid rgba(230, 230, 230, 0.7)";
}
