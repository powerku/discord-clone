import React from 'react';
import {redirect} from "next/navigation";
import {db} from "@/lib/db";
import {currentProfile} from "@/lib/current-profile";
import {ChannelType, MemberRole} from "@prisma/client";
import ServerHeader from "@/components/server/server-header";
import {ScrollArea} from "@/components/ui/scroll-area";
import ServerSearch from "@/components/server/server-search";
import {Hash, Mic, ShieldCheck, Video} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import {ServerSection} from "@/components/server/server-section";
import {ServerMember} from "@/components/server/server-member";
import {ServerChannel} from "@/components/server/server-channel";

interface ServerSidebarProps {
    serverId: string;
}

const iconMap = {
    [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4"/>,
    [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4"/>,
    [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4"/>
}

const roleIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: <ShieldCheck className="mr-2 h-4 w-4 text-indigo-500"/>,
    [MemberRole.ADMIN]: <ShieldCheck className="mr-2 h-4 w-4 text-indigo-500"/>,
}


const ServerSidebar = async ({
                           serverId
}: ServerSidebarProps) => {
    const profile = await currentProfile()

    if (!profile) {
        return redirect('/')
    }

    const server = await db.server.findUnique({
      where: {
        id: serverId,
      },
        include: {
          channels: {
              orderBy: {
                  createdAt: "asc"
              }
          },
            members: {
              include: {
                    profile: true
              },
                orderBy: {
                  role: "asc"
                }
            }
        }
    })

    const textChannels = server?.channels.filter(channel => channel.type === ChannelType.TEXT);
    const audioChannels = server?.channels.filter(channel => channel.type === ChannelType.AUDIO);
    const videoChannels = server?.channels.filter(channel => channel.type === ChannelType.VIDEO);
    const members = server?.members.filter(member => member.profileId !== profile.id);

    if (!server) {
        return redirect('/')
    }

    const role =  server.members.find(member => member.profileId === profile.id)?.role;



    return (
        <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31]
        bg-[#F2F3F5]">
            <ServerHeader
                server={server}
                role={role}
            ></ServerHeader>
            <ScrollArea className="flex-1 px-3">
                <div className="mt-2">
                    <ServerSearch
                        data={[
                            {
                                label: 'Text Channels',
                                type: "channel",
                                data: textChannels?.map(channel => ({
                                    icon: iconMap[channel.type],
                                    name: channel.name,
                                    id: channel.id
                                }))
                            },
                            {
                                label: 'Voice Channels',
                                type: "channel",
                                data: audioChannels?.map(channel => ({
                                    icon: iconMap[channel.type],
                                    name: channel.name,
                                    id: channel.id
                                }))
                            },
                            {
                                label: 'Video Channels',
                                type: "channel",
                                data: videoChannels?.map(channel => ({
                                    icon: iconMap[channel.type],
                                    name: channel.name,
                                    id: channel.id
                                }))
                            },
                            {
                                label: 'Members',
                                type: "member",
                                data: members?.map(member => ({
                                    id: member.id,
                                    name: member.profile.name,
                                    icon: roleIconMap[member.role]
                                }))
                            },
                        ]}
                    />
                </div>
                <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2"/>
                {!!textChannels?.length && (
                    <div className="mb-2">
                        <ServerSection
                            sectionType="channels"
                            channelType={ChannelType.TEXT}
                            role={role}
                            label="Text Channels"

                        />
                        <div className="space-y-[2px]"></div>
                        {textChannels.map((channel) => (
                            <ServerChannel
                                key={channel.id}
                                channel={channel}
                                role={role}
                                server={server}
                            >
                            </ServerChannel>
                        ))}
                    </div>
                )}
                {!!audioChannels?.length && (
                    <div className="mb-2">
                        <ServerSection
                            sectionType="channels"
                            channelType={ChannelType.AUDIO}
                            role={role}
                            label="Audio Channels"

                        />
                        <div className="space-y-[2px]"></div>
                        {audioChannels.map((channel) => (
                            <ServerChannel
                                key={channel.id}
                                channel={channel}
                                role={role}
                                server={server}
                            >
                            </ServerChannel>
                        ))}
                    </div>
                )}
                {!!videoChannels?.length && (
                    <div className="mb-2">
                        <ServerSection
                            sectionType="channels"
                            channelType={ChannelType.VIDEO}
                            role={role}
                            label="Video Channels"

                        />

                        <div className="space-y-[2px]"></div>
                        {videoChannels.map((channel) => (
                            <ServerChannel
                                key={channel.id}
                                channel={channel}
                                role={role}
                                server={server}
                            >
                            </ServerChannel>
                        ))}
                    </div>
                )}
                {!!members?.length && (
                    <div className="mb-2">
                        <ServerSection
                            sectionType="members"
                            role={role}
                            label="Mebmers"
                            server={server}
                        />
                        <div className="space-y-[2px]"></div>
                        {members.map((member) => (
                            <ServerMember
                                key={member.id}
                                member={member}
                                server={server}
                            ></ServerMember>
                        ))}
                    </div>
                )}
            </ScrollArea>
        </div>
    );
};

export default ServerSidebar;