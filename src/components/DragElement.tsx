import React, { useRef, useState, useEffect, HtmlHTMLAttributes } from "react";
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

  useEffect(() => {
    const containers = document.querySelectorAll<HTMLDivElement>(
      ".header__dnd-group"
    );
    containers.forEach((container) => {
      container.addEventListener("dragover", (e) => {
        e.preventDefault();
        const { element } = getDragAfterElement(container, e.clientY);
        if (element) reload(element!, container)
        
      });
    });
  }, []);

  const reload = (element: HTMLDivElement, container: HTMLDivElement) => {
      const parseId = parseInt(element.id, 10);
      const contId = parseInt(container.id, 10);
      const dragId = parseId - 1 < 0 ? 0 : parseId - 1;
      const params = {
        grpI: contId,
        contentI: dragId,
      };
      setList((prevList) => {
        let newList = [...prevList];
        newList[params.grpI].items.splice(
          params.contentI,
          0,
          //@ts-ignore
          newList[dragItem.current.grpI].items.splice(
            //@ts-ignore
            dragItem.current.contentI,
            1
          )[0]
        );
        dragItem.current = params;
        return newList;
      });
  }

  const getDragAfterElement = (container: HTMLDivElement, y: number) => {
    const draggableElements = Array.from<HTMLDivElement>(
      container.querySelectorAll(".header__dnd-item:not(.current)")
    );

    return draggableElements.reduce(
      (
        closest: { offset: number; element: HTMLDivElement | null },
        child: HTMLDivElement
      ) => {
        const box: DOMRect = child.getBoundingClientRect();
        const offset: number = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY, element: null }
    );
  };

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

  // const handleDragEnter = (
  //   e: React.DragEvent<HTMLDivElement>,
  //   params: DragInfo
  // ) => {
  //   if (e.target !== dragNode.current) {
  //     setList((oldList) => {
  //       let newList = [...oldList];
  //       if (dragItem.current) {
  //         newList[params.grpI].items.splice(
  //           params.contentI,
  //           0,
  //           newList[dragItem.current.grpI].items.splice(
  //             dragItem.current.contentI,
  //             1
  //           )[0]
  //         );
  //         dragItem.current = params;
  //         console.log("update arr");
  //         return newList;
  //       }
  //       return newList;
  //     });
  //   }
  // };

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
          id={`${grpI}`}
          key={grpI}
          // onDragEnter={
          //   dragging && !grp.items.length
          //     ? (e) => handleDragEnter(e, { grpI, contentI: 0 })
          //     : undefined
          // }
        >
          <p>{grp.title}</p>
          {grp.items.map((content, contentI) => (
            <div
              className={
                dragging ? getStyles({ grpI, contentI }) : "header__dnd-item"
              }
              key={contentI}
              id={`${contentI}`}
              draggable
              onDragStart={(e) => handleDragStart(e, { grpI, contentI })}
              // onDragEnter={
              //   dragging
              //     ? (e) => handleDragEnter(e, { grpI, contentI })
              //     : undefined
              // }
            >
              <p>{content}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
