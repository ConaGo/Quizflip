// eslint-disable-next-line @typescript-eslint/no-var-requires
const withNx = require('@nrwl/next/plugins/with-nx');
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');

module.exports = withNx((phase, { defaultConfig }) => {
  const backEnd = process.env.BACKEND_HOST + parseInt(process.env.BACKEND_PORT);
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      /* development only config options here */
      nx: {
        // Set this to false if you do not want to use SVGR
        // See: https://github.com/gregberge/svgr
        svgr: true,
      },
    };
  }
  return {
    /* config options for all phases except development here */
  };
});
