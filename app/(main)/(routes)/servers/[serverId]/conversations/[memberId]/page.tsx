import {currentProfile} from "@/lib/current-profile";
import {redirectToSignIn} from "@clerk/nextjs";
import {db} from "@/lib/db";
import {redirect} from "next/navigation";
import {getOrCreateConversation} from "@/lib/conversation";
import {ChatHeader} from "@/components/chat/chat-header";
import {ChatMessages} from "@/components/chat/chat-messages";
import { ChatInput } from "@/components/chat/chat-input";

interface MemberIdPageProps {
    params: {
        memberId: string;
        serverId: string;
    }
}

const MemberIdPage = async ({params}: MemberIdPageProps) => {
    const profile = await currentProfile();

    if (!profile) {
        return redirectToSignIn();
    }

    const currentMember = await db.member.findFirst({
        where: {
            serverId: params.serverId,
            profileId: profile.id
        },
        include: {
            profile: true
        }
    })
    if (!currentMember) {
        return redirect("/")
    }

    const conversation = await getOrCreateConversation(currentMember.id, params.memberId);

    if (!conversation) {
        return redirect(`/servers/${params.serverId}`);
    }

    const { memberOne, memberTwo } = conversation;

    const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne;

    console.log(conversation);

    return (
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
            <ChatHeader
                imageUrl={otherMember.profile.imageUrl}
                serverId={params.serverId}
                name={otherMember.profile.name}
                type="conversation" />
            <ChatMessages
                name={otherMember.profile.name}
                member={currentMember}
                chatId={conversation.id}
                apiUrl="/api/direct-messages"
                socketUrl="/api/socket/direct-messages"
                socketQuery={{conversationId: conversation.id}}
                paramKey="conversationId"
                paramValue={conversation.id}
                type="conversation"/>
            <ChatInput
                name={otherMember.profile.name}
                type="conversation"
                apiUrl="/api/socket/direct-messages"
                query={{conversationId: conversation.id}}
            />
        </div>
    )
}

export default MemberIdPage