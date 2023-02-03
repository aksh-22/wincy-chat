import { Menu, MenuItem } from '@mui/material';

type Props = {
    anchorEl: any;
    open: boolean;
    onClose: () => void;
    options: any[];
    renderItem?: any;
    onPress: (data: any) => void;
};

const ITEM_HEIGHT = 48;

const CustomMenu = ({
    anchorEl,
    open,
    onClose,
    options,
    renderItem,
    onPress,
}: Props) => {
    return (
        <Menu
            id='long-menu'
            MenuListProps={{
                'aria-labelledby': 'long-button',
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={onClose}
            PaperProps={{
                style: {
                    maxHeight: ITEM_HEIGHT * 4.5,
                    width: '20ch',
                    background: 'var(--sidebarColor)',
                },
            }}
        >
            {options.map((option) => (
                <MenuItem
                    key={option.id}
                    selected={option === 'Pyxis'}
                    onClick={() => {
                        onPress(option.key);
                        onClose();
                    }}
                >
                    {renderItem(option) ?? option}
                </MenuItem>
            ))}
        </Menu>
    );
};

export default CustomMenu;
