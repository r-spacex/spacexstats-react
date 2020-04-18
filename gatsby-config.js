const siteUrl = `https://www.spacexstats.xyz`;

module.exports = {
  siteMetadata: {
    title: `SpaceX Stats`,
    description: `SpaceX Stats is the ultimate place to keep track of SpaceX's achievements into providing cheaper access to space and making human life multiplanetary.`,
    author: `Albéric Trancart`,
    siteUrl,
  },
  plugins: [
    // Codebase
    `gatsby-plugin-resolve-src`,
    `gatsby-plugin-eslint`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },

    // Assets
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-styled-components`,

    // SEO
    `gatsby-plugin-robots-txt`,
    `gatsby-plugin-sitemap`,
    {
      resolve: `gatsby-plugin-canonical-urls`,
      options: {
        siteUrl,
      },
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: `UA-108091199-1`,
        head: false,
      },
    },

    // Offline capability
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `SpaceX Stats`,
        short_name: `SpaceX Stats`,
        start_url: `/`,
        background_color: `#005189`,
        theme_color: `#005189`,
        display: `standalone`,
        icon: `static/oglogo.jpg`,
      },
    },
    `gatsby-plugin-offline`,
    `gatsby-plugin-netlify`,
  ],
};
