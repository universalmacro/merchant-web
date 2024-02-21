import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Table, Button, Modal } from "antd";
import { RiAddFill } from "react-icons/ri";
import ModalForm from "./modal-form";
import { useParams, useNavigate } from "react-router-dom";
import { OrderApi, Configuration, ConfigurationParameters } from "@universalmacro/merchant-ts-sdk";

import type { DragEndEvent } from "@dnd-kit/core";
import { DndContext } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Row from "./rows";
import type { ColumnsType } from "antd/es/table";

const paginationConfig = {
  pageSize: 10,
  page: 0,
};

interface DataType {
  key: string;
  name: string;
}

const Tables = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userToken, basePath } =
    useSelector((state: any) => state.auth) || localStorage.getItem("merchant-web-token") || {};

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tableValue, setTableValue] = useState(null);
  const [categoryList, setCategoryList] = useState([]);
  const [orderApi, setOrderApi] = useState(null);

  const { confirm } = Modal;

  const [dataSource, setDataSource] = useState([]);

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      setDataSource((previous) => {
        const activeIndex = previous.findIndex((i) => i.key === active.id);
        const overIndex = previous.findIndex((i) => i.key === over?.id);
        let newList = arrayMove(previous, activeIndex, overIndex);
        const categorylist = newList.map((item) => item.name);
        update(categorylist);

        return newList;
      });
    }
  };

  const update = async (categorylist: string[]) => {
    try {
      const res = await orderApi.updateFoodCategories({
        id: id,
        requestBody: categorylist,
      });
      getCategoryList(paginationConfig?.page, paginationConfig?.pageSize);
      successCallback("更新成功");
    } catch (e) {}
  };

  useEffect(() => {
    if (isNaN(Number(id))) {
      navigate("/spaces");
    }
  }, [id]);

  useEffect(() => {
    if (!orderApi && basePath) {
      setOrderApi(
        new OrderApi(
          new Configuration({
            basePath: basePath,
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          } as ConfigurationParameters)
        )
      );
    }
    if (orderApi && basePath && userToken) {
      getCategoryList(paginationConfig?.page, paginationConfig?.pageSize);
    }
  }, [userToken, basePath, orderApi]);

  const getCategoryList = async (page: number, pageSize: number) => {
    setLoading(true);
    try {
      const res = await orderApi?.listFoodCategories({ id: id });
      if (res?.length > 0) {
        let data = res?.map((item: string, index: number) => {
          return {
            key: index,
            name: item,
          };
        });
        setDataSource(data);
        setCategoryList(res ?? []);
      }

      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const successCallback = (text: string = "創建成功") => {
    Modal.success({
      content: text,
    });
  };

  const errorCallback = (e: any) => {
    Modal.error({
      content: `${e}`,
    });
  };

  const handleDelete = (record: any) => {
    showDeleteConfirm(async () => {
      let list = [...categoryList];
      list.splice(record?.key, 1);
      console.log("handleDeletehandleDeletehandleDelete", record, categoryList, list);

      update(list);
    });
  };

  const onSave = async (values: any) => {
    console.log("onsave", values?.name, categoryList, tableValue, values);
    let list = [...categoryList];
    if (tableValue?.id === undefined) {
      list = [...new Set([values?.name, ...categoryList])];
    } else {
      list.splice(values?.id, 1, values.name);
      list = [...new Set(list)];
    }
    try {
      const res = await orderApi.updateFoodCategories({
        id: id,
        requestBody: list,
      });
      successCallback();
      getCategoryList(paginationConfig?.page, paginationConfig?.pageSize);
    } catch (e) {}
    setVisible(false);
  };

  const showDeleteConfirm = (onOk: any) => {
    confirm({
      title: "確認刪除？",
      okText: "確認",
      okType: "danger",
      cancelText: "取消",
      onOk,
      onCancel() {
        console.log("OK");
      },
    });
  };

  const addTable = () => {
    setTableValue(null);
    setVisible(true);
  };

  const editTable = (record: any) => {
    setTableValue({ name: record.name, id: record.key });
    setVisible(true);
  };

  const columns: ColumnsType<DataType> = [
    {
      key: "sort",
      width: 15,
    },
    {
      title: "分類",
      dataIndex: "name",
    },
    {
      title: "操作",
      key: "operation",
      render: (text: any, record: any) => (
        <>
          <span onClick={() => editTable(record)} className="mr-4 text-blue-400">
            編輯
          </span>
          <span className="text-red-400" onClick={() => handleDelete(record)}>
            刪除
          </span>
        </>
      ),
    },
  ];

  return (
    <div>
      <ModalForm
        state={tableValue}
        visible={visible}
        onSave={onSave}
        onCancel={() => {
          setVisible(false);
        }}
      />
      <div className="mt-5 grid h-full grid-cols-1 gap-5">
        <div className="flex justify-between">
          <p className="mb-4 inline text-xl">分類列表</p>{" "}
          <Button onClick={addTable} icon={<RiAddFill />}>
            新增
          </Button>
        </div>
        <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
          <SortableContext
            // rowKey array
            items={dataSource.map((i) => i.key)}
            strategy={verticalListSortingStrategy}
          >
            <Table
              components={{
                body: {
                  row: Row,
                },
              }}
              bordered
              rowKey="key"
              columns={columns}
              dataSource={dataSource}
            />
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default Tables;
