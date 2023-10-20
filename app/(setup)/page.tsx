import React from 'react';
import { db } from '@/lib/db';
import {redirect} from "next/navigation";
import InitialModal from "@/components/modals/initial-modal";
import { initialProfile } from "@/lib/initial-profile";

const SetupPage = async () => {
    const profile = await initialProfile()
    const server = await db.server.findFirst({
        where: {
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    })

    if (server) {
        return redirect(`/servers/${server.id}`)
    }


    return (<div>
        <InitialModal/>
    </div>);
};

export default SetupPage;