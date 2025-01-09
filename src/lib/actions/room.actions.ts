'use server';

import { nanoid } from 'nanoid'
import { liveblocks } from '../liveblocks';
import { revalidatePath } from 'next/cache';
import { error } from 'console';
import { parseStringify } from '../utils';
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
      defaultAccesses: ['room:write']
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
    
    // const hasAccess = Object.keys(room.usersAccesses).includes(userId);
  
    // if(!hasAccess) throw new Error(`You don't have access to this document`);
  
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
