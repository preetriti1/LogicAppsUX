import { getStraightPath, type EdgeProps } from '@xyflow/react';
import { useActiveEdge } from '../../../core/state/selectors/selectors';
import { useMemo } from 'react';
import { colors } from './styles';
import { useDrop } from 'react-dnd';

const ConnectedEdge = (props: EdgeProps) => {
  const { id, sourceX, sourceY, targetX, targetY } = props;
  const activeEdge = useActiveEdge(id);

  const [path] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const strokeColor = useMemo(() => (activeEdge ? colors.active : colors.connected), [activeEdge]);

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
    []
  );

  return (
    <g id={`${id}_customEdge`} style={{ zIndex: 9999 }}>
      <path fill="none" stroke={strokeColor} strokeWidth={6} className="animated" d={path} ref={drop} />
    </g>
  );
};

export default ConnectedEdge;
