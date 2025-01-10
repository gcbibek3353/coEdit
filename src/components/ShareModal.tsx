'use client'

import { useSelf } from '@liveblocks/react/suspense';
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import Image from 'next/image';
import { Button } from './ui/button';
import UserTypeSelector from './UserTypeSelector';
import Collaborator from './Collaborator';
import { updateDocumentAccess } from '@/lib/actions/room.actions';


const ShareModal = ({ roomId, collaborators, creatorId, currentUserType }: ShareDocumentDialogProps) => {
    const user = useSelf();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState<string>('');
    const [userType, setUserType] = useState<UserType>('viewer');

    const shareDocumentHandler = async () => {
        setLoading(true);

        await updateDocumentAccess({ roomId, email, userType: userType as UserType, updatedBy: user.info });

        setLoading(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <Button className='gradient-blue flex h-9 gap-1 px-4' disabled={currentUserType != 'editor'}>
                    <Image src="/assets/icons/share.svg" alt="Share" width={20} height={20} className='min-w-4 md:size-5' />
                    <p className='mr-1 hidden sm:block'>Share </p>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Manage Who can view this project..</DialogTitle>
                    <DialogDescription>
                        Select which users can view and edit this document
                    </DialogDescription>
                </DialogHeader>
                <Label htmlFor='email' className='text-blue-100 mt-6'>Email addresses</Label>
                <div className='flex flex-col items-center gap-3'>
                    <div className="flex flex-1 rounded-md bg-dark-400">
                        <Input id='email' placeholder=' Enter Email Adress' value={email} onChange={(e) => setEmail(e.target.value)} className='share-input' />
                        <UserTypeSelector userType={userType} setUserType={setUserType} />
                        <Button type='submit' onClick={shareDocumentHandler} className='gradient-blue flex h-full gap-1 px-5' disabled={loading}>{loading ? 'Sending...' : 'Invite'}</Button>
                    </div>
                    <div className='my-2 space-y-2' >
                        <ul className='flex flex-col'>{
                            collaborators.map((collaborator) => (
                                <Collaborator key={collaborator.id} roomId={roomId} creatorId={creatorId} email={collaborator.email} collaborator={collaborator} user={user.info} />)
                            )}</ul>

                    </div>


                </div>

            </DialogContent>
        </Dialog>

    )
}

export default ShareModal