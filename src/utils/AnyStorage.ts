/**
 * author: supermanc
 */
interface AnyStorageItem {
  v: any,
  t?: number,
}

/**
 * 数据缓存类
 */
export default class AnyStorage {

  private __storage;
  private __appKey;

  /**
   * 数据缓存类构造方法
   * @param appKey 用于存储数据时键名的前缀
   * @param storage 本地存储或会话存储
   */
  constructor(appKey: string, storage: Storage) {
    this.__storage = storage || window.localStorage;
    this.__appKey = appKey ? appKey + '-' : '';
  }

  /**
   * 存储数据
   * @param key   键名
   * @param v     键值
   * @param expire  有效期， ms 单位
   * @param merge 新旧数据是否合并
   */
  setItem(key: string, v: any, expire: number, merge: boolean): void {
    const {__storage, __appKey} = this;
    const str: AnyStorageItem = merge ? {v: {...{v: this.getItem(key)}, ...{v}}} : {v: {v}};
    if (expire) {
      str.t = Date.now() + expire;
      expire < 3600000 && setTimeout(() => this.removeItem(key), expire);
    }
    __storage.setItem(__appKey + key.toString(), JSON.stringify(str));
  }

  /**
   * 获取数据
   * @param key   键名
   * @returns     返回键值， 如果过期则为空
   */
  getItem(key: string): any | null {
    const {__storage, __appKey} = this;
    const k = __appKey + key.toString();
    const obj: AnyStorageItem = JSON.parse(__storage.getItem(k));
    if (obj && obj.t && obj.t < Date.now()) {
      __storage.removeItem(k);
      return null;
    }
    return obj && obj.v && obj.v.v;
  }

  /**
   * 删除存储的数据
   * @param key
   */
  removeItem(key: string): void {
    const {__storage, __appKey} = this;
    const k = __appKey + key.toString();
    __storage.removeItem(k);
  }

  /**
   * 删除一组数据
   * @param keyPrefix
   */
  removeItems(keyPrefix: string): void {
    const {__storage, __appKey} = this;
    const key = __appKey + keyPrefix.toString();
    Object.keys(__storage).forEach(k => k.indexOf(key) === 0 && __storage.removeItem(k));
  }

  /**
   * 清空数据
   */
  clear(expire?: number): void {
    // alert('清空数据');
    const {__storage, __appKey} = this;
    if (expire) {
      Object.keys(__storage).forEach(k => k.indexOf(__appKey) === 0 && __storage.getItem(k));
    } else {
      Object.keys(__storage).forEach(k => k.indexOf(__appKey) === 0 && __storage.removeItem(k));
    }
  }
}
