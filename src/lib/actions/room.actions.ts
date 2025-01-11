'use server';

import { nanoid } from 'nanoid'
import { liveblocks } from '../liveblocks';
import { revalidatePath } from 'next/cache';
import { error } from 'console';
import { getAccessType, parseStringify } from '../utils';
import { parse } from 'path';
import { redirect } from 'next/navigation';
import { emit, title } from 'process';
// import { getAccessType, parseStringify } from '../utils';
// import { redirect } from 'next/navigation';

export const createDocument = async ({ userId, email }: CreateDocumentParams) => {
  const roomId = nanoid();  // creating a unique room Id for every room.

  try {
    const metadata = {
      creatorId: userId,
      email,
      title: 'Untitled'
    }

    const usersAccesses: RoomAccesses = {
      [email]: ['room:write']
    }

    const room = await liveblocks.createRoom(roomId, {
      metadata,
      usersAccesses,
      defaultAccesses: []
    });
    
    revalidatePath('/');  // revalidatePath('/') is used to delete the cached data at '/' so that new data contains the currently formed Document also

    return (room);
  } catch (error) {
    console.log(`Error happened while creating a room: ${error}`);
  }
}

export const getDocument = async ({userId,roomId} : {userId : string,roomId : string})=>{
  try {
    
    const room = await liveblocks.getRoom(roomId);
    
    const hasAccess = Object.keys(room.usersAccesses).includes(userId);
  
    if(!hasAccess) throw new Error(`You don't have access to this document`);
  
    return parseStringify(room);
  } catch (error) {
    console.log(`Error occured while getting room`);
  }
}

export const updateDocument = async ( roomId : string, title : string)=>{
  try {
    const updatedRoom = await liveblocks.updateRoom(roomId,{
      metadata : {
        title
      }
    });

    revalidatePath(`/documents/${roomId}`);

    return parseStringify(updatedRoom);

  } catch (error) {
    console.log(`Error happened while updating room title`);
    
  }
}

export const getDocuments = async (email : string )=>{
  try {
    
    const rooms = await liveblocks.getRooms({userId : email});
    return parseStringify(rooms);
  } catch (error) {
    console.log(`Error occured while getting rooms`);
  }
}

export const updateDocumentAccess = async ({roomId,email,userType,updatedBy} : ShareDocumentParams)=>{
  try {
    const usersAccesses : RoomAccesses = {
      [email] : getAccessType(userType) as AccessType,
    }

    const room = await liveblocks.updateRoom(roomId,{usersAccesses});

    if(room){
      const notificationId = nanoid();
      await liveblocks.triggerInboxNotification({
        userId : email,
        kind : '$documentAccess',
        subjectId : notificationId,
        activityData : {
          userType,
          title : `You have been granted ${userType} access to the document by ${updatedBy.name}`, 
          updatedBy : updatedBy.name,
          avatar : updatedBy.avatar,
          email : updatedBy.email,
          
        }
      })
    }

    revalidatePath(`/documents/${roomId}`);
    return parseStringify(room);
    
  } catch (error) {
    console.log(`Error occured while updating document access`);
  }
}

export const removeCollaborator = async ({roomId,email} : {roomId : string, email : string})=>{
  try {
    const room = await liveblocks.getRoom(roomId);
    if(room.metadata.email === email){
      throw new Error(`Owner cannot be removed`);
    }
    const updatedRoom = await liveblocks.updateRoom(roomId,{
      usersAccesses : {
        [email] : null
      }
    });

    revalidatePath(`/documents/${roomId}`);
    return parseStringify(updatedRoom);
  } catch (error) {
    console.log(`Error occured while removing collaborator`);
  }
}

export const deleteDocument = async (roomId : string)=>{
  try {
    const room = await liveblocks.deleteRoom(roomId);
    revalidatePath('/');
    redirect('/');
    return room;
  } catch (error) {
    console.log(`Error occured while deleting document`);
  }
}