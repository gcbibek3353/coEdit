import CollaborativeRoom from '@/components/CollaborativeRoom'
import { getDocument } from '@/lib/actions/room.actions'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

const page = async({params} : SearchParamProps) => {
  const id = await params.id;
  const clerkUser = await currentUser();

  if(!clerkUser) redirect('/sign-in');
  // console.log(id,clerkUser);

  const room = await getDocument({
    roomId : id,
    userId : clerkUser.emailAddresses[0].emailAddress
  })
  if(!room) redirect('/');

  // We need to get the users access permissions 

  return (
    <main className='flex flex-col w-full items-center'>
     <CollaborativeRoom 
     roomId = {id}
     roomMetadata = {room.metaData}
     />
    </main>
  )
}

export default page