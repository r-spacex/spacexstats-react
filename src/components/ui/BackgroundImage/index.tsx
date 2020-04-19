import React, { ReactNode } from 'react';
import { StaticQuery, graphql } from 'gatsby';
import BackgroundImage from 'gatsby-background-image';

interface Props {
  filename: string;
  children: ReactNode;
  // eslint-disable-next-line
  tag: any;
}

const BackgroundImg: React.FC<Props> = ({
  filename,
  children,
  tag,
  ...rest
}) => (
  <StaticQuery
    query={graphql`
      query {
        images: allFile {
          edges {
            node {
              relativePath
              name
              childImageSharp {
                fluid(maxWidth: 2560) {
                  ...GatsbyImageSharpFluid_withWebp
                }
              }
            }
          }
        }
      }
    `}
    render={(data) => {
      const image = data.images.edges.find((n) =>
        n.node.relativePath.includes(filename),
      );
      if (!image) {
        return null;
      }

      return (
        <BackgroundImage
          Tag={tag}
          fluid={image.node.childImageSharp.fluid}
          {...rest}
        >
          {children}
        </BackgroundImage>
      );
    }}
  />
);

export default BackgroundImg;
