import React from 'react'
import { Avatar, Tooltip, Divider, Badge } from 'antd';
import './Sidebar.css'
import { useChat } from '../Hooks/useChat';

export default function Sidebar() {
    const { user, friends } = useChat();

    return (
        <div className='ryvn-sidebar-container'>
            <div className='ryvn-sidebar-one'>
                <Tooltip placement="left" key={user[0]?.name} title={user[0]?.name}>
                    <Avatar
                        className='ryvn-avatar'
                        style={{
                            backgroundImage: `url(${user[0]?.avatar})`,
                        }}
                    >
                    </Avatar>
                </Tooltip>
                <Divider plain style={{ color: 'gray' }}>Friends</Divider>
            </div>

            <div className='ryvn-sidebar-two'>
                {
                    friends.map((friend, idx) => {
                        return (
                            <Tooltip placement="left" key={friend?.name} title={friend?.name}>
                                <Badge key={`${idx}-badage`} dot={friend?.is_login} color={'blue'} size='default' offset={[-5, 10]}>
                                    <Avatar
                                        key={`${idx}-avatar-sidebar`}
                                        className='ryvn-avatar'
                                        style={{
                                            backgroundImage: `url(${friend?.avatar})`,
                                        }}
                                    >
                                    </Avatar>
                                </Badge>
                            </Tooltip>)
                    })
                }
            </div>
        </div>

    )
}
