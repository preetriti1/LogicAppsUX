import { makeStyles, shorthands } from '@fluentui/react-components';

export const useStyles = makeStyles({
  wrapper: {
    marginTop: '10px',
    fontSize: '18px',
    height: '100%',
    ...shorthands.overflow('scroll', 'scroll'),
  },
  leftWrapper: {
    marginLeft: '15px',
  },
  rightWrapper: {
    marginRight: '15px',
  },
  rootNode: {
    width: '100%',
    fontWeight: '600',
    ':hover': {
      backgroundColor: '#D5E4FF',
    },
  },
  circleNonHoveredAndNonConnected: {
    color: '#fff',
    stroke: '#ddd',
  },
  rightTreeItemLayout: {
    ...shorthands.borderLeft('23px', 'solid', 'transparent'),
  },
  leafNode: {
    width: '100%',
    display: 'inline-flex',
    ':hover': {
      backgroundColor: '#D5E4FF',
    },
  },
  nodeSelected: {
    backgroundColor: '#D5E4FF',
  },
  typeAnnotation: {
    display: 'inline-flex',
    marginLeft: 'auto',
  },
  treeItemWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  treeItemLeftHandle: {
    width: '14px',
    height: '14px',
    ...shorthands.borderRadius('20px'),
    backgroundColor: '#fff',
    ...shorthands.border('1px', 'solid', '#ddd'),
    position: 'absolute',
    right: '-10px',
  },
  treeItemRightHandle: {
    width: '14px',
    height: '14px',
    ...shorthands.borderRadius('20px'),
    backgroundColor: '#fff',
    ...shorthands.border('1px', 'solid', '#ddd'),
    position: 'absolute',
    left: '-10px',
  },
});
