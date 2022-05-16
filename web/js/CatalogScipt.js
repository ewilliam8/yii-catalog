const HOST = "localhost"
const PORT = 3000
const PROTOCOL = "http"

let profiles
let directions
let localUserInfo = {
  "user_directions": [],
  "profile_user": []
}
let chooseFirstStart = true
let choosenDirections = []

const form = document.getElementById("form");
const search = document.getElementById("search");
const catalog = document.getElementById("catalog");
const choose = document.getElementById("choose");
const entry = document.getElementById("search");

// const get_all_directions_url = `${PROTOCOL}://${HOST}:${PORT}/web/directions`
// const get_all_profiles_url = `${PROTOCOL}://${HOST}:${PORT}/api/profiles`
// const get_profiles_url = (id) =>  `${PROTOCOL}://${HOST}:${PORT}/api/profiles/${id}`
// const get_user_info_url = (username) => `${PROTOCOL}://${HOST}:${PORT}/api/info/${username}`
// const post_user_data = `${PROTOCOL}://${HOST}:${PORT}/api/save`

const url_directions = 'http://catalog.loc/web/directions'
const url_users = 'http://catalog.loc/web/users'
const url_profiles = 'http://catalog.loc/web/profiles'
const url_user_directions = 'http://catalog.loc/web/userdirections'

const url_user_profiles = 'http://catalog.loc/web/uprofiles'
const url_post_data_users = 'http://catalog.loc/web/users'

async function yii_get_users () {
  const resp = await fetch(url_users, { origin: "cors" });
  const respData = await resp.json();   

  return respData
}

async function yii_get_directions () {
  const resp = await fetch(url_directions, { origin: "cors" });
  const respData = await resp.json();

  return respData
}
async function yii_get_profiles () {
  const resp = await fetch(url_profiles, { origin: "cors" });
  const respData = await resp.json();

  return respData
}
async function yii_get_user_profiles () {
  const resp = await fetch(url_user_profiles, { origin: "cors" });
  const respData = await resp.json();

  return respData
}
async function yii_get_user_directions () {
  const resp = await fetch(url_user_directions, { origin: "cors" });
  const respData = await resp.json();

  return respData
}

async function createPost(data, url) {
  let r
  await fetch(url, {
    method: 'POST',
    body: JSON.stringify(data).replace("'",'"'),
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
  })
  .then(response=>response.json())
  .then(data=>{ r = data })

  return r
}

function addProfile (elem, htmlClass, html) {
  const div = document.createElement("div");
  div.classList.add(htmlClass);
  div.innerHTML = html

  elem.appendChild(div)
}

function clear_choose () {
  choose.innerHTML = `<h2>Выберите направление</h2>
  <p>В левой колонке нажмите на напраление, чтобы добавить в каталог.</p>`;
  chooseFirstStart = true
  choosenDirections = []
  localUserInfo = {
    "user_directions": [],
    "profile_user": []
  }
}

async function main () {
  
  directions = await yii_get_directions()
  profiles = await yii_get_profiles()

  addDirectionsToCatalog()
  addProfilesToDirections()
}

async function addDirectionsToCatalog () {
  catalog.innerHTML = "";

  directions.forEach((element, index) => {
    const item = document.createElement("div");
    item.classList.add("direction");
    item.classList.add("border");
    item.classList.add("border-primary");
    item.classList.add("rounded");
    item.classList.add("p-3");

    item.innerHTML = `
    <button class="profile" id="direction_${element["id"]}" onclick="addToCatalog(${element["id"]})">
       <h3>${index + 1} ${element["name"]}</h3>
    </button>
    `;

    catalog.appendChild(item);
  });
}

async function addProfilesToDirections () {
  profiles.forEach((profile, index) => {
    const direction = document.getElementById(`direction_${profile["direction_id"]}`);
    const html = `<p id="direction_${profile["direction_id"]}">${profile["name"]}</p>`;

    addProfile(direction, "profile_inner", html)
  })
}

function addToCatalog(id) {
  if (chooseFirstStart) {
    choose.innerHTML = "";
    chooseFirstStart = false
  }

  // check an "id" is in the array
  if (choosenDirections.some(item => item === id)) {
    return
  }

  choosenDirections.push(id)

  let last_priority
  if(localUserInfo["user_directions"].length == 0) last_priority = 0
  else last_priority = localUserInfo["user_directions"].length

  localUserInfo["user_directions"].push({
    "id": id,
    "direction_id": id,
    "priority": last_priority,
    "createdAt": new Date(Date.now()+(1000*60*(-(new Date()).getTimezoneOffset()))).toISOString().replace('T',' ').replace('Z',''),
    "updatedAt": new Date(Date.now()+(1000*60*(-(new Date()).getTimezoneOffset()))).toISOString().replace('T',' ').replace('Z',''),
  })

  let priority_counter = 0
  profiles.forEach(profile => {
    if(profile["direction_id"] == id) {
      localUserInfo["profile_user"].push({
        "id": profile.id,
        "profile_id": profile.id,
        "direction_id": profile.direction_id,
        "priority": priority_counter,
        "createdAt": new Date(Date.now()+(1000*60*(-(new Date()).getTimezoneOffset()))).toISOString().replace('T',' ').replace('Z',''),
        "updatedAt": new Date(Date.now()+(1000*60*(-(new Date()).getTimezoneOffset()))).toISOString().replace('T',' ').replace('Z',''),
      })
      priority_counter++
    }
  })

  structure()
}

function deleteFromCatalog(id) {

  choosenDirections.forEach((elem, index) => {
    if(elem == id) {
      choosenDirections.splice(index, 1)
    }
  })
  localUserInfo.user_directions.forEach((elem, index) => {
    if(elem.direction_id == id) {
      delete localUserInfo.user_directions[index]
    }
  })
  localUserInfo.profile_user.forEach((elem, index) => {
    if (elem.direction_id == id) {
      delete localUserInfo.profile_user[index]
    }
  })

  structure()
}

function move_direction(priority, course) {
  const arr = localUserInfo["user_directions"]
  let helper

  if (course == "up") {
    helper = arr[priority - 1]["priority"]
    arr[priority - 1]["priority"] = arr[priority]["priority"]
    arr[priority]["priority"] = helper
  }
  else {
    helper = arr[priority + 1]["priority"]
    arr[priority + 1]["priority"] = arr[priority]["priority"]
    arr[priority]["priority"] = helper
  }

  structure()
}

function move_profile (direction_id, priority, course) {
  if (course == "up") {
    let obj_1 = localUserInfo["profile_user"].find(o => o.priority == priority - 1 && o.direction_id == direction_id);
    let obj_2 = localUserInfo["profile_user"].find(o => o.priority == priority && o.direction_id == direction_id);

    localUserInfo["profile_user"].find(o => o.id == obj_1.id)["priority"] = priority
    localUserInfo["profile_user"].find(o => o.id == obj_2.id)["priority"] = priority - 1
  } else {
    let obj_1 = localUserInfo["profile_user"].find(o => o.priority == priority && o.direction_id == direction_id);
    let obj_2 = localUserInfo["profile_user"].find(o => o.priority == priority + 1 && o.direction_id == direction_id);

    localUserInfo["profile_user"].find(o => o.id == obj_1.id)["priority"] = priority + 1
    localUserInfo["profile_user"].find(o => o.id == obj_2.id)["priority"] = priority
  }

  structure()
}

function structure() {
  choose.innerHTML = "";
  chooseFirstStart = false

  // sorting
  localUserInfo["user_directions"].sort((a, b) => {
    return a.priority - b.priority
  })
  localUserInfo["profile_user"].sort((a, b) => {
    return a.priority - b.priority
  })

  let priority = []
  localUserInfo["user_directions"].forEach((elem, index) => {
    elem["priority"] = index
    priority.push(elem["priority"])
  })

  // directions
  localUserInfo["user_directions"].forEach((elem, index) => {
    const item = document.createElement("div");
    item.classList.add("direction");
    item.classList.add("border");
    item.classList.add("border-primary");
    item.classList.add("rounded");
    item.classList.add("p-3");

    let arrows_d
    if (elem["priority"] == 0 && priority.length !== 1) {
      arrows_d = `<div class="column">
      <button class="down" onclick="move_direction(${elem["priority"]}, 'down')">↓</button></div>`
    }
    else if (elem["priority"] == priority.length - 1 && priority.length > 1) {
      arrows_d = `<div class="column">
          <button class="up" onclick="move_direction(${elem["priority"]}, 'up')">↑</button></div>`
    }
    else if (priority.length > 1) {
      arrows_d =  `<div class="column">
                <button class="up" onclick="move_direction(${elem["priority"]}, 'up')">↑</button>
                <button class="down" onclick="move_direction(${elem["priority"]}, 'down')">↓</button></div>`
    }
    else {
      arrows_d = ''
    }

    item.innerHTML = `
    <div>
      ${arrows_d}
      <button class="profile" onclick="deleteFromCatalog(${elem.direction_id})">
        <h3>${index + 1} ${directions[parseInt(elem["direction_id"] - 1, 10)]["name"]}</h3>
      </button>
    </div>
    `;
    
    choose.appendChild(item);

    // profiles
    let choosen_profile = []
    localUserInfo["profile_user"].forEach(profile_elem => {
      if(profile_elem["direction_id"] == elem["direction_id"]) {
        choosen_profile.push(profile_elem["priority"])
      }
    })

    localUserInfo["profile_user"].forEach((profile_elem, index) => {
      if(profile_elem["direction_id"] == elem["direction_id"]) {
        const profile_item = document.createElement("div");
        const profile_id = parseInt(profile_elem["profile_id"], 10)
        profile_item.classList.add("profile_inner");

        let arrows_p
        if (choosen_profile.length == 1) {
          arrows_p = ''
        }
        else if (profile_elem["priority"] == 0) {
          arrows_p = `<div class="column">
          <button class="down" onclick="move_profile(${profile_elem["direction_id"]}, ${profile_elem["priority"]}, 'down')">↓</button></div>`
        }
        else if (profile_elem["priority"] == choosen_profile[choosen_profile.length - 1]) {
          arrows_p = `<div class="column">
          <button class="up" onclick="move_profile(${profile_elem["direction_id"]}, ${profile_elem["priority"]}, 'up')">↑</button></div>`
        }
        else if (choosen_profile[choosen_profile.length - 1] > 1){
          arrows_p = `<div class="column">
          <button class="up" onclick="move_profile(${profile_elem["direction_id"]}, ${profile_elem["priority"]}, 'up')">↑</button>
          <button class="down" onclick="move_profile(${profile_elem["direction_id"]}, ${profile_elem["priority"]}, 'down')">↓</button></div>`
        }
        else {
          arrows_p = ''
        }

        profile_item.innerHTML = `
        ${arrows_p}
        <p>${profiles[profile_id - 1]["name"]}</p>
        `;

        item.appendChild(profile_item)
      }
    })
  })
}

async function saveUserInfo() {
  const value = entry.value
  if (!value) {
    alert("Введите имя пользователя")
    return
  }
  localUserInfo.username = value

  // user
  const userid = await createPost({"name": value}, url_post_data_users)

  // directions
  await localUserInfo.user_directions.forEach(elem => {
    delete elem.id
    delete elem.createdAt
    delete elem.updatedAt
    elem["user_id"] = userid.id
    createPost(elem, url_user_directions)
  })

  // profiles
  await localUserInfo.profile_user.forEach(elem => {
    delete elem.id
    delete elem.createdAt
    delete elem.updatedAt
    elem["user_id"] = userid.id
    createPost(elem, url_user_profiles)
    // .then((res) => console.log(res))
  })
}

async function getUserInfo() {
  clear_choose ()
  const value = entry.value
  if (!value) {
    alert("Введите имя пользователя")
    return
  }

  // user
  const users = await yii_get_users()
  if (users.length == 0) {
    alert("В базе данных нет ни одной записи")
    return
  }

  let user_id
  users.forEach(elem => {
    if(elem.name == value) {
      user_id = elem.id
    }
  })

  // directions
  const user_directions = await yii_get_user_directions()
  if (users.length == 0) {
    alert("В базе данных нет ни одной записи о направлениях")
    return
  }

  user_directions.forEach(elem => {
    if(elem.user_id == user_id) {
      localUserInfo.user_directions.push(elem)
      choosenDirections.push(elem["direction_id"])
    }
  })

  // profiles
  const user_profiles = await yii_get_user_profiles()
  if (users.length == 0) {
    alert("В базе данных нет ни одной записи о профилях")
    return
  }

  user_profiles.forEach(elem => {
    if(elem.user_id == user_id) {
      localUserInfo.profile_user.push(elem)
    }
  })

  // console.log(localUserInfo)


  // const userinfo = await get_user_info(value)
  // if (Object.keys(userinfo).length === 0 && userinfo.constructor === Object)
  //   return

  // localUserInfo = userinfo

  structure()
}


main()

