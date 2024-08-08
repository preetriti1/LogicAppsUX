import { Button } from '@fluentui/react-components';
import { Add20Filled } from '@fluentui/react-icons';
import { useReactFlow } from '@xyflow/react';
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React from 'react';
import { useDrop } from 'react-dnd';

type EdgeDropZoneProps = {
  edgeId: string;
  edgeCenterX: number;
  edgeCenterY: number;
  strokeColor: string;
};

const [buttonWidth, buttonHeight] = [35, 30];

const EdgeDropZone = (props: EdgeDropZoneProps) => {
  const { edgeCenterX, edgeCenterY, strokeColor } = props;
  const reactFlowInstance = useReactFlow();

  const [, drop] = useDrop(
    () => ({
      accept: 'function',
      drop: (_item, monitor) => {
        // const xyPosition = monitor.getClientOffset();
        // if (xyPosition) {
        //   if (reactFlowInstance) {
        //     const position = reactFlowInstance.screenToFlowPosition({
        //       x: xyPosition.x,
        //       y: xyPosition.y,
        //     });
        //     // middle of node is placed where pointer is
        //     position.x -= 20;
        //     position.y -= 20;
        //     return { position };
        //   }
        //   return { position: xyPosition };
        // }
        // return { position: { x: 0, y: 0 } };
        console.log(monitor);
      },
    }),
    [reactFlowInstance]
  );

  return (
    <foreignObject
      x={edgeCenterX - buttonWidth / 2}
      y={edgeCenterY - buttonHeight / 2}
      width={buttonWidth}
      height={buttonHeight}
      requiredExtensions="http://www.w3.org/1999/xhtml"
    >
      <Button
        ref={drop}
        appearance="transparent"
        shape="circular"
        icon={<Add20Filled />}
        style={{
          width: buttonWidth,
          height: buttonHeight,
          background: strokeColor,
          color: '#fff',
          zIndex: 100,
        }}
      />
    </foreignObject>
  );
};

export default EdgeDropZone;
