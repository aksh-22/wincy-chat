import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import 'moment-timezone';
import { Component } from 'react';
import { connect } from 'react-redux';
import AttachmentViewer from '../../../components/attachment/AttachmentViewer';
import CustomMenu from '../../../components/CustomMenu';
import Dropzone from '../../../components/dropzone/Dropzone';
import { KitChat } from '../../../kitchat/kitchat';
import classes from './chat.module.css';
import ChatInput from './input/ChatInput';
import CustomList from './list/CustomList';
import MenuItem from './MenuItem';

const options = [
    {
        id: 1,
        name: 'Delete Messages',
        color: 'red',
        key: 'delete',
    },
    {
        id: 2,
        name: 'Update Messages',
        color: 'yellow',
        key: 'update',
    },
];

export class Chat extends Component {
    state = {
        text: '',
        messages: [],
        chatLoading: true,
        anchorEl: null,
        currentMessageId: '',
        updateMessageId: '',
        uploadedFiles: [],
        attachmentIndexes: {
            attachmentIndex: null,
            messageIndexes: null,
        },
        channelId: '',
    };

    constructor(props) {
        super(props);
        this.onMenuItemPress = this.onMenuItemPress.bind(this);
        this.onFilesAdded = this.onFilesAdded.bind(this);
        this.removeImage = this.removeImage.bind(this);
        this.getAttachmentUrl = this.getAttachmentUrl.bind(this);
        this.removeImage = this.removeImage.bind(this);
    }

    componentDidMount() {
        this.setupKitChat();
    }

    // componentWillUnmount() {
    //     console.log('unmount');
    // }

    componentDidUpdate(prevProps, prevState) {
        const { channelId } = this.state;
        if (this.props.channel?._id !== prevProps.channel?._id) {
            this.loadMessages();
        }
        if (prevProps.channel?._id !== channelId) {
            this.setState({ channelId: this.props.channel._id });

            this.setState({
                uploadedFiles: [...this.props.channel.attachments],
            });
        }
    }

    msgSend() {
        const kc = KitChat.getInstance();
        let body = {
            channelId: this.props.channel._id,
            content: this.state.text,
        };

        if (this.state.uploadedFiles.length) {
            body.attachments = this.state.uploadedFiles;
        }
        kc.messageAdd(body);
        this.setState({ text: '' });
    }

    onMsgReceived(newMsg) {
        if (newMsg.channelId == this.props.channel._id) {
            // setMessages([...messages, newMsg]);
            const { messages } = this.state;
            this.setState({ messages: [...messages, newMsg] });
        }
    }

    onMsgDelete(newMsg) {
        if (newMsg.channelId == this.props.channel._id) {
            const { messages } = this.state;
            this.setState({
                messages: messages.filter((el) => el._id !== newMsg._id),
            });
        }
    }

    onMsgUpdate(newMsg) {
        if (newMsg.channelId == this.props.channel._id) {
            const { messages } = this.state;
            this.setState({
                messages: messages.map((el) => {
                    if (el._id === newMsg._id) {
                        return {
                            ...el,
                            content: newMsg.content,
                            isEdited: true,
                        };
                    } else {
                        return el;
                    }
                }),
            });
        }
    }

    async onMenuItemPress(type) {
        const kc = KitChat.getInstance();
        switch (type) {
            case 'delete':
                await kc.deleteMessage(
                    this.props.channel._id,
                    this.state.currentMessageId
                );
                break;

            case 'update':
                this.setState({ updateMessageId: this.state.currentMessageId });
                break;

            default:
                break;
        }
    }

    handleClick = (event, id) => {
        this.setState({ anchorEl: event.currentTarget, currentMessageId: id });
    };
    handleClose = () => {
        this.setState({ anchorEl: null });
    };
    onUpdateCancel = () => {
        this.setState({ updateMessageId: '' });
    };

    onAttachmentAdd = (files) => {
        const { uploadedFiles } = this.state;
        if (files.channelId == this.props.channel._id) {
            const prevLength = uploadedFiles?.length ?? 0;
            uploadedFiles.splice(
                uploadedFiles?.length - files.attachments.length,
                files.attachments.length
            );
            if (uploadedFiles.length) {
                this.setState({
                    uploadedFiles: [...uploadedFiles, ...files.attachments],
                });
            } else {
                this.setState({ uploadedFiles: [...files.attachments] });
            }
        }
        // else {
        //     this.props.setChannel({
        //         type: 'ADD_ATTACHMENTS',
        //         payload: files,
        //     });
        // }
        this.props.setChannel({
            type: 'ADD_ATTACHMENTS',
            payload: files,
        });
    };
    onAttachmentRemove = (files) => {
        const { uploadedFiles } = this.state;
        this.props.setChannel({
            type: 'REMOVE_ATTACHMENTS',
            payload: files,
        });
        // this.props.setChannel({
        //     type: 'ADD_ATTACHMENTS',
        //     payload: files,
        // });
    };

    async setupKitChat() {
        const kc = KitChat.getInstance();
        kc.onMessageReceived((msg) => {
            this.onMsgReceived(msg);
            kc.readMessage(this.props.channel._id);
        });
        kc.onChannelMessageDelete((msg) => {
            this.onMsgDelete(msg);
        });
        kc.onChannelMessageUpdate((msg) => {
            this.onMsgUpdate(msg);
        });
        kc.onAttachmentAdd(this.onAttachmentAdd);
        kc.onAttachmentRemove(this.onAttachmentRemove);
        this.loadMessages();
        // kc.readMessage(this.props.channel._id);
    }

    async loadMessages() {
        if (this.props.channel?._id) {
            const kc = KitChat.getInstance();
            const result = await kc.channelMessages(this.props.channel._id);
            this.setState({ messages: result, chatLoading: false });
            kc.readMessage(this.props.channel._id);
        }
    }

    async onFilesAdded(files) {
        const { uploadedFiles } = this.state;

        if (uploadedFiles.length) {
            this.setState({ uploadedFiles: [...uploadedFiles, ...files] });
        } else {
            this.setState({ uploadedFiles: [...files] });
        }
        // await this.getAttachmentUrl(files, uploadedFiles);
    }

    async getAttachmentUrl(files, prevFiles) {
        const kc = KitChat.getInstance();
        const body = new FormData();
        // body.append('channelId', this.props.channel._id);
        files.forEach((file) => {
            body.append(`attachments`, file, file.name);
        });
        await kc.addAttachments(
            body,
            this.props.channel._id,
            this.getUploadProgress
        );
    }

    async removeImage(index) {
        const { uploadedFiles } = this.state;
        const temp = [...uploadedFiles];
        temp.splice(index, 1);
        this.setState({ uploadedFiles: [...temp] });
        const kc = KitChat.getInstance();
        await kc.removeAttachment(
            this.props.channel._id,
            this.state.uploadedFiles[index].original
        );
    }

    getUploadProgress = (progressEvent) => {
        console.log(progressEvent.loaded);
    };

    onImageClick = (attachmentIndex, msgIndex) => {
        this.setState({
            attachmentIndexes: {
                attachmentIndex: attachmentIndex,
                messageIndexes: msgIndex,
            },
        });
    };

    onAttachmentViewerClose = () => {
        this.setState({
            attachmentIndexes: {
                attachmentIndex: null,
                messageIndexes: null,
            },
        });
    };

    render() {
        const { channel, onChannelNamePress } = this.props;
        const { text, messages } = this.state;
        const open = Boolean(this.state.anchorEl);

        const renderItem = (option) => {
            return <MenuItem option={option} onClick />;
        };

        return (
            <Dropzone onUpload={this.onFilesAdded}>
                <div>
                    <div className={classes.chatHeader}>
                        <div
                            onClick={() => {
                                if (channel?.type !== 'DIRECT')
                                    onChannelNamePress();
                            }}
                            style={{ cursor: 'pointer' }}
                        >
                            {channel?.title}
                        </div>
                        <IconButton
                            onClick={() => {
                                this.props.setChannel({
                                    type: 'SET_CHANNEL',
                                    payload: null,
                                });
                            }}
                        >
                            <CloseIcon color='info' />
                        </IconButton>
                    </div>
                    <div className={classes.container}>
                        <CustomMenu
                            anchorEl={this.state.anchorEl}
                            onClose={this.handleClose}
                            open={open}
                            options={options}
                            renderItem={renderItem}
                            onPress={this.onMenuItemPress}
                        />
                        <CustomList
                            messages={messages}
                            onMenuClick={this.handleClick}
                            open={open}
                            updateMessageId={this.state.updateMessageId}
                            onUpdateCancel={this.onUpdateCancel}
                            onImageClick={this.onImageClick}
                        />
                        <ChatInput
                            msgSend={() => {
                                this.msgSend();
                            }}
                            onChange={(e) =>
                                this.setState({ text: e.target.value })
                            }
                            text={text}
                            files={this.state.uploadedFiles}
                            removeImage={this.removeImage}
                        />
                        {this.state.attachmentIndexes?.attachmentIndex !==
                        null ? (
                            <AttachmentViewer
                                files={
                                    this.state.messages[
                                        this.state.attachmentIndexes
                                            .messageIndexes
                                    ].attachments
                                }
                                onClose={this.onAttachmentViewerClose}
                            />
                        ) : null}
                    </div>
                </div>
            </Dropzone>
        );
    }
}

const mapStateToProps = (state) => {
    const id = state?.channelReducer?.selectedChannel?._id;
    const index = state?.channelReducer.channelList.findIndex(
        (el) => el._id === id
    );
    const selectedChannel = state?.channelReducer.channelList[index];
    return {
        channel: selectedChannel,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setChannel: (action) => dispatch(action),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
