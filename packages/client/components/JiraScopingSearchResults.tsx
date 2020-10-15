import styled from '@emotion/styled'
import graphql from 'babel-plugin-relay/macro'
import React, {useMemo, useState} from 'react'
import {createFragmentContainer} from 'react-relay'
import {NewMeetingPhaseTypeEnum} from '../types/graphql'
import {JiraScopingSearchResults_meeting} from '../__generated__/JiraScopingSearchResults_meeting.graphql'
import {JiraScopingSearchResults_viewer} from '../__generated__/JiraScopingSearchResults_viewer.graphql'
import JiraScopingNoResults from './JiraScopingNoResults'
import JiraScopingSearchResultItem from './JiraScopingSearchResultItem'
import JiraScopingSelectAllIssues from './JiraScopingSelectAllIssues'
import FloatingActionButton from './FloatingActionButton'
import {ZIndex} from '~/types/constEnums'
import Icon from './Icon'
import NewJiraIssueInput from './NewJiraIssueInput'

const Button = styled(FloatingActionButton)({
  color: '#fff',
  padding: '10px 12px',
  width: '150px',
  top: '85%',
  left: '74%',
  position: 'absolute',
  zIndex: ZIndex.FAB
})

const StyledIcon = styled(Icon)({
  paddingRight: 8
})

const StyledLabel = styled('div')({
  fontSize: 16,
  fontWeight: 600
})

const ResultScroller = styled('div')({
  overflow: 'auto'
})

interface Props {
  viewer: JiraScopingSearchResults_viewer
  meeting: JiraScopingSearchResults_meeting
}

const JiraScopingSearchResults = (props: Props) => {
  const {viewer, meeting} = props
  const {team} = viewer
  const {jiraIssues} = team!
  const {error, edges} = jiraIssues
  console.log('JiraScopingSearchResults -> USER  edges', edges)
  const issueCount = edges.length
  const {id: meetingId, phases} = meeting
  const [isEditing, setIsEditing] = useState(false)
  const estimatePhase = phases.find(
    (phase) => phase.phaseType === NewMeetingPhaseTypeEnum.ESTIMATE
  )!
  const {stages} = estimatePhase
  console.log('JiraScopingSearchResults -> MEETING stages', stages)
  // console.log('JiraScopingSearchResults -> stages', stages)
  const usedJiraIssueIds = useMemo(() => {
    const usedJiraIssueIds = new Set<string>()
    stages!.forEach((stage) => {
      if (!stage.issue) return
      usedJiraIssueIds.add(stage.issue.id)
    })
    return usedJiraIssueIds
  }, [stages])
  console.log('usedJiraIssueIds -> MEETING usedJiraIssueIds', usedJiraIssueIds)
  // console.log('usedJiraIssueIds -> usedJiraIssueIds', usedJiraIssueIds)

  // Terry, you can use this in case you need to put some final touches on styles
  /*   const [showMock, setShowMock] = useState(false)
    useHotkey('f', () => {
      setShowMock(!showMock)
    })
    if (showMock) {
      return (
        <MockScopingList />
      )
    } */
  if (issueCount === 0) {
    return <JiraScopingNoResults error={error?.message} />
  }

  return (
    <>
      <JiraScopingSelectAllIssues
        usedJiraIssueIds={usedJiraIssueIds}
        issues={edges}
        meetingId={meetingId}
      />
      <ResultScroller>
        <NewJiraIssueInput
          isEditing={isEditing}
          meeting={meeting}
          setIsEditing={setIsEditing}
          viewer={viewer}
        />
        {edges.map(({node}) => {
          const isSelected = usedJiraIssueIds.has(node.id)
          return (
            <JiraScopingSearchResultItem
              key={node.id}
              issue={node}
              isSelected={isSelected}
              meetingId={meetingId}
            />
          )
        })}
      </ResultScroller>
      <Button onClick={() => setIsEditing(true)} palette='blue'>
        <StyledIcon>{'add'}</StyledIcon>
        <StyledLabel>{'New Issue'}</StyledLabel>
      </Button>
    </>
  )
}

export default createFragmentContainer(JiraScopingSearchResults, {
  meeting: graphql`
    fragment JiraScopingSearchResults_meeting on PokerMeeting {
      ...NewJiraIssueInput_meeting
      id
      phases {
        phaseType
        ... on EstimatePhase {
          stages {
            ... on EstimateStageJira {
              issue {
                id
              }
            }
          }
        }
      }
    }
  `,
  viewer: graphql`
    fragment JiraScopingSearchResults_viewer on User {
      id
      ...NewJiraIssueInput_viewer
      team(teamId: $teamId) {
        jiraIssues(
          first: $first
          queryString: $queryString
          isJQL: $isJQL
          projectKeyFilters: $projectKeyFilters
        ) @connection(key: "JiraScopingSearchResults_jiraIssues") {
          error {
            message
          }
          edges {
            ...JiraScopingSelectAllIssues_issues
            node {
              ...JiraScopingSearchResultItem_issue
              id
              summary
            }
          }
        }
      }
    }
  `
})
