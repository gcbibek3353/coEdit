import AddDocumentBtn from "@/components/AddDocumentBtn";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from 'next/navigation'
import Image from "next/image";
import { getDocuments } from "@/lib/actions/room.actions";
import Link from "next/link";
import { dateConverter } from "@/lib/utils";
import DeleteModal from "@/components/DeleteModal";
import Notifications from "@/components/Notifications";

export default async function Home() {
  const clerkUser = await currentUser();
  if(!clerkUser) redirect('/sign-in');

  const roomDocuments = await getDocuments(clerkUser.emailAddresses[0].emailAddress);

  return (
    <main className="home-container">
      <Header className="sticky left-0 top-0">
        <div className="flex items-center gap-2 lg:gap-4">
          <Notifications />
          <SignedIn>
            <UserButton />
          </SignedIn>

        </div>
      </Header>
      {
        roomDocuments.data.length > 0 
        ? (<div className="document-list-container">
          <div className="documen-list-title">
            <h3 className="text-28-semibold"> All Documents </h3>
            <AddDocumentBtn
            userId="clerkUser.id"
            email="clerkUser.emailAddresses[0].emailAddress"
            />
          </div>
          <ul className="document-ul">
            {roomDocuments.data.map((document : any)=>(
              <li key={document.id} className="document-list-item">
                <Link href={`/documents/${document.id}`} className="flex flex-1 items-center gap-4">
                  <div className="hidden rounded-md bg-dark-500 p-2 sm:block">
                    <Image 
                    src="/assets/icons/doc.svg"
                    alt="file"
                    height={40}
                    width={40}
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="line-clamp-1 text-lg">{document.metadata.title}</p>
                    <p className="text-sm font-light text-blue-100">Created About {dateConverter(document.createdAt)} </p>
                  </div>
                </Link>
                <DeleteModal roomId={document.id}/>
                {/* we need to create a delete button here */}
              </li>
            ))
            }
          </ul>

        </div>)
        :(<div className="document-list-empty">
          <Image 
          src={'/assets/icons/doc.svg'}
          alt="document"
          height={40}
          width={40}
          className="mx-auto"
          />

          <AddDocumentBtn 
          userId={clerkUser.id}
          email = {clerkUser.emailAddresses[0].emailAddress}
          />
        </div>)
      }
    </main>
  );
}
