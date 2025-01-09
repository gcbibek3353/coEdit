import { Composer, Thread } from '@liveblocks/react-ui';
import { useThreads } from '@liveblocks/react/suspense';
import React from 'react'

const ThreadWrapper = ({thread}:ThreadWrapperProps) => {
    return (
        <Thread thread={thread} />
    )
}

const Comments = () => {
    const {threads} = useThreads();

  return (
    <div className='comments-container'>
        <Composer className='comment-composer' />

        {threads.map((thread) => (
            <ThreadWrapper key={thread.id} thread={thread} />
        ))}

    </div>
  )
}

export default Comments