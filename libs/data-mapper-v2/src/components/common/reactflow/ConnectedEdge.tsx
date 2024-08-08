import { getEdgeCenter, getStraightPath, type EdgeProps } from '@xyflow/react';
import { useActiveEdge } from '../../../core/state/selectors/selectors';
import { useMemo } from 'react';
import { colors } from './styles';
import EdgeDropZone from './EdgeDropZone';

const ConnectedEdge = (props: EdgeProps) => {
  const { id, sourceX, sourceY, targetX, targetY, data } = props;
  const activeEdge = useActiveEdge(id);

  const [path] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const [edgeCenterX, edgeCenterY] = getEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const strokeColor = useMemo(() => (activeEdge ? colors.active : colors.connected), [activeEdge]);

  return (
    <g id={`${id}_customEdge`}>
      <path fill="none" stroke={strokeColor} strokeWidth={6} className="animated" d={path} />
      {data?.isTemporary ? null : (
        <EdgeDropZone edgeCenterX={edgeCenterX} edgeCenterY={edgeCenterY} edgeId={id} strokeColor={strokeColor} />
      )}
    </g>
  );
};

export default ConnectedEdge;
