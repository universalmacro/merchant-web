import { Select } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store";
import { getSpaceList } from "../../features/space/spaceActions";
import { setSpace } from "../../features/space/spaceSlice";

const SelectRestaurant = ({ defalutSelect }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { userToken, basePath } = useSelector((state: any) => state.auth) || {};
  const { spaceList, spaceId } = useSelector((state: any) => state.space) || {};
  const [optionList, setOptionList] = useState<any>([]);

  useEffect(() => {
    console.log("defalutSelect", defalutSelect);
    if (defalutSelect) {
      dispatch(setSpace({ info: defalutSelect }));
    }
  }, []);

  const handleChange = (value: string, data: any) => {
    console.log("handleChange", data);
    if (data) {
      dispatch(setSpace(data));
    }
  };

  useEffect(() => {
    if (userToken && basePath) {
      dispatch(getSpaceList({ token: userToken, url: basePath }));
      let list: any = [];
      spaceList?.map((item: any) => {
        list.push({ value: item.id, label: item.name, key: item.id, info: item });
      });
      console.log(list);
      setOptionList(list);
      if (!defalutSelect) {
        dispatch(setSpace(list?.[0] ?? null));
      }
    }
  }, [userToken, basePath, spaceList?.length]);

  return (
    <Select value={spaceId} style={{ width: 120 }} onChange={handleChange} options={optionList} />
  );
};

export default SelectRestaurant;
