import CollaborativeRoom from '@/components/CollaborativeRoom'
import { getDocument } from '@/lib/actions/room.actions'
import { getClerkUsers } from '@/lib/actions/user.actions'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

const page = async({params} : SearchParamProps) => {
  const id = await params.id;
  const clerkUser = await currentUser();

  if(!clerkUser) redirect('/sign-in');
  // console.log(id,clerkUser);

  const room = await getDocument({
    roomId : id,
    userId : clerkUser.emailAddresses[0].emailAddress,
  })
  if(!room) redirect('/');
  // console.log('room data is ' + room);

  const userIds = Object.keys(room.usersAccesses);
  const users = await getClerkUsers({userIds});
  console.log(users);
  

  // const usersData = users.map((user:User)=>({
  //   ...user,
  //   userType : room.usersAcceeses[user.email]?.includes('room:write') ? 'editor' : 'viewer'
  // }))

  const currentUserType = room.usersAccesses[clerkUser.emailAddresses[0].emailAddress]?.includes('room:write') ? 'editor' : 'viewer';

  // We need to get the users access permissions 

  return (
    <main className='flex flex-col w-full items-center'>
     <CollaborativeRoom 
     roomId = {id}
     roomMetadata = {room.metadata}
    //  users = {usersData}
     currentUserType = {currentUserType}
     />
    </main>
  )
}

export default page