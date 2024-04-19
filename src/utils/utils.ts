import { Item } from "@dparty/restaurant-ts-sdk";
import { Food } from "@universalmacro/merchant-ts-sdk";
import { FoodAttributesOption, FoodAttribute, FoodSpec, Spec } from "@universalmacro/merchant-ts-sdk";


export interface CartOrder {
  order: FoodSpec;
  amount: number;
}


export function GetUrlRelativePath() {
  var url = document.location.toString();
  var arrUrl = url.split("//");

  var start = arrUrl[1].indexOf("/");
  var relUrl = arrUrl[1].substring(start);//stop省略，截取从start开始到结尾的所有字符

  if (relUrl.indexOf("?") != -1) {
    relUrl = relUrl.split("?")[0];
  }
  return relUrl;
}


export function toTimestamp(strDate: string) {
  const dt = Date.parse(strDate);
  return dt / 1000;
};



// old:
// [
//   {
//     "id": "1716110354255187968",
//     "tags": [
//         "燒鳥"
//     ],
//     "printers": [
//         "1716108004631252992"
//     ],
//     "name": "京蔥雞肉",
//     "pricing": 2700,
// "attributes": [
//   {
//       "label": "炒或湯",
//       "options": [
//           {
//               "label": "炒烏冬",
//               "extra": 0
//           },
//           {
//               "label": "湯烏冬",
//               "extra": 0
//           }
//       ]
//   }
// ],
//     "images": [
//         "https://ordering-uat-1318552943.cos.ap-hongkong.myqcloud.com/items/1725410601846444032"
//     ],
//     "status": "ACTIVED"
//  },
// ]

// new:
// [
//   {
//     "image": "https://ordering-uat-1318552943.cos.ap-hongkong.myqcloud.com/foods/1771083932524085248",
//     "categories": [
//         "料理"
//     ],
//     "updatedAt": 1712804051,
//     "id": "1778255193431867392",
//     "name": "豬排",
//     "description": "",
//     "price": 2000,
//     "fixedOffset": null,
//     "status": "AVAILABLE",
//     "attributes": [
//         {
//             "label": "份量",
//             "options": [
//                 {
//                     "label": "大",
//                     "extra": 400
//                 }
//             ]
//         }
//     ],
//     "createdAt": 1712804051
// },
// ]

const statusMap = {
  'ACTIVED': 'AVAILABLE',
  'DEACTIVED': 'UNAVAILABLE',
}

export function convertItemData(items: Item[]){

  if(!items || !Array.isArray(items)){
    console.log("無法轉換");
    return;
  }

  const newData = items.map((item: Item) => {
    return {
      image: item.images?.[0],
      categories: item.tags,
      name: item.name,
      description: "",
      price: item.pricing,
      fixedOffset: null,
      status: statusMap[item.status],
      attributes: item.attributes
    }
  })

  return newData;
}





//检查object的每个属性是否为空。只要有一个属性为空就返回true
export function isEmptyObject(object: Record<string, string> | undefined | null): boolean {
  if (object === null || object === undefined) {
    return true;
  }

  // 检查对象本身是否为空
  if (Object.keys(object).length === 0) {
    return true;
  }

  let flag = false;

  // 检查对象的属性值是否为空
  for (const key in object) {
    if (object[key] == "" || object[key] === undefined) {
      flag = true;
      return flag;
    }
  }
  return flag;
}
export function getAttributePricing(attribute: FoodAttribute, label: string) {
  return attribute.options
    .filter((option) => option.label === label)
    .reduce((total, current) => total + (current.extra ?? 0), 0);
}

export function getAttribute(attributes: FoodAttributesOption[], label: string) {
  return attributes.filter((attribute) => attribute.label === label)[0];
}

export function getLabel(pairs: Spec[], label: string) {
  return pairs.filter((pair) => pair.attribute === label);
}

export function PairToMap(pairs: Spec[] | undefined) {
  const m = new Map<string, string>();
  pairs?.forEach((pair) => m.set(pair.attribute, pair.optioned));
  return m;
}

export function getPricing(order: FoodSpec) {
  const m = PairToMap(order.spec);

  const extra = order.food?.attributes?.reduce(
    (total: any, attribute: any) => total + getAttributePricing(attribute, m.get(attribute.label)!),
    0
  );
  return order.food?.price + extra;
}

export function MapToPair(m: Map<string, string>) {
  const pairs: Spec[] = [];
  m.forEach((v, k) => {
    pairs.push({ attribute: k, optioned: v });
  });
  return pairs;
}

export function getAmount(orders: FoodSpec[], id: string) {
  return orders.filter((order) => order.food.id === id).length;
}

export function MapEqual(m: Map<string, string>, m2: Map<string, string>) {
  if (m.size !== m2.size) {
    return false;
  }
  let equal = true;
  m.forEach((v, k) => {
    if (m2.get(k) !== v) {
      equal = false;
    }
  });
  return equal;
}

export function OptionEqual(m: Spec[] | undefined, m2: Spec[] | undefined) {
  return MapEqual(PairToMap(m), PairToMap(m2));
}

export function getCart(orders: FoodSpec[], cartOrders: CartOrder[] = []): CartOrder[] {
  if (!orders || orders?.length === 0) return cartOrders;
  const [order] = orders;
  const amount = orders.filter(
    (o) => o.food.id === order.food.id && OptionEqual(o.spec, order.spec)
  ).length;
  const tail = orders.filter(
    (o) => o.food.id !== order.food.id || !OptionEqual(o.spec, order.spec)
  );
  const newCartOrders = [
    {
      amount: amount,
      order: order,
    },
    ...cartOrders,
  ];
  return getCart(tail, newCartOrders);
}

