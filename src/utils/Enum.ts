export interface EnumValue {
  name: string;
  value: string;
}


// export enum ClockType {
//   未开始 = 0,
//   进行中 = 1,
//   已结束 = 2,
// }

export function Enums(e?: any): Array<EnumValue> {
  return Object.keys(e).reduce((sum: EnumValue[], value) => {
    if (parseInt(value, 10) >= 0) {
      sum.push({ name: e[value], value });
    }
    return sum;
  }, []);
}
