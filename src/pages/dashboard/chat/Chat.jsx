import { Box, Button, Typography } from '@mui/material/';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import 'moment-timezone';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Virtuoso } from 'react-virtuoso';
import { KitChat } from '../../../kitchat/kitchat';
import classes from './chat.module.css';
import ChatInput from './input/ChatInput';
import MessageItem from './message/MessageItem';

const MUIComponents = {
    List: React.forwardRef(({ style, children }, listRef) => {
        return (
            <List style={{ ...style }} component='div' ref={listRef}>
                {children}
            </List>
        );
    }),

    Item: ({ children, ...props }) => {
        return (
            <ListItem component='div' {...props}>
                {children}
            </ListItem>
        );
    },

    Group: ({ children, style, ...props }) => {
        return null;
    },
};

export class Chat extends Component {
    state = {
        text: '',
        messages: [],
        chatLoading: true,
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.setupKitChat();
    }

    componentDidUpdate(prevProps) {
        if (this.props.channel?._id !== prevProps.channel?._id) {
            this.loadMessages();
        }
    }

    msgSend() {
        const kc = KitChat.getInstance();
        kc.messageAdd(this.props.channel, this.state.text);
        this.setState({ text: '' });
    }

    onMsgReceived(newMsg) {
        if (newMsg.channelId == this.props.channel._id) {
            // setMessages([...messages, newMsg]);
            const { messages } = this.state;
            this.setState({ messages: [...messages, newMsg] });
        }
    }

    async setupKitChat() {
        const kc = KitChat.getInstance();
        kc.onMessageReceived((msg) => {
            this.onMsgReceived(msg);
            kc.readMessage(this.props.channel._id);
        });
        this.loadMessages();
        // kc.readMessage(this.props.channel._id);
    }

    async loadMessages() {
        const kc = KitChat.getInstance();
        const result = await kc.channelMessages(this.props.channel._id);
        this.setState({ messages: result, chatLoading: false });
        kc.readMessage(this.props.channel._id);
    }

    render() {
        const { channel, onChannelNamePress } = this.props;
        const { text, messages } = this.state;
        return (
            <div>
                <div className={classes.chatHeader}>
                    <div
                        onClick={onChannelNamePress}
                        style={{ cursor: 'pointer' }}
                    >
                        {channel.title}
                    </div>
                </div>
                <div className={classes.container}>
                    {messages?.length ? (
                        <Virtuoso
                            className={classes.chatArea}
                            components={MUIComponents}
                            data={messages}
                            // reversed={true}
                            followOutput='auto'
                            allowFullScreen
                            alignToBottom
                            itemContent={(index) => {
                                return (
                                    <MessageItem
                                        message={messages[index]}
                                        prevMessage={
                                            index > 0
                                                ? messages[index - 1]
                                                : null
                                        }
                                    />
                                );
                            }}
                        />
                    ) : null}
                    <ChatInput
                        msgSend={() => {
                            this.msgSend();
                        }}
                        onChange={(e) =>
                            this.setState({ text: e.target.value })
                        }
                        text={text}
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        channel: state?.channelReducer?.selectedChannel,
    };
};

export default connect(mapStateToProps)(Chat);
