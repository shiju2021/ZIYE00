const jsname = '葱花视频'
const $ = Env(jsname)
const logs = $.getdata('logbutton'); //0为关闭日志，1为开启,默认为0
const notifyInterval = $.getdata('tzbutton'); //0为关闭通知，1为所有通知,默认为0
now = new Date(new Date().getTime() + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000);

let task = '';
let tz = '';
let uid = $.getdata('uid')
let headerVal = {
  'User-Agent': `cong hua shi pin/1.4.6 (iPhone; iOS 14.1; Scale/2.00)`,
  'Accept': `*/*`,
  'Accept-Encoding': `gzip, deflate, br`,
  'Connection': `keep-alive`,
  'Content-Type': `application/x-www-form-urlencoded`,
  'Host': `app.kxp.com`,
  'Accept-Language': `zh-Hans-CN;q=1, en-CN;q=0.9`
};

const taskcenterbodyArr = [];
let taskcenterbodyVal = "";

const sharebodyArr = [];
let sharebodyVal = "";

const sharerewardbodyArr = [];
let sharerewardbodyVal = "";

let sharescore = 0;

let bodys = $.getdata("chgetbody_video");
let bodys2 = $.getdata("chgetbody_share");
let indexLast = $.getdata('chgetbody_video_index');

$.begin = indexLast ? parseInt(indexLast, 10) : 1;



////////////////////////////////////////////////////////////////////////
if ($.isNode()) {
  if (process.env.SHAREBODY && process.env.SHAREBODY.indexOf('#') > -1) {
    sharebodyVal = process.env.SHAREBODY.split('#');
    console.log(`您选择的是用"#"隔开\n`)
  } else if (process.env.SHAREBODY && process.env.SHAREBODY.indexOf('\n') > -1) {
    sharebodyVal = process.env.SHAREBODY.split('\n');
    console.log(`您选择的是用换行隔开\n`)
  } else {
    sharebodyVal = process.env.SHAREBODY.split()
  }

  // 自定义多 cookie 之间连接的分隔符，默认为 \n 换行分割，不熟悉的不要改动和配置，为了兼容本地 node 执行
  COOKIES_SPLIT = process.env.COOKIES_SPLIT || "\n";

  console.log(
    `============ cookies分隔符为：${JSON.stringify(
      COOKIES_SPLIT
    )} =============\n`
  );
  if (
    process.env.TASKCENTERBODY &&
    process.env.TASKCENTERBODY.indexOf(COOKIES_SPLIT) > -1
  ) {
    taskcenterbodyVal = process.env.TASKCENTERBODY.split(COOKIES_SPLIT);
  } else {
    taskcenterbodyVal = process.env.TASKCENTERBODY.split();
  }

  if (
    process.env.SHAREREWARDBODY &&
    process.env.SHAREREWARDBODY.indexOf(COOKIES_SPLIT) > -1
  ) {
    sharerewardbodyVal = process.env.SHAREREWARDBODY.split(COOKIES_SPLIT);
  } else {
    sharerewardbodyVal = process.env.SHAREREWARDBODY.split();
  }

}


Object.keys(sharebodyVal).forEach((item) => {
  if (sharebodyVal[item]) {
    sharebodyArr.push(sharebodyVal[item])
  }
})


if ($.isNode()) {
    Object.keys(taskcenterbodyVal).forEach((item) => {
    if (taskcenterbodyVal[item]) {
      taskcenterbodyArr.push(taskcenterbodyVal[item])
    }
  });

  Object.keys(sharerewardbodyVal).forEach((item) => {
    if (sharerewardbodyVal[item]) {
      sharerewardbodyArr.push(sharerewardbodyVal[item])
    }
  });

} else {
  taskcenterbodyArr.push($.getdata('chgetbody_taskcenter'));
  sharerewardbodyArr.push($.getdata('chgetbody_sharereward'));
}


////////////////////////////////////////////////////////////////////////


!(async () => {
  taskcenterbodyVal = taskcenterbodyArr[0];
  O = (`🥦${jsname}任务执行通知🔔`);
  console.log(`\n✅ 打印任务状态清单`)
  await taskcenter(); //任务中心
  if (!sharebodyArr[0]) {
    console.log($.name, '【提示】请把分享视频的请求体填入Github 的 Secrets 中，请以#隔开')
    return;
  }
  $.index = 0;
  for (let i = 0; i < sharebodyArr.length; i++) {
    if (sharebodyArr[i]) {
      sharebody = sharebodyArr[i];
      $.index = $.index + 1;
      console.log(`\n✅ 执行分享视频任务【${$.index}】`)
    }
    await share(task); //分享
    await sharereward(task); //分享奖励
  }

  await showmsg();

})()
.catch((e) => $.logErr(e))
  .finally(() => $.done())

function showmsg() {
  if (notifyInterval != 1) {
    console.log(O + '' + tz);
  }

  if (notifyInterval == 1) {
    $.msg(O, '', tz);
  }
}

////////////////////////////////////////////////////////////////////////


//任务中心
function taskcenter() {
  return new Promise((resolve, reject) => {
    let taskurl = {
      url: `https://app.kxp.com/task/v1/task_center/data`,
      body: taskcenterbodyVal,
      headers: headerVal,
    }
    $.post(taskurl, async (error, resp, data) => {
      //$.log("tasklog:" + data+"\n")
      task = JSON.parse(data)
      //$.log(`【金币换算】:${(task.data.score/10000).toFixed(2)}\n`);
      $.log(`【${task.data.task_list[0].title}】:${task.data.task_list[0].button}`);
      $.log(`【${task.data.task_list[1].title}】:${task.data.task_list[1].button}`);
      $.log(`【${task.data.task_list[2].title}】:${task.data.task_list[2].button}`);
      $.log(`【${task.data.task_list[3].title}】:${task.data.task_list[3].button}`);
      $.log(`【${task.data.task_list[4].title}】:${task.data.task_list[4].button}`);

      //$.log(`【任务状态】:${task.data.task_list[6].status}\n`);

      resolve()
    })
  })
}


//分享视频赚钱
function share(task) {
  if (task.data.task_list[0].title_en === "share_video" || task.data.task_list[2].title_en === "share_video" || task.data.task_list[3].title_en === "share_video") {
    return new Promise((resolve, reject) => {
      let shareurl = {
        url: `https://app.kxp.com/video/v1/video/share`,
        body: sharebody,
        headers: headerVal,
      }
      $.post(shareurl, async (error, resp, data) => {
        let share = JSON.parse(data);
        if(logs==1) $.log(data)
        $.log(`分享任务奖励请求：成功🎉`);
        resolve()
      })
    })
  };
}


function sharereward(task) {
  if (task.data.task_list[0].title_en === "share_video") {
    return new Promise((resolve, reject) => {
      let sharerewardurl = {
        url: `https://app.kxp.com/task/v1/task_center/share_video_reward`,
        body: sharerewardbodyVal,
        headers: headerVal,
      }
      $.post(sharerewardurl, async (error, resp, data) => {
        let sharereward = JSON.parse(data);
        if (sharereward.code === 1007) {
          if(logs==1) $.log(data)
          $.log(`【分享奖励】：账号异常❌\n请评论,点赞,上传视频...并禁用脚本观察`)
          tz += `【分享奖励】：账号异常❌\n`;
        } else {
          if(logs==1) $.log(data)
          $.log(`本次任务获得${sharereward.data.score}个金币🏅`);
          tz += `【分享任务】：${sharescore}个金币\n`;
          sharescore += sharereward.data.score;
        }
        resolve()
      })
    })
  } else {
    $.log(`【分享视频】：已完成🎉`);
    resolve()
  }
}

//每天领金币（30min一次）
function timered(task) {
  if (task.data.task_list[0].status === 2 && task.data.task_list[0].title_en === "get_coin") {
    return new Promise((resolve, reject) => {
      const timeredurl = {
        url: `https://app.kxp.com/task/v1/task_center/red`,
        body: timeredbodyVal,
        headers: headerVal,
      };
      $.post(timeredurl, async (error, response, data) => {
        let timered = JSON.parse(data)
        nexttime = (timered.data.remain_time)*1000
        if (timered.code === 1007) {
          if(logs==1) $.log(data)
          $.log(`【时段奖励】：账号异常❌\n请评论,点赞,上传视频...并禁用脚本观察`)
          tz += `【时段奖励】：账号异常❌\n`;
        } else {
          if(logs==1) $.log(data)
          $.log(`【时段奖励】：获取${timered.data.score}金币`);
          $.log(`【下个时段】：`+ time(nexttime));
          tz += `【时段奖励】：${timered.data.score}金币\n`;
        }

        resolve()
      })
    })
  } else {
    $.log(`【时段奖励】：时间未到`);
    tz += `【时段奖励】：时间未到\n`;
  }
}

//执行阅读函数

function AutoRead() {
  return new Promise((resolve, reject) => {
    let url = {
      url: `https://app.kxp.com/video/v1/video/complete`,
      headers: headerVal,
      body: readbody
    };
    $.post(url, async (error, response, data) => {
      $.begin = $.begin + 1;
      let res = $.begin % readbodyArr.length
      $.setdata(res + "", 'chgetbody_body_index');
      let readres = JSON.parse(data);
      if (readres.code == '100006') {
        if(logs==1) $.log(data)
        $.log(`⛔️第${$.index}次-获取金币已达上限🥺,明日在来！`)
      } else if (readres.code == '1007') {
        if(logs==1) $.log(data)
        $.log(`【本次阅读${$.index}】：账号异常❌\n请评论,点赞,上传视频...并禁用脚本观察`)
        tz += `【本次阅读${$.index}】：账号异常❌\n`;
      } else if (typeof readres.data.score === 'number') {
        if(logs==1) $.log(data)
        await $.wait(30000);
        $.log(`【本次阅读】：${readres.data.score}个金币🏅`);
        readscore += readres.data.score;

      }
      resolve()
    })
  })
}

// prettier-ignore
function Jsname(){

$.log(`┎━━┰┒┎┰━━┰━━┰━━┰┒┎┰┒┎┰━━┒`)
$.log(`│┎━┦┕┚│┎┒│┎┒│┎┰┦┕┚││││┎┒│`)
$.log(`│┕━┦┎┒│┕┚││││┕┚│┎┒│┕┚│┎┒│`)
$.log(`┕━━┹┚┕┹━━┹┚┕┹━━┹┚┕┹━━┹┚┕┚`)

}


function time(time) {
  var date = new Date(time + 8 * 3600 * 1000);
  return date.toJSON().substr(0, 19).replace('T', ' ').replace(/-/g, '.');
}

function Env(t, e) {
  class s {
    constructor(t) {
      this.env = t
    }
    send(t, e = "GET") {
      t = "string" == typeof t ? {
        url: t
      } : t;
      let s = this.get;
      return "POST" === e && (s = this.post), new Promise((e, i) => {
        s.call(this, t, (t, s, r) => {
          t ? i(t) : e(s)
        })
      })
    }
    get(t) {
      return this.send.call(this.env, t)
    }
    post(t) {
      return this.send.call(this.env, t, "POST")
    }
  }
  return new class {
    constructor(t, e) {
      this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `\ud83d\udd14${this.name}, \u5f00\u59cb!`)
    }
    isNode() {
      return "undefined" != typeof module && !!module.exports
    }
    isQuanX() {
      return "undefined" != typeof $task
    }
    isSurge() {
      return "undefined" != typeof $httpClient && "undefined" == typeof $loon
    }
    isLoon() {
      return "undefined" != typeof $loon
    }
    toObj(t, e = null) {
      try {
        return JSON.parse(t)
      } catch {
        return e
      }
    }
    toStr(t, e = null) {
      try {
        return JSON.stringify(t)
      } catch {
        return e
      }
    }
    getjson(t, e) {
      let s = e;
      const i = this.getdata(t);
      if (i) try {
        s = JSON.parse(this.getdata(t))
      } catch {}
      return s
    }
    setjson(t, e) {
      try {
        return this.setdata(JSON.stringify(t), e)
      } catch {
        return !1
      }
    }
    getScript(t) {
      return new Promise(e => {
        this.get({
          url: t
        }, (t, s, i) => e(i))
      })
    }
    runScript(t, e) {
      return new Promise(s => {
        let i = this.getdata("@chavy_boxjs_userCfgs.httpapi");
        i = i ? i.replace(/\n/g, "").trim() : i;
        let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");
        r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r;
        const [o, h] = i.split("@"), a = {
          url: `http://${h}/v1/scripting/evaluate`,
          body: {
            script_text: t,
            mock_type: "cron",
            timeout: r
          },
          headers: {
            "X-Key": o,
            Accept: "*/*"
          }
        };
        this.post(a, (t, e, i) => s(i))
      }).catch(t => this.logErr(t))
    }
    loaddata() {
      if (!this.isNode()) return {}; {
        this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path");
        const t = this.path.resolve(this.dataFile),
          e = this.path.resolve(process.cwd(), this.dataFile),
          s = this.fs.existsSync(t),
          i = !s && this.fs.existsSync(e);
        if (!s && !i) return {}; {
          const i = s ? t : e;
          try {
            return JSON.parse(this.fs.readFileSync(i))
          } catch (t) {
            return {}
          }
        }
      }
    }
    writedata() {
      if (this.isNode()) {
        this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path");
        const t = this.path.resolve(this.dataFile),
          e = this.path.resolve(process.cwd(), this.dataFile),
          s = this.fs.existsSync(t),
          i = !s && this.fs.existsSync(e),
          r = JSON.stringify(this.data);
        s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r)
      }
    }
    lodash_get(t, e, s) {
      const i = e.replace(/\[(\d+)\]/g, ".$1").split(".");
      let r = t;
      for (const t of i)
        if (r = Object(r)[t], void 0 === r) return s;
      return r
    }
    lodash_set(t, e, s) {
      return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t)
    }
    getdata(t) {
      let e = this.getval(t);
      if (/^@/.test(t)) {
        const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : "";
        if (r) try {
          const t = JSON.parse(r);
          e = t ? this.lodash_get(t, i, "") : e
        } catch (t) {
          e = ""
        }
      }
      return e
    }
    setdata(t, e) {
      let s = !1;
      if (/^@/.test(e)) {
        const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}";
        try {
          const e = JSON.parse(h);
          this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i)
        } catch (e) {
          const o = {};
          this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i)
        }
      } else s = this.setval(t, e);
      return s
    }
    getval(t) {
      return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null
    }
    setval(t, e) {
      return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null
    }
    initGotEnv(t) {
      this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar))
    }
    get(t, e = (() => {})) {
      t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, {
        "X-Surge-Skip-Scripting": !1
      })), $httpClient.get(t, (t, s, i) => {
        !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i)
      })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {
        hints: !1
      })), $task.fetch(t).then(t => {
        const {
          statusCode: s,
          statusCode: i,
          headers: r,
          body: o
        } = t;
        e(null, {
          status: s,
          statusCode: i,
          headers: r,
          body: o
        }, o)
      }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => {
        try {
          if (t.headers["set-cookie"]) {
            const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();
            this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar
          }
        } catch (t) {
          this.logErr(t)
        }
      }).then(t => {
        const {
          statusCode: s,
          statusCode: i,
          headers: r,
          body: o
        } = t;
        e(null, {
          status: s,
          statusCode: i,
          headers: r,
          body: o
        }, o)
      }, t => {
        const {
          message: s,
          response: i
        } = t;
        e(s, i, i && i.body)
      }))
    }
    post(t, e = (() => {})) {
      if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, {
        "X-Surge-Skip-Scripting": !1
      })), $httpClient.post(t, (t, s, i) => {
        !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i)
      });
      else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {
        hints: !1
      })), $task.fetch(t).then(t => {
        const {
          statusCode: s,
          statusCode: i,
          headers: r,
          body: o
        } = t;
        e(null, {
          status: s,
          statusCode: i,
          headers: r,
          body: o
        }, o)
      }, t => e(t));
      else if (this.isNode()) {
        this.initGotEnv(t);
        const {
          url: s,
          ...i
        } = t;
        this.got.post(s, i).then(t => {
          const {
            statusCode: s,
            statusCode: i,
            headers: r,
            body: o
          } = t;
          e(null, {
            status: s,
            statusCode: i,
            headers: r,
            body: o
          }, o)
        }, t => {
          const {
            message: s,
            response: i
          } = t;
          e(s, i, i && i.body)
        })
      }
    }
    time(t) {
      let e = {
        "M+": (new Date).getMonth() + 1,
        "d+": (new Date).getDate(),
        "H+": (new Date).getHours(),
        "m+": (new Date).getMinutes(),
        "s+": (new Date).getSeconds(),
        "q+": Math.floor(((new Date).getMonth() + 3) / 3),
        S: (new Date).getMilliseconds()
      };
      /(y+)/.test(t) && (t = t.replace(RegExp.$1, ((new Date).getFullYear() + "").substr(4 - RegExp.$1.length)));
      for (let s in e) new RegExp("(" + s + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? e[s] : ("00" + e[s]).substr(("" + e[s]).length)));
      return t
    }
    msg(e = t, s = "", i = "", r) {
      const o = t => {
        if (!t) return t;
        if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? {
          "open-url": t
        } : this.isSurge() ? {
          url: t
        } : void 0;
        if ("object" == typeof t) {
          if (this.isLoon()) {
            let e = t.openUrl || t.url || t["open-url"],
              s = t.mediaUrl || t["media-url"];
            return {
              openUrl: e,
              mediaUrl: s
            }
          }
          if (this.isQuanX()) {
            let e = t["open-url"] || t.url || t.openUrl,
              s = t["media-url"] || t.mediaUrl;
            return {
              "open-url": e,
              "media-url": s
            }
          }
          if (this.isSurge()) {
            let e = t.url || t.openUrl || t["open-url"];
            return {
              url: e
            }
          }
        }
      };
      this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r)));
      let h = ["", "==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];
      h.push(e), s && h.push(s), i && h.push(i), console.log(h.join("\n")), this.logs = this.logs.concat(h)
    }
    log(...t) {
      t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator))
    }
    logErr(t, e) {
      const s = !this.isSurge() && !this.isQuanX() && !this.isLoon();
      s ? this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t.stack) : this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t)
    }
    wait(t) {
      return new Promise(e => setTimeout(e, t))
    }
    done(t = {}) {
      const e = (new Date).getTime(),
        s = (e - this.startTime) / 1e3;
      this.log("", `\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t)
    }
  }(t, e)
}
