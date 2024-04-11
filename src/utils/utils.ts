import { Item } from "@dparty/restaurant-ts-sdk";
import { Food } from "@universalmacro/merchant-ts-sdk";

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
