import React, { ReactNode } from 'react';
import { Virtuoso } from 'react-virtuoso';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import classes from './../chat.module.css';
import MessageItem from '../message/MessageItem';

const MUIComponents: any = {
    List: React.forwardRef(({ style, children }: any, listRef: any) => {
        return (
            <List style={{ ...style }} component='div' ref={listRef}>
                {children}
            </List>
        );
    }),

    Item: ({ children, ...props }: any) => {
        return (
            <ListItem component='div' {...props}>
                {children}
            </ListItem>
        );
    },

    Group: ({ children, style, ...props }: any) => {
        return null;
    },
};

type Props = {
    messages: any[];
    open: boolean;
    onMenuClick: (data: any, id: any) => void;
    updateMessageId: string;
    onUpdateCancel: () => void;
    onImageClick: (imageIndex: number, messageIndex: number) => void;
};

const CustomList = ({
    messages,
    open,
    onMenuClick,
    updateMessageId,
    onUpdateCancel,
    onImageClick,
}: Props) => {
    return messages?.length ? (
        <Virtuoso
            className={classes.chatArea}
            // components={MUIComponents}
            data={messages}
            reversed={true}
            followOutput='auto'
            allowFullScreen
            alignToBottom
            itemContent={(index) => {
                return (
                    <MessageItem
                        message={messages[index]}
                        prevMessage={index > 0 ? messages[index - 1] : null}
                        open={open}
                        onMenuClick={(data: any) =>
                            onMenuClick(data, messages[index]._id)
                        }
                        updateMessageId={updateMessageId}
                        onUpdateCancel={onUpdateCancel}
                        onImageClick={(imgIndex: number) =>
                            onImageClick(imgIndex, index)
                        }
                    />
                );
            }}
        />
    ) : (
        <></>
    );
};

export default CustomList;
