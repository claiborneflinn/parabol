import styled from '@emotion/styled'
import graphql from 'babel-plugin-relay/macro'
import React from 'react'
import {createFragmentContainer} from 'react-relay'
import Icon from '../../../components/Icon'
import {DECELERATE} from '../../../styles/animation'
import textOverflow from '../../../styles/helpers/textOverflow'
import {PALETTE} from '../../../styles/paletteV2'
import {ICON_SIZE} from '../../../styles/typographyV2'
import makeTemplateDescription from '../../../utils/makeTemplateDescription'
import {ReflectTemplateItem_template} from '../../../__generated__/ReflectTemplateItem_template.graphql'

const TemplateItem = styled('li')<{isActive: boolean}>(({isActive}) => ({

  backgroundColor: isActive ? PALETTE.BACKGROUND_MAIN_DARKENED : undefined,
  borderRadius: 2,
  cursor: 'pointer',
  display: 'flex',
  fontSize: 14,
  justifyContent: 'space-between',
  lineHeight: '22px',
  paddingTop: 12,
  paddingBottom: 12,
  paddingLeft: 16,
  transition: `background-color 300ms ${DECELERATE}`,
  width: '100%'
}))

const TemplateItemDetails = styled('div')({
  display: 'flex',
  flexDirection: 'column'
})

const TemplateTitle = styled('div')({
  ...textOverflow,
  color: PALETTE.TEXT_MAIN,
  fontSize: 16,
  fontWeight: 600,
  lineHeight: '24px'
})

const TemplateDescription = styled('div')({
  ...textOverflow,
  color: PALETTE.TEXT_GRAY,
  fontSize: 12,
  lineHeight: '16px'
})

const TemplateItemAction = styled('div')({

})

const EditOrCloneIcon = styled(Icon)({
  color: PALETTE.TEXT_GRAY,
  fontSize: ICON_SIZE.MD18,
  padding: 8,
  paddingRight: 16
})


interface Props {
  isActive: boolean
  teamId: string
  onClick: () => void
  template: ReflectTemplateItem_template
  lowestScope: 'TEAM' | 'ORGANIZATION' | 'PUBLIC'
}

const ReflectTemplateItem = (props: Props) => {
  const {lowestScope, isActive, teamId, onClick, template} = props
  const {name: templateName} = template
  const isOwner = template.teamId === teamId
  const description = makeTemplateDescription(lowestScope, template)
  return (
    <TemplateItem
      isActive={isActive}
      onClick={onClick}
    >
      <TemplateItemDetails>
        <TemplateTitle>{templateName}</TemplateTitle>
        <TemplateDescription>{description}</TemplateDescription>
      </TemplateItemDetails>
      <TemplateItemAction>
        <EditOrCloneIcon>{isOwner ? 'edit' : 'content_copy'}</EditOrCloneIcon>
      </TemplateItemAction>
    </TemplateItem>
  )
}

export default createFragmentContainer(
  ReflectTemplateItem,
  {
    template: graphql`
      fragment ReflectTemplateItem_template on ReflectTemplate {
        #get the details here so we can show them in the details view
        ...ReflectTemplateDetailsTemplate
        ...makeTemplateDescription_template
        id
        name
        lastUsedAt
        scope
        teamId
      }
    `
  }
)
