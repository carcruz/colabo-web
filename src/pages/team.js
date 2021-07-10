import React, { useState } from "react"
import { graphql } from "gatsby"
import { Box, Heading, Flex, Close } from "@theme-ui/components"
import { DialogContent, DialogOverlay } from "@reach/dialog"
import "@reach/dialog/styles.css"

import Layout from "../components/layout"
import Seo from "../components/seo"

import Image from "../components/image"

import { groupBy } from "../utils"

const Team = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const team = data.allFile.nodes.map(post => {
    return {
      ...post.childMarkdownRemark.frontmatter,
      html: post.childMarkdownRemark.html,
    }
  })

  const grupedTeam = groupBy(team, "category")

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="Team" />
      <Box mt={5}>
        <Heading>
          Lab Members & <br /> Collaborators
        </Heading>
        <Box my={5}>
          <Heading mb={4}>Members</Heading>
          <MembersWrapper>
            {grupedTeam.member &&
              grupedTeam.member.map(member => (
                <Member key={member.name} member={member} />
              ))}
          </MembersWrapper>
        </Box>

        <Box my={5}>
          <Heading mb={4}>Former Students</Heading>
          <MembersWrapper>
            {grupedTeam.former_student &&
              grupedTeam.former_student.map(member => (
                <Member key={member.name} member={member} />
              ))}
          </MembersWrapper>
        </Box>

        <Box my={5}>
          <Heading mb={4}>Collaborators</Heading>
          <MembersWrapper>
            {grupedTeam.collaborator &&
              grupedTeam.collaborator.map(member => (
                <Member key={member.name} member={member} />
              ))}
          </MembersWrapper>
        </Box>
      </Box>
    </Layout>
  )
}

const Member = ({ member }) => {
  const [showDialog, setShowDialog] = useState(false)
  const open = () => setShowDialog(true)
  const close = () => setShowDialog(false)
  const createMarkup = () => {
    return { __html: member.html }
  }
  return (
    <Box margin={2} sx={{ cursor: "pointer" }}>
      <Box onClick={open} sx={{ width: "220px", margin: "0 auto" }}>
        <Image fluidPath={member.avatar.childImageSharp.fluid} />
      </Box>
      <DialogOverlay
        isOpen={showDialog}
        onDismiss={close}
        style={{ background: "none", zIndex: 20 }}
      >
        <DialogContent
          className="dialog-content"
          style={{ border: "1px solid #000", position: "relative", }}
          aria-label={`${member.name} description`}
        >
          <Box sx={{ position: "absolute", right: 15, top: 15 }}>
            <Close onClick={close} />
          </Box>

          <Heading as="h3" mb={4} sx={{ textAlign: "left" }}>
            {member.name}
          </Heading>
          <div dangerouslySetInnerHTML={createMarkup()} />
        </DialogContent>
      </DialogOverlay>
    </Box>
  )
}

const MembersWrapper = ({ children }) => (
  <Flex
    sx={{
      alignContent: "center",
      alignItems: "center",
      justifyContent: "center",
      flexWrap: "wrap",
    }}
  >
    {children}
  </Flex>
)

export default Team

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }

    allFile(
      filter: { sourceInstanceName: { eq: "team" }, extension: { eq: "md" } }
      sort: { fields: sourceInstanceName }
    ) {
      nodes {
        childMarkdownRemark {
          frontmatter {
            name
            category
            avatar {
              childImageSharp {
                fluid {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
          html
        }
      }
    }
  }
`
