import React, { useRef, useState } from "react";
import { dataT } from "../App";

interface Props {
  data: dataT;
}
type DragInfo = {
  grpI: number;
  contentI: number;
};

export default ({ data }: Props) => {
  const [dragging, setDragging] = useState<boolean>(false);
  const [list, setList] = useState<dataT>(data);
  // mutableRefObj
  const dragItem = useRef<DragInfo | null>();
  const dragNode = useRef<HTMLDivElement | null>();

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    params: DragInfo
  ) => {
    console.log(params);
    dragItem.current = params;
    dragNode.current = e.target as HTMLDivElement;
    dragNode.current.addEventListener("dragend", handleDragEnd);
    setTimeout(() => {
      setDragging(true);
    }, 0);
  };

  const handleDragEnd = () => {
    console.log("ending drag");
    dragNode.current?.removeEventListener("dragend", handleDragEnd);
    dragNode.current = null;
    dragItem.current = null;
    setDragging(false);
  };

  const handleDragEnter = (
    e: React.DragEvent<HTMLDivElement>,
    params: DragInfo
  ) => {
    if (e.target !== dragNode.current) {
      setList((oldList) => {
        let newList = [...oldList];
        if (dragItem.current) {
          newList[params.grpI].items.splice(
            params.contentI,
            0,
            newList[dragItem.current.grpI].items.splice(
              dragItem.current.contentI,
              1
            )[0]
          );
          dragItem.current = params;
          console.log("update arr");
          return newList;
        }
        return newList;
      });
    }
  };

  const getStyles = (params: DragInfo) => {
    if (dragItem.current) {
      return dragItem.current.grpI !== params.grpI
        ? "header__dnd-item"
        : dragItem.current.contentI === params.contentI
        ? "current header__dnd-item"
        : "header__dnd-item";
    }
  };

  return (
    <div className="header__drag-n-drop">
      {data.map((grp, grpI) => (
        <div
          className="header__dnd-group"
          key={grpI}
          onDragEnter={
            dragging && !grp.items.length
              ? (e) => handleDragEnter(e, { grpI, contentI: 0 })
              : undefined
          }
        >
          <p>{grp.title}</p>
          {grp.items.map((content, contentI) => (
            <div
              className={
                dragging ? getStyles({ grpI, contentI }) : "header__dnd-item"
              }
              key={contentI}
              draggable
              onDragStart={(e) => handleDragStart(e, { grpI, contentI })}
              onDragEnter={
                dragging
                  ? (e) => handleDragEnter(e, { grpI, contentI })
                  : undefined
              }
            >
              <p>{content}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
