'use client'
import { ClientSideSuspense, RoomProvider } from '@liveblocks/react'
import Loader from './Loader'
import { Editor } from '@/components/editor/Editor'
import Header from '@/components/Header'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import ActiveCollaborators from './ActiveCollaborators'
import { useRef, useState } from 'react'
import { Input } from './ui/input'

const CollaborativeRoom = ({ roomId, roomMetadata }: CollaborativeRoomProps) => {
  const [editing, setEditing] = useState<Boolean>(false);
  const [loading, setLoading] = useState<Boolean>(false);
  // const [documentTitle, setDocumentTitle] = useState<String>(roomMetadata.title);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  return (
    // Room Provider is not provided at root element but It is provided to this component because we want multiple rooms 
    <RoomProvider id={roomId}>
      <ClientSideSuspense fallback={<Loader />}>
        <div className='collaborative-room'>
          <Header>
            <div ref={containerRef} className='flex w-fit items-center justify-center gap-2'>
              {/* {editing && !loading
                ? (
                  <Input />
                )
                : (
                  <>
                    <p className='documet-title'>{documentTitle}</p>

                  </>
                )
              } */}
                    <p className='documet-title'>Hardcoded Title </p>
            </div>
            <div className='flex w-full flex-1 justify-end gap-2 sm:gap-3'>
              <ActiveCollaborators />
              <SignedOut>
                <SignInButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </Header>
          <Editor />
        </div>
      </ClientSideSuspense>
    </RoomProvider>
  )
}

export default CollaborativeRoom