// 暴露一个通用的对象类型，适用于需要接受任意键值对的场景
export interface GenericObject {
  [key: string]: string | number | boolean | null | undefined;
}
