// eslint-disable-next-line @typescript-eslint/no-var-requires
const withNx = require('@nrwl/next/plugins/with-nx');
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');

//Rewriting all routes that are not matched by /pages to react router
module.exports = {
  async rewrites() {
    return [
      {
        source: '/:any*',
        destination: '/',
      },
    ];
  },
};

// module.exports = withNx((phase, { defaultConfig }) => {
//   if (phase === PHASE_DEVELOPMENT_SERVER) {
//     return {
//       /* development only config options here */
//       nx: {
//         // Set this to false if you do not want to use SVGR
//         // See: https://github.com/gregberge/svgr
//         svgr: true,
//       },
//       //Rewriting all routes that are not matched by /pages to react router
//       async rewrites() {
//         return [
//           {
//             source: '/:any*',
//             destination: '/',
//           },
//         ];
//       },
//     };
//   }
//   return {
//     async rewrites() {
//       return [
//         {
//           source: '/:any*',
//           destination: '/',
//         },
//       ];
//     },
//     /* config options for all phases except development here */
//   };
// });
