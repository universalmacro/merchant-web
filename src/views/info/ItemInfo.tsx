import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import InfoForm from './info-form';
import SelectRestaurant from 'components/select-restaurant';

const ItemInfo = () => {
  const { userToken } = useSelector((state: any) => state.auth) || {};
  const location = useLocation();
  const [record, setRecord] = useState(location?.state?.record);
  const [info, setInfo] = useState(location?.state?.restaurantInfo);



  return (
    <>

      <span className="text-sm">正在編輯: </span><SelectRestaurant defalutSelect={info} />
      <div className="mt-24 max-w-sm mx-auto">
        <div className="border-b border-gray-900/10 pb-12">
          <InfoForm record={record} />
          {/* <div className="mt-16 mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">

     </div> */}
        </div>
      </div>
    </>
  );
}

export default ItemInfo;