import type React from 'react';
import { useStyles } from './styles';
import {
  InlineDrawer,
  DrawerHeader,
  DrawerHeaderTitle,
  Text,
  type Slot,
  DrawerBody,
  DrawerFooter,
  type InputOnChangeData,
  mergeClasses,
} from '@fluentui/react-components';
import { SearchBox } from '@fluentui/react-search';
import type { FluentIcon } from '@fluentui/react-icons';
import { type PanelPosition, Panel as ReactflowPanel } from '@xyflow/react';
import { useMemo } from 'react';

type PanelProps = {
  id: string;
  isOpen: boolean;
  title?: {
    text: string;
    icon?: FluentIcon;
    size?: 500 | 100 | 200 | 300 | 400 | 600 | 700 | 800 | 900 | 1000;
    rightAction?: Slot<'div'>;
  };
  reactflow?: {
    position: PanelPosition;
  };
  search?: {
    placeholder?: string;
    text?: string;
    onChange: (value?: string) => void;
  };
  body?: React.ReactNode;
  footer?: React.ReactNode;
  styles?: {
    root?: string;
    header?: string;
    title?: string;
    search?: string;
    titleIcon?: string;
    body?: string;
    footer?: string;
  };
};

export const Panel = (props: PanelProps) => {
  const defaultStyles = useStyles();
  const { title, body, isOpen, styles, search, footer, reactflow } = props;

  const children = useMemo(
    () => (
      <>
        {title ? (
          <DrawerHeader className={mergeClasses(defaultStyles.header, styles?.header)}>
            <DrawerHeaderTitle action={title?.rightAction} heading={{ as: 'div' }}>
              {title?.icon ? <title.icon className={mergeClasses(defaultStyles.titleIcon, styles?.titleIcon ?? '')} /> : null}
              <Text size={title?.size ?? 500} className={styles?.title}>
                {title?.text}
              </Text>
            </DrawerHeaderTitle>
            {search ? (
              <SearchBox
                placeholder={search.placeholder}
                className={mergeClasses(defaultStyles.search, styles?.search)}
                value={search.text}
                size="small"
                onChange={(_e, data: InputOnChangeData) => {
                  search.onChange(data?.value);
                }}
              />
            ) : null}
          </DrawerHeader>
        ) : null}
        {body ? <DrawerBody className={mergeClasses(defaultStyles.body, styles?.body)}>{body}</DrawerBody> : null}
        {footer ? <DrawerFooter className={mergeClasses(defaultStyles.footer, styles?.footer)}>{footer}</DrawerFooter> : null}
      </>
    ),
    [
      body,
      defaultStyles.body,
      defaultStyles.footer,
      defaultStyles.header,
      defaultStyles.search,
      defaultStyles.titleIcon,
      footer,
      search,
      styles?.body,
      styles?.footer,
      styles?.header,
      styles?.search,
      styles?.title,
      styles?.titleIcon,
      title,
    ]
  );

  if (reactflow) {
    return (
      <ReactflowPanel id={props.id} position={reactflow.position} className={mergeClasses(defaultStyles.root, styles?.root)}>
        {children}
      </ReactflowPanel>
    );
  }

  return (
    <InlineDrawer className={mergeClasses(defaultStyles.root, styles?.root)} open={isOpen}>
      {children}
    </InlineDrawer>
  );
};
