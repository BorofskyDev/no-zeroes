import { Heading, PageContainer, PrimaryBtn} from '@/components'
import styles from './Dashboard.module.scss'

export const Dashboard = () => { 
    return ( 
        <PageContainer className={styles.dashboard}>
            <Heading as='h1' size='page'>No Zer0s</Heading>
            <PrimaryBtn variant='primary'>i asked</PrimaryBtn>

            {/* Editable entries */}

            {/* Leaderboard */}

            {/* Stats */}
        </PageContainer>
    )
}