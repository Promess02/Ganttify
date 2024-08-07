import React from 'react';
import { useResizable } from 'react-resizable-layout';
import SampleSplitter from './SampleSplitter.tsx'; // Assuming you have this component
import {cn} from './cn.ts'

const ResizableContainer = ({ children }) => {
  const {
    isDragging: isResizing,
    position: containerWidth,
    splitterProps: resizeBarProps,
  } = useResizable({
    axis: 'x',
    initial: 800,
    min: 500,
    max: 1300,
    reverse: true
  });

  console.log('Container Width:', containerWidth); // Debugging log

  return (
    <div className={
        "flex flex-column bg-dark font-mono color-white overflow-hidden"
      }>
        <div className={"flex grow"}>
            <div className={"grow contents"}> {children[0]} </div>
            <SampleSplitter isDragging={isResizing} {...resizeBarProps} />
            <div className={cn("shrink-0 contents", isResizing && "dragging")}
                style={{ width: containerWidth }}>
                {children[1]}
            </div>
        </div>
    </div>
  );
};

export default ResizableContainer;