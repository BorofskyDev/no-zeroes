'use client'

import { useState} from 'react'
import { Heading, IAskedModal, PageContainer, PrimaryBtn} from '@/components'
import styles from './Dashboard.module.scss'

export const Dashboard = () => { 
    const [ isIAskedOpen, setIsIAskedOpen ] = useState(false)

    return ( 
        <PageContainer className={styles.dashboard}>
            <Heading as='h1' size='page'>No Zer0s</Heading>
            <PrimaryBtn variant='primary' onClick={() => setIsIAskedOpen(true)}>i asked</PrimaryBtn>
        
        <IAskedModal isOpen={isIAskedOpen} onClose={() => setIsIAskedOpen(false)} />


            {/* Editable entries */}

            {/* Leaderboard */}

            {/* Stats */}
        </PageContainer>
    )
}