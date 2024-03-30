import { defineStore } from "pinia";
import { ConfigGet, ConfigSet } from "../../wailsjs/go/system/SystemService";
import { ConfigKeyHistoryProject } from "@/constant/keys/config";
//这是一个简单的推荐store案例，可以在这里定义你的状态
//新建pinia时把historyProjects全局替换成你的store名字
export interface historyProjectsStore {
  currentList: string[];
}
export const useHistoryStore = defineStore("historyProjects", {
  state: (): historyProjectsStore => ({
    currentList: [],
  }),
  actions: {
    //初始化列表
    async initList() {
      const currListString = await ConfigGet(ConfigKeyHistoryProject);
      try {
        this.currentList = JSON.parse(currListString);
      } catch (e) {
        this.currentList = [];
      }
    },
    add(dir: string) {
      // 从当前列表中移除指定目录，确保后续添加不会重复
      this.currentList = this.currentList.filter((item) => item !== dir);

      // 将指定目录添加到列表的开头
      this.currentList.unshift(dir);

      // 限制列表长度不超过10，超出部分会被移除
      this.currentList = this.currentList.slice(0, 10);

      // 保存更新后的列表到配置文件
      this.saveToConfig();
    },
    remove(dir: string) {
      this.currentList = this.currentList.filter((item) => item !== dir);
      this.saveToConfig();
    },
    saveToConfig() {
      ConfigSet(ConfigKeyHistoryProject, JSON.stringify(this.currentList));
    },
  },
  getters: {},
});
