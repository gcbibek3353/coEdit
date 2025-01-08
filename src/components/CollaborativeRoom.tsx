'use client'
import { ClientSideSuspense, RoomProvider } from '@liveblocks/react'
import Loader from './Loader'
import { Editor } from '@/components/editor/Editor'
import Header from '@/components/Header'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import ActiveCollaborators from './ActiveCollaborators'
import { KeyboardEvent, useEffect, useRef, useState } from 'react'
import { Input } from './ui/input'
import Image from 'next/image'
import { updateDocument } from '@/lib/actions/room.actions'

const CollaborativeRoom = ({ roomId, roomMetadata }: CollaborativeRoomProps) => {
  const currentUserType = 'editor'

  const [editing, setEditing] = useState<Boolean>(false);
  const [loading, setLoading] = useState<Boolean>(false);
  const [documentTitle, setDocumentTitle] = useState<string>(roomMetadata.title);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const updateTitleHandler = async (e: KeyboardEvent<HTMLInputElement>) => {
    if(e.key==="Enter"){
      setLoading(true);
      try {
        if(documentTitle !== roomMetadata.title){
          const updatedDocument = await updateDocument(roomId,documentTitle)
          if(updatedDocument) setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    }
  }

  useEffect(()=>{
    const handleClickOutside = (e : MouseEvent)=>{
      if(containerRef.current   && !containerRef.current.contains(e.target as Node)){
        setEditing(false);
        updateDocument(roomId,documentTitle);
      }
    }
    document.addEventListener('mousedown',handleClickOutside);

    return ()=>{
      document.removeEventListener('mousedown',handleClickOutside);
    }
  },[roomId,documentTitle])

  useEffect(()=>{
    if(editing && inputRef.current){
      inputRef.current.focus();
    }
  },[editing])

  return (
    // Room Provider is not provided at root element but It is provided to this component because we want multiple rooms 
    <RoomProvider id={roomId}>
      <ClientSideSuspense fallback={<Loader />}>
        <div className='collaborative-room'>
          <Header>
            <div ref={containerRef} className='flex w-fit items-center justify-center gap-2'>
              {editing && !loading
                ? (
                  <Input
                    type='text'
                    value={documentTitle}
                    ref={inputRef}
                    placeholder='Enter title'
                    onChange={(e) => setDocumentTitle(e.target.value)}
                    onKeyDown={updateTitleHandler}
                    disabled={!editing}
                    className='document-title-input'
                  />
                )
                : (
                  <>
                    <p className='documet-title'>{documentTitle}</p>
                  </>
                )
              }
              {
                currentUserType === 'editor' && !editing && (
                  <Image
                    src='/assets/icons/edit.svg'
                    alt='edit'
                    width={24}
                    height={24}
                    onClick={() => setEditing(true)}
                    className='cursor-pointer'
                  />
                )
              }

              {
                currentUserType !== 'editor' && !editing &&(
                  <p className='view-only-tag'>view Only </p>
                )
              }
              {
                loading && <p className='text-sm text-gray-400'>Saving...</p>
              }

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